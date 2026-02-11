import { getRequestContext } from '@cloudflare/next-on-pages';
import { cache } from 'react';
import { Skill, Category, Keyword } from '../types';
import { STATIC_CATEGORIES } from './staticData';

// 这是一个工具库文件，声明 runtime 是安全的
export const runtime = 'edge';

// --- 环境变量凭证 (用于 HTTP 降级模式，用于本地开发) ---
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = process.env.D1_DATABASE_ID;
const D1_API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;

// --- 核心查询函数 ---

async function query(sql: string, params: any[] = []): Promise<any[]> {
  // 策略 1: 优先尝试 Cloudflare Pages 原生 Binding (生产环境最快)
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env && (ctx.env as any).DB) {
      const db = (ctx.env as any).DB as D1Database;
      const stmt = db.prepare(sql).bind(...params);
      const { results } = await stmt.all();
      return results || [];
    }
  } catch (e) { /* ignore */ }

  // 策略 2: HTTP API 降级 (用于本地开发)
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

// --- 数据标准化工具 ---

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

// --- 导出数据服务 ---

export const getSkillsCount = async (): Promise<number> => {
  const results = await query(`SELECT count(*) as total FROM skills`);
  return (results[0] as any)?.total || 0;
};

export const getSkillsMaxId = async (): Promise<number> => {
    const results = await query(`SELECT COUNT(id) as total FROM skills;`);
    return (results[0] as any)?.total || 0;
};

export const getHotSkills = async (limit: number = 8): Promise<Skill[]> => {
  const results = await query(`SELECT * FROM skills ORDER BY hotness_score DESC, created_at ASC LIMIT ?`, [limit]);
  return results.map(normalizeSkill);
};

export const getRecentSkills = async (limit: number = 8): Promise<Skill[]> => {
  const results = await query(`SELECT * FROM skills ORDER BY created_at DESC LIMIT ?`, [limit]);
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

// 新逻辑：参数 limit 变为必填，新增 offset 参数（默认为 0）
export const getAllSkillsWithTimestamps = async (limit: number, offset: number = 0): Promise<Array<{ slug: string, updated_at: string }>> => {
  // SQL 语句固定包含 LIMIT 和 OFFSET，这是解决内存溢出的关键
  const sql = `SELECT slug, updated_at FROM skills ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  // 参数数组固定包含 limit 和 offset
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

// --- 终极混合搜索策略 (Hybrid Search + RowID Anchor) ---
export const filterSkills = async (filters: SkillFilters): Promise<Skill[]> => {
  let sql = "SELECT s.* FROM skills s";
  const params: any[] = [];
  const conditions: string[] = [];
  const joinedTables = new Set<string>();

  const ensureJoin = (joinSql: string, tableName: string) => {
    if (!joinedTables.has(tableName)) { sql += joinSql; joinedTables.add(tableName); }
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

  if (filters.authorType) { conditions.push('s.author_type = ?'); params.push(filters.authorType); }
  if (filters.complexity) { conditions.push('s.complexity = ?'); params.push(filters.complexity); }

  // 🔥🔥🔥 核心修复逻辑 🔥🔥🔥
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const rawTerm = filters.searchQuery.trim().replace(/"/g, '');
    
    // 策略 A: 短词 (< 3 字符) -> 强制走 LIKE
    // 解决 Trigram 无法索引 "测试"、"AI" 等短词的问题
    if (rawTerm.length < 3) {
        const likeTerm = `%${rawTerm}%`;
        conditions.push(`(s.name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ? OR s.slug LIKE ?)`);
        params.push(likeTerm, likeTerm, likeTerm, likeTerm);
    } 
    // 策略 B: 长词 (>= 3 字符) -> 优先 FTS，失败兜底 LIKE
    else {
        const ftsTerm = `"${rawTerm}"`; 
        
        // ⚠️ 关键修复：只查询 rowid，不查询 slug/author_name
        // 这避免了外部内容表在某些情况下返回 NULL 导致匹配失败的问题
        const ftsSearchSql = `SELECT rowid FROM skills_fts WHERE skills_fts MATCH ? LIMIT 100`;
        
        try {
            const ftsResults = await query(ftsSearchSql, [ftsTerm]);

            if (ftsResults.length > 0) {
                // FTS 命中：提取 ID 列表
                const ids = ftsResults.map((r: any) => r.rowid);
                conditions.push(`s.id IN (${ids.join(',')})`);
            } else {
                // FTS 未命中：兜底走 LIKE (防止索引偶发性不同步导致搜不到)
                const likeTerm = `%${rawTerm}%`;
                conditions.push(`(s.name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ? OR s.slug LIKE ?)`);
                params.push(likeTerm, likeTerm, likeTerm, likeTerm);
            }
        } catch (e) {
            console.error("Search Error:", e);
            // 报错兜底：走 LIKE
            const likeTerm = `%${rawTerm}%`;
            conditions.push(`(s.name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ? OR s.slug LIKE ?)`);
            params.push(likeTerm, likeTerm, likeTerm, likeTerm);
        }
    }
  }
  // 🔥🔥🔥 核心修复结束 🔥🔥🔥

  if (conditions.length > 0) { sql += ' WHERE ' + conditions.join(' AND '); }

  sql += ' ORDER BY s.hotness_score DESC, s.created_at DESC';
  
  const limit = filters.limit || 12;
  const offset = filters.offset || 0;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await query(sql, params);
  const skills = results.map(normalizeSkill);

  const uniqueSkills = Array.from(new Map(skills.map(skill => [skill.id, skill])).values());
  return uniqueSkills;
};
