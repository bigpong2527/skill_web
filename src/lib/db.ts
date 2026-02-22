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
  // ✅ 优化方案 C：读取独立计数表 (Rows Read: 1)
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  return (results[0] as any)?.value || 0;
};

export const getSkillsMaxId = async (): Promise<number> => {
  // ✅ 优化方案 C：读取独立计数表 (Rows Read: 1)
  // 虽然函数名是 MaxId，但业务逻辑需要的是总数，且 ID 为雪花算法不可用，故此处也返回总数
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  return (results[0] as any)?.value || 0;
};

export const getHotSkills = async (limit: number = 8): Promise<Skill[]> => {
  const results = await query(`SELECT * FROM skills ORDER BY hotness_score DESC, created_at DESC LIMIT ?`, [limit]);
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

// --- 终极混合搜索策略 (航天级防注入 + BM25 智能排序) ---
export const filterSkills = async (filters: SkillFilters): Promise<Skill[]> => {
  let sql = "SELECT s.* FROM skills s";
  const params: any[] = [];
  const conditions: string[] = [];
  const joinedTables = new Set<string>();
  
  // 默认排序：完美命中你刚建好的 idx_skills_hotness_created 索引
  let orderByClause = " ORDER BY s.hotness_score DESC, s.created_at DESC";

  // 辅助函数：防止重复 JOIN 同一张表
  const ensureJoin = (joinSql: string, tableName: string) => {
    if (!joinedTables.has(tableName)) { 
        sql += joinSql; 
        joinedTables.add(tableName); 
    }
  };

  // 1. 处理分类筛选
  if (filters.categorySlug) {
    ensureJoin(` JOIN skill_categories sc ON s.id = sc.skill_id JOIN categories c ON sc.category_id = c.id`, 'categories');
    conditions.push('c.slug = ?');
    params.push(filters.categorySlug);
  }

  // 2. 处理关键词筛选
  if (filters.keywords && filters.keywords.length > 0) {
    ensureJoin(` JOIN skill_keywords sk_f ON s.id = sk_f.skill_id JOIN keywords k_f ON sk_f.keyword_id = k_f.id`, 'keywords_filter');
    const placeholders = filters.keywords.map(() => '?').join(',');
    conditions.push(`k_f.name IN (${placeholders})`);
    params.push(...filters.keywords);
  }

  // 3. 处理侧边栏筛选
  if (filters.authorType) { 
      conditions.push('s.author_type = ?'); 
      params.push(filters.authorType); 
  }
  if (filters.complexity) { 
      conditions.push('s.complexity = ?'); 
      params.push(filters.complexity); 
  }

  // 🔥🔥🔥 核心：全文搜索逻辑 🔥🔥🔥
  if (filters.searchQuery && typeof filters.searchQuery === 'string') {
    // 防御 1：截断超长恶意请求，防止正则回溯攻击耗尽 CPU
    const rawQuery = filters.searchQuery.slice(0, 100);
    
    // 防御 2：极端清洗。只保留字母、数字、空格和连字符。抹杀一切可能导致 FTS 崩溃的特殊符号
    const cleanTerm = rawQuery.replace(/[^a-zA-Z0-9\s\-]/g, ' ').trim().toLowerCase();
    
    if (cleanTerm.length > 0) {
        // 构造智能查询：按空格分词，每个词加上前缀通配符，并用 AND 连接
        // 例如输入 "data ana" -> 变成 '"data"* AND "ana"*'
        const words = cleanTerm.split(/\s+/).filter(w => w.length > 0);
        const ftsQuery = words.map(word => `"${word}"*`).join(' AND ');
        
        // 核心：使用 JOIN 结合 BM25 算法。
        // 权重分配：name(10分), tagline(5分), description(1分)
        // 这样名字叫 Python 的技能，绝对会排在描述里提到 python 的技能前面
        ensureJoin(` JOIN (
            SELECT rowid, bm25(skills_fts, 10.0, 5.0, 1.0) as rank 
            FROM skills_fts 
            WHERE skills_fts MATCH ?
            ORDER BY rank ASC 
            LIMIT 300
        ) fts ON s.id = fts.rowid`, 'fts_search');
        
        params.push(ftsQuery);
        
        // 覆盖默认排序：当有搜索词时，相关度(rank)优先
        orderByClause = " ORDER BY fts.rank ASC";
    } else {
        // 防御 3：如果用户输入的都是垃圾符号（清洗后为空），直接阻断查询，防止全表扫描
        conditions.push(`1 = 0`);
    }
  }

  // 组装 WHERE 子句
  if (conditions.length > 0) { 
      sql += ' WHERE ' + conditions.join(' AND '); 
  }

  // 追加排序和分页
  sql += orderByClause;
  
  const limit = filters.limit || 12;
  const offset = filters.offset || 0;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  // 执行查询并格式化结果
  const results = await query(sql, params);
  const skills = results.map(normalizeSkill);

  // 最终去重防线
  return Array.from(new Map(skills.map(skill => [skill.id, skill])).values());
};
