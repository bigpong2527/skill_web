-- Removed _cf_KV table creation as it may cause auth issues locally

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    source_url TEXT,
    r2_zip_key TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_type TEXT NOT NULL CHECK(author_type IN ('Official', 'Partner', 'Community')),
    version TEXT NOT NULL DEFAULT '1.0.0',
    complexity TEXT NOT NULL CHECK(complexity IN ('Basic', 'Intermediate', 'Advanced')),
    dependencies TEXT,
    components TEXT,
    downloads INTEGER NOT NULL DEFAULT 0,
    card_clicks INTEGER NOT NULL DEFAULT 0,
    weekly_downloads INTEGER NOT NULL DEFAULT 0,
    weekly_card_clicks INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 0.0,
    ratings_count INTEGER NOT NULL DEFAULT 0,
    hotness_score REAL NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_categories (
    skill_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (skill_id, category_id),
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skill_keywords (
    skill_id INTEGER NOT NULL,
    keyword_id INTEGER NOT NULL,
    PRIMARY KEY (skill_id, keyword_id),
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
);

-- Insert some initial data for testing
INSERT OR IGNORE INTO categories (slug, name, description, icon) VALUES 
('coding', 'Coding', 'Development tools', 'code'),
('data', 'Data', 'Data analysis', 'chart-bar'),
('productivity', 'Productivity', 'Workflow enhancements', 'lightning-bolt');

INSERT OR IGNORE INTO skills (slug, name, tagline, description, r2_zip_key, author_name, author_type, complexity, status) VALUES 
('hello-world', 'Hello World', 'A simple starting skill', 'This is a test skill description.', 'hello-world.zip', 'System', 'Official', 'Basic', 'approved');
