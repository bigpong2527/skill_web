import { getRequestContext } from '@cloudflare/next-on-pages';
import { cache } from 'react';
import { Skill, Category, Keyword } from '../types';
import { STATIC_CATEGORIES } from './staticData';

// 这是一个工具库文件，声明 runtime 是安全的，有助于构建工具识别
export const runtime = 'edge';

// --- 环境变量凭证 (用于 HTTP 降级模式) ---
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = process.env.D1_DATABASE_ID;

const D1_API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;

// --- 核心查询函数 ---

async function query(sql: string, params: any[] = []): Promise<any[]> {
  // 策略 1: 优先尝试 Cloudflare Pages 原生 Binding (速度最快，生产环境主要方式)
  try {
    const ctx = getRequestContext();
    // 检查 env.DB 是否存在
    if (ctx && ctx.env && (ctx.env as any).DB) {
      const db = (ctx.env as any).DB as D1Database;
      const stmt = db.prepare(sql).bind(...params);
      const { results } = await stmt.all();
      return results || [];
    }
  } catch (e) {
    // 如果获取 Context 失败（例如在某些构建阶段或非 Request 上下文），忽略错误，继续尝试 HTTP
    // console.warn("D1 Binding access failed, falling back to HTTP...");
  }

  // 策略 2: HTTP API 降级 (用于本地开发、构建时生成静态页面、或 Binding 获取失败时)
  // 只有当环境变量存在时才尝试，避免无效请求
  if (CLOUDFLARE_API_TOKEN && D1_DATABASE_ID && CLOUDFLARE_ACCOUNT_ID) {
    try {
      const response = await fetch(D1_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params: params.map(p => String(p))
        }),
        // 关键：禁用 fetch 缓存，确保数据库查询是实时的
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[D1 HTTP Error] Status: ${response.status}, Body: ${errorText}`);
        return [];
      }

      const data = await response.json() as any;

      // Cloudflare D1 API 返回结构处理
      if (data.success && data.result && data.result[0]) {
        return data.result[0].results || [];
      }

      if (!data.success) {
        console.error("[D1 API Logic Error]", data.errors);
      }
    } catch (e) {
      console.error('[D1 Connection Failed]', e);
    }
  }

  // 如果两种方式都失败，返回空数组
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

// 使用 React cache 避免单次请求中重复查询
export const getSkillBySlug = cache(async (slug: string): Promise<Skill | null> => {
  const results = await query(`SELECT * FROM skills WHERE slug = ?`, [slug]);
  if (results.length > 0) {
    return normalizeSkill(results[0]);
  }
  return null;
});

export const getSkillCategories = cache(async (skillId: number): Promise<Category[]> => {
  const results = await query(`SELECT c.* FROM categories c JOIN skill_categories sc ON c.id = sc.category_id WHERE sc.skill_id = ?`, [skillId]);

  return results.map((dbCat: any) => {
    const staticMatch = STATIC_CATEGORIES.find(sc => sc.slug === dbCat.slug);
    if (staticMatch) {
      return {
        ...dbCat,
        icon: staticMatch.icon,
        name: staticMatch.name
      };
    }
    return dbCat;
  });
});

export const getSkillKeywords = cache(async (skillId: number): Promise<Keyword[]> => {
  const results = await query(`SELECT k.* FROM keywords k JOIN skill_keywords sk ON k.id = sk.keyword_id WHERE sk.skill_id = ?`, [skillId]);
  return results.map((k: any) => ({ id: k.id, name: k.name }));
});

export const getAllSkillsWithTimestamps = async (limit?: number): Promise<Array<{ slug: string, updated_at: string }>> => {
  const sql = limit
    ? `SELECT slug, updated_at FROM skills ORDER BY created_at DESC LIMIT ?`
    : `SELECT slug, updated_at FROM skills ORDER BY created_at DESC`;
  const params = limit ? [limit] : [];
  const results = await query(sql, params);
  return results.map((r: any) => ({
    slug: r.slug,
    updated_at: r.updated_at
  }));
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

export const filterSkills = async (filters: SkillFilters): Promise<Skill[]> => {
  let sql = "SELECT DISTINCT s.* FROM skills s";
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

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const searchTerm = `%${filters.searchQuery.trim()}%`;
    const searchCondition = `(
        s.name LIKE ? OR 
        s.tagline LIKE ? OR 
        s.description LIKE ? OR 
        EXISTS (SELECT 1 FROM skill_keywords sk JOIN keywords k ON sk.keyword_id = k.id WHERE sk.skill_id = s.id AND k.name LIKE ?)
      )`;
    conditions.push(searchCondition);
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) { sql += ' WHERE ' + conditions.join(' AND '); }

  sql += ' ORDER BY s.hotness_score DESC, s.created_at DESC';

  const limit = filters.limit || 12;
  const offset = filters.offset || 0;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await query(sql, params);
  const skills = results.map(normalizeSkill);

  // 简单的去重，防止 SQL JOIN 导致的重复
  const uniqueSkills = Array.from(
    new Map(skills.map(skill => [skill.id, skill])).values()
  );

  return uniqueSkills;
};