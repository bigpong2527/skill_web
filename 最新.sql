INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('TABLE', '_cf_KV', '_cf_KV', 'CREATE TABLE _cf_KV (
        key TEXT PRIMARY KEY,
        value BLOB
      ) WITHOUT ROWID'), ('TABLE', 'authors', 'authors', 'CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT,
    website TEXT,
    twitter TEXT,
    email TEXT,
    location TEXT,
    bio TEXT,
    avatar_url TEXT,
    public_repos INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    author_type TEXT DEFAULT ''Community'',
    is_404 INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
, headline TEXT, primary_domain TEXT, capability_breakdown TEXT, faqs TEXT, skills_count INTEGER DEFAULT 0)'), ('INDEX', 'authors', 'idx_authors_login', 'CREATE INDEX idx_authors_login ON authors(login)'), ('INDEX', 'authors', 'idx_authors_official_repos', 'CREATE INDEX idx_authors_official_repos ON authors(author_type, is_404, public_repos DESC)'), ('INDEX', 'authors', 'idx_authors_official_skills', 'CREATE INDEX idx_authors_official_skills 
ON authors(author_type, is_404, skills_count DESC, public_repos DESC)'), ('INDEX', 'authors', 'idx_authors_sitemap', 'CREATE INDEX idx_authors_sitemap ON authors(is_404, login)'), ('INDEX', 'authors', 'sqlite_autoindex_authors_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'categories', 'categories', 'CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT
, featured_skill_ids TEXT)'), ('INDEX', 'categories', 'sqlite_autoindex_categories_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('INDEX', 'categories', 'sqlite_autoindex_categories_2', '-- [系统自动生成的隐式主键/唯一约束索引]');
INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('TABLE', 'keywords', 'keywords', 'CREATE TABLE keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)'), ('INDEX', 'keywords', 'sqlite_autoindex_keywords_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'repositories', 'repositories', 'CREATE TABLE repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER,
    owner TEXT NOT NULL COLLATE NOCASE,
    name TEXT NOT NULL COLLATE NOCASE,
    repo_url TEXT NOT NULL UNIQUE,
    primary_category_id INTEGER NOT NULL,
    author_type TEXT NOT NULL DEFAULT ''Community'',
    stars INTEGER NOT NULL DEFAULT 0,
    forks INTEGER NOT NULL DEFAULT 0,
    skills_count INTEGER NOT NULL DEFAULT 1,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    available_guides TEXT NOT NULL DEFAULT ''[]'',
    guide_summary TEXT,
    skill_ids TEXT NOT NULL,
    faqs TEXT NOT NULL DEFAULT ''[]'',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_repo_owner_name UNIQUE (owner, name),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
    FOREIGN KEY (primary_category_id) REFERENCES categories(id) ON DELETE RESTRICT
)'), ('INDEX', 'repositories', 'idx_repositories_category', 'CREATE INDEX idx_repositories_category ON repositories(primary_category_id, stars DESC)'), ('INDEX', 'repositories', 'idx_repositories_lookup', 'CREATE INDEX idx_repositories_lookup ON repositories(owner, name)'), ('INDEX', 'repositories', 'idx_repositories_stars', 'CREATE INDEX idx_repositories_stars ON repositories(stars DESC)'), ('INDEX', 'repositories', 'idx_repositories_url_nocase', 'CREATE INDEX idx_repositories_url_nocase 
ON repositories(repo_url COLLATE NOCASE)'), ('INDEX', 'repositories', 'sqlite_autoindex_repositories_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('INDEX', 'repositories', 'sqlite_autoindex_repositories_2', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'search_logs', 'search_logs', 'CREATE TABLE search_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    filters TEXT,
    matched_count INTEGER,
    result_ids TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    installed_at DATETIME, 
    install_ua TEXT, 
    request_id TEXT, 
    installed_skill_id INTEGER, 
    install_ip TEXT
)');
INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('TABLE', 'site_stats', 'site_stats', 'CREATE TABLE site_stats (key TEXT PRIMARY KEY, value INTEGER)'), ('INDEX', 'site_stats', 'sqlite_autoindex_site_stats_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'skill_categories', 'skill_categories', 'CREATE TABLE skill_categories (
    skill_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (skill_id, category_id),
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
)'), ('INDEX', 'skill_categories', 'idx_skill_categories_cat_id', 'CREATE INDEX idx_skill_categories_cat_id ON skill_categories(category_id)'), ('INDEX', 'skill_categories', 'sqlite_autoindex_skill_categories_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'skill_keywords', 'skill_keywords', 'CREATE TABLE skill_keywords (
    skill_id INTEGER NOT NULL,
    keyword_id INTEGER NOT NULL,
    PRIMARY KEY (skill_id, keyword_id),
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
)'), ('INDEX', 'skill_keywords', 'idx_skill_keywords_kw_id', 'CREATE INDEX idx_skill_keywords_kw_id ON skill_keywords(keyword_id)'), ('INDEX', 'skill_keywords', 'sqlite_autoindex_skill_keywords_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TABLE', 'skill_submissions', 'skill_submissions', 'CREATE TABLE skill_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_url TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    status TEXT DEFAULT ''pending'', -- pending / approved / rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)'), ('TABLE', 'skills', 'skills', 'CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    source_url TEXT,
    r2_zip_key TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_type TEXT NOT NULL CHECK(author_type IN (''Official'', ''Partner'', ''Community'')),
    version TEXT NOT NULL DEFAULT ''1.0.0'',
    complexity TEXT NOT NULL CHECK(complexity IN (''Basic'', ''Intermediate'', ''Advanced'')),
    dependencies TEXT,
    components TEXT,
    downloads INTEGER NOT NULL DEFAULT 0,
    card_clicks INTEGER NOT NULL DEFAULT 0,
    weekly_downloads INTEGER NOT NULL DEFAULT 0,
    weekly_card_clicks INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 0.0,
    ratings_count INTEGER NOT NULL DEFAULT 0,
    hotness_score REAL NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT ''pending'' CHECK(status IN (''pending'', ''approved'', ''rejected'')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, request TEXT, faq_json TEXT DEFAULT ''[]'', related_ids TEXT DEFAULT '''', stars INTEGER DEFAULT 0, forks INTEGER DEFAULT 0, repo_created_at TIMESTAMP,
    CONSTRAINT uq_slug_author UNIQUE (slug, author_name)
)');
INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('INDEX', 'skills', 'idx_skills_author_name', 'CREATE INDEX idx_skills_author_name 
ON skills(author_name COLLATE NOCASE, status, hotness_score DESC, created_at DESC)'), ('INDEX', 'skills', 'idx_skills_complexity', 'CREATE INDEX idx_skills_complexity ON skills(complexity)'), ('INDEX', 'skills', 'idx_skills_filters_sort', 'CREATE INDEX idx_skills_filters_sort 
ON skills(status, author_type, complexity, hotness_score DESC, created_at DESC)'), ('INDEX', 'skills', 'idx_skills_id_slug', 'CREATE INDEX idx_skills_id_slug 
ON skills(id ASC, slug)'), ('INDEX', 'skills', 'idx_skills_slug_author', 'CREATE INDEX idx_skills_slug_author ON skills(slug, author_name)'), ('INDEX', 'skills', 'idx_skills_slug_single', 'CREATE INDEX idx_skills_slug_single 
ON skills(slug)'), ('INDEX', 'skills', 'idx_skills_stars', 'CREATE INDEX idx_skills_stars ON skills(status, stars DESC)'), ('INDEX', 'skills', 'idx_skills_status_author_sort', 'CREATE INDEX idx_skills_status_author_sort 
ON skills(status, author_type, hotness_score DESC, created_at DESC)'), ('INDEX', 'skills', 'idx_skills_status_complexity_sort', 'CREATE INDEX idx_skills_status_complexity_sort 
ON skills(status, complexity, hotness_score DESC, created_at DESC)'), ('INDEX', 'skills', 'idx_skills_status_hotness_created', 'CREATE INDEX idx_skills_status_hotness_created 
ON skills(status, hotness_score DESC, created_at DESC)');
INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('INDEX', 'skills', 'idx_skills_status_hotness_id', 'CREATE INDEX idx_skills_status_hotness_id 
ON skills(status, hotness_score DESC, id ASC)'), ('INDEX', 'skills', 'idx_skills_status_id_asc', 'CREATE INDEX idx_skills_status_id_asc 
ON skills(status, id ASC)'), ('INDEX', 'skills', 'idx_skills_status_id_desc', 'CREATE INDEX idx_skills_status_id_desc 
ON skills(status, id DESC)'), ('INDEX', 'skills', 'sqlite_autoindex_skills_1', '-- [系统自动生成的隐式主键/唯一约束索引]'), ('TRIGGER', 'skills', 'skills_ad', 'CREATE TRIGGER skills_ad AFTER DELETE ON skills BEGIN
  INSERT INTO skills_fts(skills_fts, rowid, slug, author_name, name, tagline, description)
  VALUES(''delete'', old.id, old.slug, old.author_name, old.name, old.tagline, old.description);
END'), ('TRIGGER', 'skills', 'skills_ai', 'CREATE TRIGGER skills_ai AFTER INSERT ON skills BEGIN
  INSERT INTO skills_fts(rowid, slug, author_name, name, tagline, description)
  VALUES (new.id, new.slug, new.author_name, new.name, new.tagline, new.description);
END'), ('TRIGGER', 'skills', 'skills_au', 'CREATE TRIGGER skills_au AFTER UPDATE OF slug, author_name, name, tagline, description ON skills BEGIN
  INSERT INTO skills_fts(skills_fts, rowid, slug, author_name, name, tagline, description)
  VALUES(''delete'', old.id, old.slug, old.author_name, old.name, old.tagline, old.description);
  
  INSERT INTO skills_fts(rowid, slug, author_name, name, tagline, description)
  VALUES (new.id, new.slug, new.author_name, new.name, new.tagline, new.description);
END'), ('TRIGGER', 'skills', 'trg_decrement_skills_count', 'CREATE TRIGGER trg_decrement_skills_count AFTER DELETE ON skills BEGIN UPDATE site_stats SET value = value - 1 WHERE key = ''skills_count''; END'), ('TRIGGER', 'skills', 'trg_increment_skills_count', 'CREATE TRIGGER trg_increment_skills_count AFTER INSERT ON skills BEGIN UPDATE site_stats SET value = value + 1 WHERE key = ''skills_count''; END'), ('TABLE', 'skills_fts', 'skills_fts', 'CREATE VIRTUAL TABLE skills_fts USING fts5(
    slug UNINDEXED,
    author_name UNINDEXED,
    name,
    tagline,
    description,
    content=''skills'',
    content_rowid=''id'',
    tokenize=''porter''
)');
INSERT INTO "sqlite_master"("object_type", "target_table", "object_name", "ddl_definition") VALUES('TABLE', 'skills_fts_config', 'skills_fts_config', 'CREATE TABLE ''skills_fts_config''(k PRIMARY KEY, v) WITHOUT ROWID'), ('TABLE', 'skills_fts_data', 'skills_fts_data', 'CREATE TABLE ''skills_fts_data''(id INTEGER PRIMARY KEY, block BLOB)'), ('TABLE', 'skills_fts_docsize', 'skills_fts_docsize', 'CREATE TABLE ''skills_fts_docsize''(id INTEGER PRIMARY KEY, sz BLOB)'), ('TABLE', 'skills_fts_idx', 'skills_fts_idx', 'CREATE TABLE ''skills_fts_idx''(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID');
