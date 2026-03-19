import { getRequestContext } from '@cloudflare/next-on-pages';
import { cache } from 'react';
import { Skill, Category, Keyword } from '../types';
import { STATIC_CATEGORIES } from './staticData';

export const runtime = 'edge';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = process.env.D1_DATABASE_ID;
const D1_API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;

async function query(sql: string, params: any[] = []): Promise<any[]> {
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env && (ctx.env as any).DB) {
      const db = (ctx.env as any).DB as D1Database;
      const stmt = db.prepare(sql).bind(...params);
      const { results } = await stmt.all();
      return results || [];
    }
  } catch (e) { /* ignore */ }

  if (CLOUDFLARE_API_TOKEN && D1_DATABASE_ID && CLOUDFLARE_ACCOUNT_ID) {
    try {
      const response = await fetch(D1_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params: params.map(p => String(p)) }),
        cache: 'no-store'
      });
      const data = await response.json() as any;
      if (!response.ok) {
          console.error(`[D1 HTTP Error] ${response.status}: ${data.errors ? JSON.stringify(data.errors) : 'Unknown error'}`);
      }
      if (data.success && data.result && data.result[0]) return data.result[0].results || [];
    } catch (e) { console.error('[D1 Connection Failed]', e); }
  }
  return [];
}

const normalizeSkill = (row: any): Skill => {
  return {
    ...row,
    downloads: Number(row.downloads) || 0,
    card_clicks: Number(row.card_clicks) || 0,
    weekly_downloads: Number(row.weekly_downloads) || 0,
    weekly_card_clicks: Number(row.weekly_card_clicks) || 0,
    rating: Number(row.rating) || 0,
    ratings_count: Number(row.ratings_count) || 0,
    hotness_score: Number(row.hotness_score) || 0,
    dependencies: row.dependencies ? String(row.dependencies).trim() : null,
    components: row.components ? String(row.components).trim() : null,
    keywords: row.keywords ? (Array.isArray(row.keywords) ? row.keywords : String(row.keywords).split(',').map((s: string) => s.trim())) : [],
    category_slug: row.category_slug || undefined,
  };
};

// ==========================================
// 极速统计与分页模块 (杜绝 COUNT 全表扫描)
// ==========================================

export const getSkillsCount = async (): Promise<number> => {
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  return (results[0] as any)?.value || 0;
};

export const getSkillsMaxId = async (): Promise<number> => {
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  return (results[0] as any)?.value || 0;
};

export const getHotSkills = async (limit: number = 8): Promise<Skill[]> => {
  // ✅ 最小改动：热度相同时按 ID 正序（最老的数据排在前面）
  // 这样即便热度全是 0，也会和"最新发布"列表完美错开
  const sql = `
    SELECT * FROM skills
    WHERE status = 'pending'
    ORDER BY hotness_score DESC, created_at DESC
    LIMIT ?
  `;
  const results = await query(sql, [limit]);
  return results.map(normalizeSkill);
};

export const getRecentSkills = async (limit: number = 8): Promise<Skill[]> => {
  // ✅ 最小改动：按 ID 倒序，这比按字符串格式的时间戳排序更快、更省钱
  const sql = `SELECT * FROM skills WHERE status = 'pending' ORDER BY id DESC LIMIT ?`;
  const results = await query(sql, [limit]);
  return results.map(normalizeSkill);
};

export const getAllCategories = async (): Promise<Category[]> => {
  return STATIC_CATEGORIES.map(c => ({ ...c, description: null }));
};

export const getSkillBySlug = cache(async (slug: string): Promise<Skill | null> => {
  const results = await query(`SELECT * FROM skills WHERE slug = ? LIMIT 1`, [slug]);
  return results.length > 0 ? normalizeSkill(results[0]) : null;
});

export const getSkillCategories = cache(async (skillId: number): Promise<Category[]> => {
  const results = await query(`SELECT c.* FROM categories c JOIN skill_categories sc ON c.id = sc.category_id WHERE sc.skill_id = ?`, [skillId]);
  return results.map((dbCat: any) => {
    const staticMatch = STATIC_CATEGORIES.find(sc => sc.slug === dbCat.slug);
    return staticMatch ? { ...dbCat, icon: staticMatch.icon, name: staticMatch.name } : dbCat;
  });
});

export const getSkillKeywords = cache(async (skillId: number): Promise<Keyword[]> => {
  const results = await query(`SELECT k.* FROM keywords k JOIN skill_keywords sk ON k.id = sk.keyword_id WHERE sk.skill_id = ?`, [skillId]);
  return results.map((k: any) => ({ id: k.id, name: k.name }));
});

export const getAllSkillsWithTimestamps = async (limit: number, offset: number = 0): Promise<Array<{ slug: string, updated_at: string }>> => {
  const sql = `SELECT slug, updated_at FROM skills ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => ({ slug: r.slug, updated_at: r.updated_at }));
};

export interface SkillFilters {
  categorySlug?: string;
  keywords?: string[];
  authorType?: string;
  complexity?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

// ==========================================
// 终极智能搜索模块 (防弹级输入清洗 + BM25 排名)
// ==========================================

export const filterSkills = async (filters: SkillFilters): Promise<Skill[]> => {
  let sql = "SELECT s.* FROM skills s";
  const params: any[] = [];
  const conditions: string[] = ["s.status = 'pending'"];
  const joinedTables = new Set<string>();
  
  // 默认排序
  let orderByClause = " ORDER BY s.hotness_score DESC, s.created_at DESC";

  const ensureJoin = (joinSql: string, tableName: string) => {
    if (!joinedTables.has(tableName)) { 
        sql += joinSql; 
        joinedTables.add(tableName); 
    }
  };

  if (filters.categorySlug) {
    ensureJoin(` JOIN skill_categories sc ON s.id = sc.skill_id JOIN categories c ON sc.category_id = c.id`, 'categories');
    conditions.push('c.slug = ?');
    params.push(filters.categorySlug);
  }

  if (filters.keywords && filters.keywords.length > 0) {
    ensureJoin(` JOIN skill_keywords sk_f ON s.id = sk_f.skill_id JOIN keywords k_f ON sk_f.keyword_id = k_f.id`, 'keywords_filter');
    const placeholders = filters.keywords.map(() => '?').join(',');
    conditions.push(`k_f.name IN (${placeholders})`);
    params.push(...filters.keywords);
  }

  if (filters.authorType) { 
      conditions.push('s.author_type = ?'); 
      params.push(filters.authorType); 
  }
  if (filters.complexity) { 
      conditions.push('s.complexity = ?'); 
      params.push(filters.complexity); 
  }

  // 🔥 终极全文搜索防御逻辑 (代码层) 🔥
  if (filters.searchQuery && typeof filters.searchQuery === 'string') {
    // 1. 限制输入长度，防止恶意超长字符串注入
    const rawQuery = filters.searchQuery.slice(0, 50);
    const cleanTerm = rawQuery.replace(/[^a-zA-Z0-9\s\-]/g, ' ').trim().toLowerCase();

    // ✅ 2. 关键防御：搜索词必须 >= 3 个字符
    // 理由：FTS 搜 1-2 个字符极其耗能（读取万行级），3个字符以上通常只读几百行
    if (cleanTerm.length >= 3) {
        const words = cleanTerm.split(/\s+/).filter(w => w.length > 0);
        const ftsQuery = words.map(word => `"${word}"*`).join(' AND ');

        ensureJoin(` JOIN (
            SELECT rowid, bm25(skills_fts, 10.0, 5.0, 1.0) as rank
            FROM skills_fts
            WHERE skills_fts MATCH ?
            ORDER BY rank ASC
            LIMIT 100
        ) fts ON s.id = fts.rowid`, 'fts_search');

        params.push(ftsQuery);
        orderByClause = " ORDER BY fts.rank ASC";
    } else {
        // ✅ 4. 长度不足 3 的直接阻断（Rows Read = 0），保护数据库
        conditions.push(`1 = 0`);
    }
  }

  if (conditions.length > 0) { 
      sql += ' WHERE ' + conditions.join(' AND '); 
  }

  sql += orderByClause;
  
  const limit = filters.limit || 12;
  const offset = filters.offset || 0;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await query(sql, params);
  const skills = results.map(normalizeSkill);

  // 最后一道防线：去重
  return Array.from(new Map(skills.map(skill => [skill.id, skill])).values());
};

// ✅ [新增] Sitemap 专用极速查询：只查 slug，不排序(默认ID顺序)，不查时间
// 这样即使 OFFSET 很大，性能依然极高，且完全避免了 500 错误风险
export const getSitemapSlugs = async (limit: number, offset: number): Promise<string[]> => {
  const sql = `SELECT slug FROM skills ORDER BY id ASC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => r.slug);
};
