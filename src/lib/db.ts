import { getRequestContext } from '@cloudflare/next-on-pages';
import { cache } from 'react';
import { Skill, Category, Keyword, Author, RepositoryGroup, AuthorFAQ, RepositorySuite, AuthorType } from '../types';
import { STATIC_CATEGORIES } from './staticData';

export const runtime = 'edge';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = process.env.D1_DATABASE_ID;
const D1_API_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;

export async function query(sql: string, params: any[] = []): Promise<any[]> {
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
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params: params.map((p) =>
            typeof p === 'number' || typeof p === 'boolean'
              ? p
              : p === null || p === undefined
              ? null
              : String(p)
          ),
        }),
        cache: 'no-store',
      });
      const data = (await response.json()) as any;
      if (!response.ok) {
        console.error(`[D1 HTTP Error] ${response.status}: ${data.errors ? JSON.stringify(data.errors) : 'Unknown error'}`);
      }
      if (data.success && data.result && data.result[0]) return data.result[0].results || [];
    } catch (e) { console.error('[D1 Connection Failed]', e); }
  }
  return [];
}

const normalizeSkill = (row: any): Skill => ({
  ...row,
  downloads: Number(row.downloads) || 0,
  card_clicks: Number(row.card_clicks) || 0,
  weekly_downloads: Number(row.weekly_downloads) || 0,
  weekly_card_clicks: Number(row.weekly_card_clicks) || 0,
  rating: Number(row.rating) || 0,
  ratings_count: Number(row.ratings_count) || 0,
  hotness_score: Number(row.hotness_score) || 0,
  stars: row.stars != null ? Number(row.stars) : null,
  forks: row.forks != null ? Number(row.forks) : null,
  dependencies: row.dependencies ? String(row.dependencies).trim() : null,
  components: row.components ? String(row.components).trim() : null,
  faq_json: row.faq_json ? String(row.faq_json).trim() : null,
  related_ids: row.related_ids ? String(row.related_ids).trim() : null,
  repo_created_at: row.repo_created_at || null,
  author_website: row.author_website || null,
  author_twitter: row.author_twitter || null,
  author_avatar: row.author_avatar || null,
  author_display_name: row.author_display_name || null,
  keywords: row.keywords
    ? Array.isArray(row.keywords)
      ? row.keywords
      : String(row.keywords).split(',').map((s: string) => s.trim()).filter(Boolean)
    : [],
  category_slug: row.category_slug || undefined,
});

const safeParseJson = <T>(str?: unknown): T | null => {
  // 1. 拦截空值与伪空值
  if (!str || str === 'NULL' || str === 'null') return null;

  // 2. 🚨 核心护盾：如果 D1 直接吐出了 Object/Array，直接返回，防止调用 .trim() 崩溃
  if (typeof str === 'object') return str as T;

  // 3. 处理字符串
  if (typeof str === 'string') {
    let clean = str.trim();
    if (!clean || clean === '{}' || clean === '[]') return null;

    try {
      return JSON.parse(clean);
    } catch {
      try {
        // 修复 SQLite 导出的双重双引号转义: "{""key"": 40}" -> {"key": 40}
        if (clean.includes('""')) {
          clean = clean.replace(/""/g, '"');
        }
        // 修复最外层的多余引号包裹
        if (clean.startsWith('"') && clean.endsWith('"') && clean.includes('{')) {
          clean = clean.slice(1, -1);
        }
        return JSON.parse(clean);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const normalizeAuthor = (row: any): Author => ({
  id: Number(row.id),
  login: String(row.login),
  name: row.name || null,
  website: row.website || null,
  twitter: row.twitter || null,
  email: row.email || null,
  location: row.location || null,
  bio: row.bio || null,
  avatar_url: row.avatar_url || null,
  public_repos: Number(row.public_repos) || 0,
  followers: Number(row.followers) || 0,
  author_type: (row.author_type || 'Community') as Author['author_type'],
  is_404: Number(row.is_404) || 0,
  updated_at: String(row.updated_at || ''),
  headline: row.headline || null,
  primary_domain: row.primary_domain || null,
  capability_breakdown: safeParseJson<Record<string, number>>(row.capability_breakdown),
  faqs: safeParseJson<AuthorFAQ[]>(row.faqs) || [],
});

const normalizeRepoSuite = (row: any): RepositorySuite => ({
  id: Number(row.id),
  author_id: row.author_id != null ? Number(row.author_id) : null,
  owner: String(row.owner),
  name: String(row.name),
  repo_url: String(row.repo_url),
  primary_category_id: Number(row.primary_category_id) || 2,
  author_type: (row.author_type || 'Community') as AuthorType,
  stars: Number(row.stars) || 0,
  forks: Number(row.forks) || 0,
  skills_count: Number(row.skills_count) || 1,
  tagline: String(row.tagline || ''),
  description: String(row.description || ''),
  available_guides: row.available_guides ? String(row.available_guides).trim() : '[]',
  guide_summary: row.guide_summary ? String(row.guide_summary).trim() : null,
  skill_ids: String(row.skill_ids || ''),
  faqs: row.faqs ? String(row.faqs).trim() : '[]',
  created_at: String(row.created_at || ''),
  updated_at: String(row.updated_at || ''),
});

export const getSkillsCount = async (): Promise<number> => {
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  const rawCount = (results[0] as any)?.value || 0;
  // 将个十百位归零，保留千位及以上（如 665432 → 665000）
  return Math.floor(rawCount / 1000) * 1000;
};

export const getSkillsMaxId = cache(async (): Promise<number> => {
  const results = await query(`SELECT value FROM site_stats WHERE key = 'skills_count'`);
  const rawCount = (results[0] as any)?.value || 0;
  // 将个十百位归零，保留千位及以上（如 665432 → 665000）
  return Math.floor(rawCount / 1000) * 1000;
});

// 🌟 全站综合最佳仓库套件榜单（首页 + /best-skills 顶部共用）
export const getFeaturedRepoSuites = cache(async (limit: number = 8): Promise<RepositorySuite[]> => {
  // 1. 优先读取云端配置的手动预设仓库 ID
  const statsRes = await query(`SELECT value FROM site_stats WHERE key = 'featured_home_repo_ids' LIMIT 1`);
  const configuredIds = statsRes[0]?.value ? String(statsRes[0].value).trim() : '';

  if (configuredIds) {
    const idArray = configuredIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => /^\d+$/.test(id))
      .slice(0, limit);

    if (idArray.length > 0) {
      const placeholders = idArray.map(() => '?').join(',');
      const sql = `SELECT * FROM repositories WHERE id IN (${placeholders})`;
      const results = await query(sql, idArray);
      const repoMap = new Map(results.map((row: any) => [String(row.id), normalizeRepoSuite(row)]));
      const manualRepos = idArray.map((id) => repoMap.get(id)).filter((r): r is RepositorySuite => r !== undefined);
      if (manualRepos.length > 0) return manualRepos;
    }
  }

  // 2. 兜底回退：如果未配置，自动回退到全网最高 Star 仓库列表
  const sql = `SELECT * FROM repositories ORDER BY stars DESC LIMIT ?`;
  const results = await query(sql, [limit]);
  return results.map(normalizeRepoSuite);
});

export const getFeaturedSkills = async (limit: number = 8): Promise<Skill[]> => {
  // 🚨 已废弃：featured_home_skill_ids 不再使用，保留此函数仅供旧代码兼容
  // 新的综合榜单请使用 getFeaturedRepoSuites()
  const sql = `
    SELECT * FROM skills
    WHERE status = 'pending' AND stars > 0
    ORDER BY stars DESC
    LIMIT ?
  `;
  const results = await query(sql, [limit]);
  return results.map(normalizeSkill);
};

export const getRecentSkills = async (limit: number = 8): Promise<Skill[]> => {
  const sql = `SELECT * FROM skills WHERE status = 'pending' ORDER BY id DESC LIMIT ?`;
  const results = await query(sql, [limit]);
  return results.map(normalizeSkill);
};

export const getAllCategories = async (): Promise<Category[]> => {
  const results = await query(`SELECT slug, featured_skill_ids FROM categories`);
  const dbCatMap = new Map(results.map((r: any) => [r.slug, r.featured_skill_ids]));

  return STATIC_CATEGORIES.map((c) => ({
    ...c,
    description: null,
    featured_skill_ids: dbCatMap.get(c.slug) || null,
  }));
};

export const getSkillsByIds = cache(async (idsStr: string | null | undefined, limit = 8): Promise<Skill[]> => {
  if (!idsStr) return [];

  // 1. 正则安全提取纯数字 ID，完美兼容 14 位长 ID
  const idArray = idsStr
    .split(',')
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id))
    .slice(0, limit);

  if (idArray.length === 0) return [];

  // 2. 纯数字直接字面量拼接，避免 200 个占位符超限导致 D1 驱动抛错返回空
  const inList = idArray.join(',');
  const sql = `SELECT * FROM skills WHERE id IN (${inList}) AND status = 'pending'`;
  const results = await query(sql, []);

  // 3. 将 row.id 统一转为 String 键，严格保证首页卡片展示顺序与预设 ID 顺序完全一致
  const skillMap = new Map(results.map((row: any) => [String(row.id), normalizeSkill(row)]));
  return idArray.map((id) => skillMap.get(id)).filter((s): s is Skill => s !== undefined);
});

export const getSkillBySlug = cache(async (slug: string): Promise<Skill | null> => {
  const results = await query(
    `
      SELECT s.*, a.name AS author_display_name, a.website AS author_website, a.twitter AS author_twitter, a.avatar_url AS author_avatar
      FROM skills s
      LEFT JOIN authors a ON s.author_name = a.login COLLATE NOCASE
      WHERE s.slug = ? AND s.status = 'pending'
      LIMIT 1
    `,
    [slug]
  );
  return results.length > 0 ? normalizeSkill(results[0]) : null;
});

export const getSkillCategories = cache(async (skillId: number): Promise<Category[]> => {
  const results = await query(
    `SELECT c.* FROM categories c JOIN skill_categories sc ON c.id = sc.category_id WHERE sc.skill_id = ?`,
    [skillId]
  );
  return results.map((dbCat: any) => {
    const staticMatch = STATIC_CATEGORIES.find((sc) => sc.slug === dbCat.slug);
    return staticMatch ? { ...dbCat, icon: staticMatch.icon, name: staticMatch.name } : dbCat;
  });
});

export const getSkillKeywords = cache(async (skillId: number): Promise<Keyword[]> => {
  const results = await query(
    `SELECT k.* FROM keywords k JOIN skill_keywords sk ON k.id = sk.keyword_id WHERE sk.skill_id = ?`,
    [skillId]
  );
  return results.map((k: any) => ({ id: k.id, name: k.name }));
});

export const getRelatedSkills = cache(async (relatedIds: number[]): Promise<Skill[]> => {
  const ids = Array.from(new Set(relatedIds.filter((id) => Number.isInteger(id) && id > 0))).slice(0, 4);
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(', ');
  const results = await query(
    `SELECT * FROM skills WHERE id IN (${placeholders}) AND status = 'pending'`,
    ids
  );
  const byId = new Map(results.map((row: any) => [Number(row.id), normalizeSkill(row)]));
  return ids.map((id) => byId.get(id)).filter((skill): skill is Skill => Boolean(skill));
});

export const getAuthorByLogin = cache(async (login: string): Promise<Author | null> => {
  const results = await query(`SELECT * FROM authors WHERE login = ? LIMIT 1`, [login]);
  if (results.length === 0) return null;
  const author = normalizeAuthor(results[0]);
  return author.is_404 === 1 ? null : author;
});

export const getAuthorSkillsCount = cache(async (canonicalLogin: string): Promise<number> => {
  const results = await query(
    `SELECT COUNT(*) AS count FROM skills WHERE author_name COLLATE NOCASE = ? AND status = 'pending'`,
    [canonicalLogin]
  );
  return Number(results[0]?.count) || 0;
});

export const getAuthorSkills = cache(
  async (canonicalLogin: string, limit = 24, offset = 0): Promise<Skill[]> => {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);
    const results = await query(
      `
        SELECT s.*
        FROM skills s
        WHERE s.author_name COLLATE NOCASE = ? AND s.status = 'pending'
        ORDER BY s.hotness_score DESC, s.created_at DESC
        LIMIT ? OFFSET ?
      `,
      [canonicalLogin, safeLimit, safeOffset]
    );
    return results.map(normalizeSkill);
  }
);

export const getAuthorRepositories = cache(
  async (canonicalLogin: string): Promise<RepositoryGroup[]> => {
    const sql = `
      SELECT
        g.repo_url,
        g.skill_count,
        g.repo_stars,
        g.repo_forks,
        r.id AS internal_id,
        r.tagline AS repo_tagline
      FROM (
        SELECT
          CASE
            WHEN instr(source_url, '/tree/') > 0 THEN substr(source_url, 1, instr(source_url, '/tree/') - 1)
            WHEN instr(source_url, '/blob/') > 0 THEN substr(source_url, 1, instr(source_url, '/blob/') - 1)
            ELSE rtrim(source_url, '/')
          END AS repo_url,
          COUNT(*) AS skill_count,
          MAX(stars) AS repo_stars,
          MAX(forks) AS repo_forks
        FROM skills
        WHERE author_name COLLATE NOCASE = ?
          AND status = 'pending'
          AND source_url IS NOT NULL
          AND source_url != ''
        GROUP BY repo_url
      ) g
      LEFT JOIN repositories r ON r.repo_url = g.repo_url COLLATE NOCASE
      ORDER BY g.skill_count DESC, g.repo_stars DESC;
    `;
    const results = await query(sql, [canonicalLogin]);
    return results.map((row: any) => ({
      repo_name: String(row.repo_url).replace(/^https?:\/\/github\.com\//i, ''),
      repo_url: String(row.repo_url),
      skill_count: Number(row.skill_count) || 0,
      stars: Number(row.repo_stars) || 0,
      forks: Number(row.repo_forks) || 0,
      tagline: row.repo_tagline || null,
      has_internal_page: row.internal_id != null,
    }));
  }
);

export const getAllSkillsWithTimestamps = async (limit: number, offset: number = 0): Promise<Array<{ slug: string, updated_at: string }>> => {
  const sql = `SELECT slug, updated_at FROM skills ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => ({ slug: r.slug, updated_at: r.updated_at }));
};

export const getSitemapSkillsWithDates = async (
  limit: number,
  offset: number = 0
): Promise<Array<{ slug: string; updated_at: string }>> => {
  const sql = `SELECT slug, updated_at FROM skills WHERE status = 'pending' ORDER BY id ASC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => ({ slug: r.slug, updated_at: r.updated_at }));
};

export const getAuthorsCount = cache(async (): Promise<number> => {
  const results = await query(`SELECT COUNT(*) as count FROM authors WHERE is_404 = 0`);
  return Number(results[0]?.count) || 0;
});

export const getSitemapAuthorsWithDates = async (
  limit: number,
  offset: number = 0
): Promise<Array<{ login: string; updated_at: string }>> => {
  // 完美命中 idx_authors_sitemap，不会引发 D1 报错
  const sql = `SELECT login, updated_at FROM authors WHERE is_404 = 0 ORDER BY id ASC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => ({ login: r.login, updated_at: r.updated_at }));
};

export interface SkillFilters {
  categorySlug?: string;
  keywords?: string[];
  authorType?: string;
  authorName?: string;
  complexity?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

// ============================================================
// 🔍 探索与筛选核心函数 (带防爬虫深度限制与 FTS Top-100 截断)
// ============================================================
export const filterSkills = async (filters: SkillFilters): Promise<Skill[]> => {
  const cleanSearchQuery = filters.searchQuery?.trim();

  // 🚨 1. 终极防御：无任何有效筛选条件时，直接短路返回，彻底杜绝无头全表扫描
  const hasAnyFilter = Boolean(
    filters.categorySlug ||
    cleanSearchQuery ||
    (filters.keywords && filters.keywords.length > 0) ||
    filters.authorType ||
    filters.authorName ||
    filters.complexity
  );

  if (!hasAnyFilter) {
    return [];
  }

  // ⚡ 2. 极速直出通道：纯分类浏览时直接走 categories 表的精选 ID 主键点查
  if (
    filters.categorySlug &&
    !cleanSearchQuery &&
    (!filters.keywords || filters.keywords.length === 0) &&
    !filters.authorType &&
    !filters.authorName &&
    !filters.complexity
  ) {
    const offset = Number.isFinite(filters.offset) ? Math.max(Number(filters.offset), 0) : 0;
    const limit = Number.isFinite(filters.limit) ? Math.max(Number(filters.limit), 1) : 12;

    if (offset >= 200) {
      return [];
    }

    const catRes = await query(`SELECT featured_skill_ids FROM categories WHERE slug = ? LIMIT 1`, [filters.categorySlug]);
    const featuredIds = catRes[0]?.featured_skill_ids;

    if (featuredIds) {
      const skills = await getSkillsByIds(featuredIds, 200);
      return skills.slice(offset, offset + limit);
    }
  }

  // 🛡️ 3. 动态交叉筛选：采用"延迟关联 (Deferred Join)"架构，防扫表
  let sql = 'SELECT s.id FROM skills s';

  // 🔒 将 JOIN 参数与 WHERE 参数严格物理分离，杜绝参数位置错位
  const joinParams: any[] = [];
  const whereParams: any[] = [];
  const conditions: string[] = ["s.status = 'pending'"];
  const joinedTables = new Set<string>();
  let orderByClause = ' ORDER BY s.id DESC';

  const ensureJoin = (joinSql: string, tableName: string) => {
    if (!joinedTables.has(tableName)) {
      sql += joinSql;
      joinedTables.add(tableName);
    }
  };

  // 搜索子查询（位于 JOIN 区域）
  if (cleanSearchQuery) {
    const rawQuery = cleanSearchQuery.slice(0, 50);
    const cleanTerm = rawQuery.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().toLowerCase();

    if (cleanTerm.length >= 2) {
      const words = cleanTerm.split(/\s+/).filter((w) => w.length > 0);
      const ftsQuery = words.map((word) => `${word}*`).join(' AND ');
      ensureJoin(
        ` JOIN (
          SELECT rowid, bm25(skills_fts, 0.0, 0.0, 10.0, 5.0, 1.0) as rank
          FROM skills_fts
          WHERE skills_fts MATCH ?
          ORDER BY rank ASC
          LIMIT 100
        ) fts ON s.id = fts.rowid`,
        'fts_search'
      );
      joinParams.push(ftsQuery);
      orderByClause = ' ORDER BY fts.rank ASC';
    } else {
      conditions.push(`1 = 0`);
    }
  }

  // 分类关联
  if (filters.categorySlug) {
    const cat = STATIC_CATEGORIES.find(c => c.slug === filters.categorySlug);
    const catId = cat?.id;

    if (catId) {
      ensureJoin(` JOIN skill_categories sc ON s.id = sc.skill_id`, 'skill_categories');
      conditions.push('sc.category_id = ?');
      whereParams.push(catId);
    } else {
      ensureJoin(` JOIN skill_categories sc ON s.id = sc.skill_id JOIN categories c ON sc.category_id = c.id`, 'categories');
      conditions.push('c.slug = ?');
      whereParams.push(filters.categorySlug);
    }
  }

  // 关键词过滤（使用 EXISTS 保证结果行数唯一性，防止破坏 LIMIT 分页）
  if (filters.keywords && filters.keywords.length > 0) {
    const cleanKeywords = filters.keywords.map(k => k.trim()).filter(Boolean);
    if (cleanKeywords.length > 0) {
      const placeholders = cleanKeywords.map(() => '?').join(',');
      conditions.push(`EXISTS (
        SELECT 1 FROM skill_keywords sk_f
        JOIN keywords k_f ON sk_f.keyword_id = k_f.id
        WHERE sk_f.skill_id = s.id AND k_f.name IN (${placeholders})
      )`);
      whereParams.push(...cleanKeywords);
    }
  }

  if (filters.authorType) {
    conditions.push('s.author_type = ?');
    whereParams.push(filters.authorType);
  }

  if (filters.authorName) {
    conditions.push('s.author_name COLLATE NOCASE = ?');
    whereParams.push(filters.authorName);
  }

  if (filters.complexity) {
    conditions.push('s.complexity = ?');
    whereParams.push(filters.complexity);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += orderByClause;

  const rawLimit = Number.isFinite(filters.limit) ? Math.max(Number(filters.limit), 1) : 12;
  const offset = Number.isFinite(filters.offset) ? Math.max(Number(filters.offset), 0) : 0;

  const MAX_WINDOW = filters.authorName ? 2000 : 200;

  if (offset >= MAX_WINDOW) {
    return [];
  }

  const limit = Math.min(rawLimit, MAX_WINDOW - offset);
  if (limit <= 0) {
    return [];
  }

  sql += ` LIMIT ? OFFSET ?`;

  const finalParams = [...joinParams, ...whereParams, limit, offset];

  // 第一阶段：拉取轻量有序主键列表
  const idResults = await query(sql, finalParams);
  if (idResults.length === 0) return [];

  const validIds = idResults
    .map((r: any) => Number(r.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (validIds.length === 0) return [];

  // 第二阶段：主键批量带回全字段宽表数据
  const inPlaceholders = validIds.join(',');
  const fullSkillsResults = await query(`SELECT * FROM skills WHERE id IN (${inPlaceholders})`);

  // 精准恢复原排序序列
  const skillMap = new Map(fullSkillsResults.map((row: any) => [Number(row.id), normalizeSkill(row)]));
  return validIds
    .map((id) => skillMap.get(id))
    .filter((s): s is Skill => s !== undefined);
};

export const getSitemapSlugs = async (limit: number, offset: number): Promise<string[]> => {
  const sql = `SELECT slug FROM skills ORDER BY id ASC LIMIT ? OFFSET ?`;
  const results = await query(sql, [limit, offset]);
  return results.map((r: any) => r.slug);
};

// 🌟 仓库套件相关数据库读取函数 (走主键与联合唯一索引，0 全表扫描)
export const getRepoSuiteByOwnerName = cache(
  async (owner: string, name: string): Promise<RepositorySuite | null> => {
    const results = await query(
      `SELECT * FROM repositories WHERE owner = ? COLLATE NOCASE AND name = ? COLLATE NOCASE LIMIT 1`,
      [owner, name]
    );
    return results.length > 0 ? normalizeRepoSuite(results[0]) : null;
  }
);

export const getRelatedRepoSuites = cache(
  async (categoryId: number, currentRepoId: number, limit = 3): Promise<RepositorySuite[]> => {
    const results = await query(
      `SELECT * FROM repositories WHERE primary_category_id = ? AND id != ? ORDER BY stars DESC LIMIT ?`,
      [categoryId, currentRepoId, limit]
    );
    return results.map(normalizeRepoSuite);
  }
);

export const getAllRepoSuitesForSitemap = async (): Promise<Array<{ owner: string; name: string; updated_at: string }>> => {
  const results = await query(`SELECT owner, name, updated_at FROM repositories ORDER BY stars DESC`);
  return results.map((r: any) => ({ owner: r.owner, name: r.name, updated_at: r.updated_at }));
};

// 🌟 10 大分类精选仓库套件读取 (优先读取 site_stats 手动预设，支持平滑回退到 Star 倒序)
export const getTopRepoSuitesByCategory = cache(
  async (categoryId: number, limit = 8): Promise<RepositorySuite[]> => {
    // 1. 尝试从 site_stats 读取该分类手动预设的仓库 ID 列表
    const statKey = `featured_repo_ids_cat_${categoryId}`;
    const statsRes = await query(`SELECT value FROM site_stats WHERE key = ? LIMIT 1`, [statKey]);
    const configuredIds = statsRes[0]?.value ? String(statsRes[0].value).trim() : '';

    if (configuredIds) {
      const idArray = configuredIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => /^\d+$/.test(id))
        .slice(0, limit);

      if (idArray.length > 0) {
        const placeholders = idArray.map(() => '?').join(',');
        const sql = `SELECT * FROM repositories WHERE id IN (${placeholders}) AND primary_category_id = ?`;
        const results = await query(sql, [...idArray, categoryId]);
        const repoMap = new Map(results.map((row: any) => [String(row.id), normalizeRepoSuite(row)]));
        const manualRepos = idArray.map((id) => repoMap.get(id)).filter((r): r is RepositorySuite => r !== undefined);
        if (manualRepos.length > 0) return manualRepos;
      }
    }

    // 2. 兜底回退：如果未在后台配置该分类，按该分类 Star 倒序排列
    const sql = `SELECT * FROM repositories WHERE primary_category_id = ? ORDER BY stars DESC LIMIT ?`;
    const results = await query(sql, [categoryId, limit]);
    return results.map(normalizeRepoSuite);
  }
);