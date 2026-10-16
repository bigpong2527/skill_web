# AGENTS.md

本文档是面向所有 AI 编程智能体（Claude Code, Codex, Cursor, Trae, OpenClaw 等）的完整系统架构设计、数据交互规范与工程实现全景指南。在修改或扩展仓库代码前，必须完整阅读并严格遵守本文档所规定的原则与边界条件。

---

## 1. 核心工程铁律 (Fundamental Constraints)

1. **禁止自动 Git 提交与推送（Zero-Commit / Zero-Push Enforcement）**：
   > **最高警戒级别**：除非当前任务由人类用户下达明确指令（如直接输入“提交到 git”或“push to GitHub”），严禁执行任何 `git commit`、`git push`、`git tag` 操作。
2. **边缘计算环境约束（Edge Runtime Compliance）**：
   本工程部署于 Cloudflare Pages / Workers 平台。除特定声明外，全站路由均声明 `export const runtime = 'edge'`。绝对禁止引入 Node.js 专有底层 API（如 `node:fs`、`node:child_process`、`node:path`、`node:net` 等），所有逻辑必须保证在标准 Web API 及 Cloudflare Worker 环境中完全兼容。
3. **数据状态的反直觉语义（Counter-Intuitive Data Status）**：
   在数据库 `skills` 表中，**`status = 'pending'` 代表已审核通过、处于公开上线、对外正常展示状态的技能**。所有对前台用户或公开 API 开放的查询，**必须硬编码 `status = 'pending'`**。`'approved'` 与 `'rejected'` 属于历史留存或内部状态，不可随意覆盖此逻辑。
4. **延迟关联防御查询（Deferred Join Architecture）**：
   全站数据库规模达到 645k+ 技能与 35k+ 开发者，禁止对 `skills` 宽表执行带多表连接（JOIN）的全字段宽扫描。所有复杂筛选、跨表查询、全文搜索必须严格拆分为两阶段：
   - **第一阶段（ID 索引点查）**：仅查轻量级索引主键 `SELECT s.id FROM skills s ... LIMIT ? OFFSET ?`。
   - **第二阶段（批量回表提取）**：根据第一阶段所得主键序列（最多 12–24 条），通过 `SELECT * FROM skills WHERE id IN (...)` 直接回表提取全部宽字段，并在内存中还原原排序。
5. **SEO 页面大纲唯一 H1 原则**：
   全站每个 HTML 页面在语义结构上**只能且必须有且仅有一个 `<h1>` 标签**。所有副标题、动态 Markdown 内容、组件插槽等必须自降一级（例如 Markdown 中的 `#` 必须降级映射为 `<h2>`），杜绝破坏搜索引擎抓取评分。

---

## 2. 架构概览与数据流图 (Architecture & Data Flow)

### 2.1 全站拓扑架构

```
[Client / Browser / AI Agents]
          │
          ▼
 Cloudflare Edge CDN (Edge Runtime: Next.js 15 App Router)
   ├── s-maxage / stale-while-revalidate 缓存层
   ├── 请求头防御层 (x-skills-client 暗号认证)
   └── 蜜罐 / 爬虫速率 / 边界截断器 (Offset Guardrails)
          │
          ├──> Cloudflare D1 (SQLite分布式数据库)
          │      ├── skills (645k+ 行主表, status='pending')
          │      ├── skills_fts (FTS5 BM25 全文检索虚拟表)
          │      ├── authors / repositories (认证开发者/套件表)
          │      └── site_stats (KV 静态汇总与预设 ID 映射表)
          │
          └──> Cloudflare R2 (对象存储)
                 └── [pub-cd65669746d54319c4e830260a1c3864.r2.dev] (ZIP 包分发)
```

### 2.2 核心查询数据流转（延迟关联与 FTS5 截断）

```
用户请求 (q="pdf extractor", category="data-analytics", offset=12, limit=12)
   │
   ▼
1. db.ts :: filterSkills()
   │
   ├──> 构建搜索子查询: MATCH 'pdf* AND extractor*'
   │    └── FTS5 BM25 权重排序并在内存前置阶段严格强制 [LIMIT 100]
   │
   ├──> 构建分类关联: JOIN skill_categories sc ON s.id = sc.skill_id WHERE sc.category_id = ?
   │
   ├──> 边界截断: 检查 offset + limit <= 200 (防击穿防扫描)
   │
   ▼
2. 执行轻量延迟查询 (第一阶段)
   SELECT s.id FROM skills s 
     JOIN (SELECT rowid, bm25(...) as rank FROM skills_fts ... LIMIT 100) fts ON s.id = fts.rowid
     JOIN skill_categories sc ON s.id = sc.skill_id
     WHERE s.status = 'pending' AND sc.category_id = ?
     ORDER BY fts.rank ASC LIMIT 12 OFFSET 12;
   │
   └──> 得到主键数组: [1024, 8848, 9961, ...]
   │
   ▼
3. 执行主键批量回表 (第二阶段)
   SELECT * FROM skills WHERE id IN (1024, 8848, 9961, ...);
   │
   └──> 内存映射字典: Map<id, Skill>，按原顺序返回给前端渲染
```

---

## 3. 数据库核心模式定义与触发器 (Schema & DDL)

数据库底层为 Cloudflare D1（基于 SQLite 引擎），主要表与虚拟表 DDL 规则如下：

### 3.1 核心数据表

1. **`skills`**：
   - 包含技能的核心元数据：`id`, `slug`, `name`, `tagline`, `description`, `source_url`, `r2_zip_key`, `author_name`, `author_type` (`Official` | `Partner` | `Community`), `version`, `complexity` (`Basic` | `Intermediate` | `Advanced`), `downloads`, `card_clicks`, `rating`, `hotness_score`, `status` (`pending` 为发布态), `created_at`, `updated_at`, `dependencies`, `components`, `faq_json`, `related_ids`, `stars`, `forks`, `repo_created_at`。
   - 联合唯一约束：`UNIQUE (slug, author_name)`。
2. **`authors`**：
   - 开发者与科技企业画像表：`id`, `login` (COLLATE NOCASE, 唯一), `name`, `website`, `twitter`, `email`, `location`, `bio`, `avatar_url`, `public_repos`, `followers`, `author_type`, `is_404`, `updated_at`, `headline`, `primary_domain`, `capability_breakdown` (JSON 格式能力环状分布), `faqs` (JSON 格式问答), `skills_count` (物理索引计数列)。
3. **`repositories`**：
   - 精选代码仓库套件表：`id`, `author_id`, `owner` (NOCASE), `name` (NOCASE), `repo_url` (唯一), `primary_category_id`, `author_type`, `stars`, `forks`, `skills_count`, `tagline`, `description`, `available_guides` (JSON 数组), `guide_summary`, `skill_ids` (逗号分隔的技能 ID 序列), `faqs` (JSON 数组), `created_at`, `updated_at`。
   - 联合唯一约束：`UNIQUE (owner, name)`。
4. **`categories` 与 `skill_categories`**：
   - 分类元数据表：`categories` 包含 `id`, `slug`, `name`, `description`, `icon`, `featured_skill_ids` (固化的精选 ID 列表，用于避免全表扫描)。
   - 关联表 `skill_categories`：`(skill_id, category_id)` 复合主键，建立多对多级联外键。
5. **`site_stats`**：
   - 键值存储表：`(key TEXT PRIMARY KEY, value INTEGER/TEXT)`。
   - `'skills_count'`：全站已发布技能总数（由触发器自增/自减实时维护）。
   - `'featured_home_repo_ids'`：首页展示的高权重精选仓库 ID。
   - `'featured_repo_ids_cat_{id}'`：各垂直分类下固化展示的仓库 ID 列表。

### 3.2 全文检索与触发器 (FTS5 & Triggers)

- **`skills_fts`**：
  基于 SQLite FTS5 的虚拟表，使用 `porter` 词干分析器：
  `CREATE VIRTUAL TABLE skills_fts USING fts5(slug UNINDEXED, author_name UNINDEXED, name, tagline, description, content='skills', content_rowid='id', tokenize='porter');`
- **自动同步触发器**：
  - `skills_ai`：向 `skills` 插入记录后自动将字段写入 `skills_fts`。
  - `skills_ad`：从 `skills` 删除记录后自动在 `skills_fts` 标记 `'delete'`。
  - `skills_au`：更新 `slug`, `author_name`, `name`, `tagline`, `description` 时同步更新 `skills_fts`。
  - `trg_increment_skills_count` / `trg_decrement_skills_count`：自动更新 `site_stats` 中的 `'skills_count'`，杜绝在接口层执行高昂的 `SELECT COUNT(*)`。

---

## 4. 关键代码模块实现详解

### 4.1 数据访问适配层 (`src/lib/db.ts`)

- **环境适配引擎（`query` 函数）**：
  支持双通道自动切换：
  1. 优先调用 `@cloudflare/next-on-pages` 的 `getRequestContext().env.DB`，以 Cloudflare Worker 原生 D1 Prepared Statement 零开销执行。
  2. 若未挂载上下文（如本地开发环境），则回退到通过 `fetch()` 直连 Cloudflare REST API：`POST https://api.cloudflare.com/client/v4/accounts/{ID}/d1/database/{ID}/query`。
- **数据容错与归一化（Normalizers）**：
  - `safeParseJson<T>`：处理 D1 驱动返回异常、包含双重引号转义（如 `"{""key"": 1}"`）或外层多余包裹字符的脏数据，确保解析安全。
  - `normalizeSkill`、`normalizeAuthor`、`normalizeRepoSuite`：对数据库返回的 `null`、字符串数字及类型字段进行严格 TypeScript 强类型转型。
- **查询记忆化缓存（`cache()`）**：
  对高频访问的点查函数（如 `getSkillBySlug`、`getAuthorByLogin`、`getRepoSuiteByOwnerName`、`getSkillsMaxId`、`getSkillsByIds`）全量采用 React 原生 `cache()` 包装，实现同一次 HTTP 请求内数据拉取的单例复用。
- **核心查询函数 `filterSkills(filters)` 实现逻辑**：
  1. **纯净态阻断**：若未传入任何筛选条件，直接返回 `[]`，不进行任何 SQL 拼接。
  2. **分类快慢分离**：若只有 `categorySlug` 而无搜索词和其他交叉条件，直接从 `categories.featured_skill_ids` 抽取主键，调用 `getSkillsByIds()` 后在内存切片（最多 200 条），绕过繁重联查。
  3. **延迟多维拼接**：
     - 使用 `joinParams` 与 `whereParams` 两个独立数组严格分离参数绑定顺序，避免参数错位。
     - FTS5 搜索强制限制 `LIMIT 100`。
     - 关键词使用 `EXISTS (SELECT 1 FROM skill_keywords ...)` 保证行数不被多对多关系放大。
     - 防御性分页拦截：普通模式 `offset + limit <= 200`，作者专页模式放宽至 `2000`。
     - 先查询有序 `id`，再执行 `IN (...)` 取出全量字段。

### 4.2 路由系统与渲染逻辑 (`src/app/`)

- **根布局与字体 (`layout.tsx`)**：
  - 注入 `Inter` (`--font-sans`) 与 `JetBrains_Mono` (`--font-mono`)。
  - 预连接 GitHub 头像域名：`<link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />`。
  - 挂载全局全局层 `noise-overlay` 数字噪点。
  - 注入 `WebSiteStructuredData`（含 Google Sitelinks Searchbox）以及上下文 Providers。
- **首页 (`page.tsx`)**：
  - 缓存策略：`revalidate = 604800`（7 天）。
  - 并发拉取：`getFeaturedRepoSuites(8)`、`getSkillsMaxId()`、`getAllCategories()`，并通过各分类预设的 `featured_skill_ids` 并行提取每个垂直领域的 8 个高星标技能。
  - 渲染大厂官方信任背书墙（微软、Anthropic、AWS、英伟达等 10 家科技领袖矩阵），展示 10 大分类货架，底部分发 FAQPage 结构化数据。
- **全景探索工作台 (`explore/page.tsx`)**：
  - 缓存策略：`revalidate = 604800`。
  - 搜索/筛选态防抓取：只要 URL 携带 `q`、`category`、`authorType`、`complexity` 等动态参数，`generateMetadata` 自动注入 `robots: { index: false, follow: true }`，防止爬虫陷入无效 URL 迷宫。
  - 纯净空态处理：当无任何参数时，界面展现 `isPristine` 留白引导，不扫描库。
- **技能单页 (`skill/[slug]/page.tsx`)**：
  - 缓存策略：`revalidate = 31536000`（1 年超长 ISR 缓存）。
  - 页面结构：
    - 左 7 列：作者信息（认证标识、GitHub/官网/X 矢量链接）、技能名称、Tagline、GitHub Stars/Forks/更新时间统计、标签列表。
    - 右 5 列：`SkillInstallBlock`（支持 npx、pnpm dlx、bunx 一键复制与结构化提示词）。
    - 下方区域：自然语言依赖清单、`MarkdownView` 渲染内容、FAQ 手风琴、一排 4 列相关技能推荐。
- **垂直分类落地页 (`category/[slug]/page.tsx`)**：
  - 缓存策略：`revalidate = 604800`。
  - 首屏利用预设 ID 直出 12 个核心技能，配合客户端 `CategorySkillsList` 组件支持无限滚动触底加载。
- **开发者与企业主页 (`company/[login]/page.tsx`)**：
  - 校验非 404 状态后，渲染作者画像。若 `capability_breakdown` 存在大于 0 的数值，调用纯 SVG 渲染的 `CapabilityChart` 绘制技能分布图谱。
  - 通过 `AuthorPageContent` 支撑“技能视图”与“代码仓库视图”的双向无刷新切换及库内过滤。
- **精选仓库专题页 (`repo/[owner]/[name]/page.tsx`)**：
  - 缓存策略：`revalidate = 604800`。
  - 渲染仓库专属子技能，提供“安装全量仓库技能（`--all -g -y`）”与“多选自选技能安装”模式。自选模式下，屏幕底部常驻浮动抽屉实时组装安装指令；同时支持 Guide 引导文件提示词提取器。
- **最佳技能聚合中心 (`best-skills/page.tsx`)**：
  - 针对高商业价值搜索词优化，横向呈现全网最高 Star 综合套件，纵向平铺 10 大垂直分类精选仓库。
- **自主检索协议说明页 (`skills-search-cli/page.tsx`)**：
  - 提供智能体自主检索工具的安装指引（`npx skills add ... --skill skill-discovery`），提供跨多智能体系统提示词规则（AGENTS.md / CLAUDE.md / .cursorrules）一键拷贝。
- **服务端动作与提交 (`actions.ts`)**：
  - `submitSkillUrl(formData)`：
    1. **透明蜜罐（Honeypot Trap）**：读取 `company_verification_hp` 字段。若机器人自动填充该字段，直接返回伪造成功状态（`success: true`），不入库、不报错，诱捕并静默拦截恶意脚本。
    2. 字段截断：`repo_url` 截断为 255 字符，`email` 截断为 100 字符，`notes` 截断为 500 字符。
    3. 正则校验：必须满足标准 GitHub 仓库 URL 格式 `^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+(\/.*)?$`。
    4. 入库 `skill_submissions` 表。
- **站点地图体系 (`sitemap.xml/route.ts` & `sitemap-index/[id]/route.ts`)**：
  - `sitemap.xml` 动态获取总技能数与总作者数，按每卷 10,000 条切分为分卷：`static.xml`、`repos.xml`、`authors-*.xml`、`{chunk}.xml`。
  - 分卷内时间戳使用 `formatLastmod` 转换，标准化输出 `YYYY-MM-DD` 格式。

### 4.3 核心客户端组件 (`src/components/client/`)

- **`SkillCard.tsx`**：
  - 通用技能卡片：展示 28px 圆形头像（可独立点击且不触发卡片导航）、所有者 ID、金色 GitHub Star 勋章、技能名称、Tagline 描述、Official/Community 徽章以及三段式复杂度等级信号条（`Basic` 一格绿、`Intermediate` 两格绿、`Advanced` 三格绿）。
  - 点击卡片时，在 `sessionStorage` 记录当前视口滚动 Y 轴位置，优化回退导航体验。
- **`RepoCard.tsx`**：
  - 仓库套件卡片：展示真实 GitHub Star 计数、作者头像（带防冒泡路由跳转）、仓库名称、Tagline 及收录技能总数。
- **`SkillInstallBlock.tsx`**：
  - 紧凑型安装控制器：提供 `npx`、`pnpm dlx`、`bunx` 三选一切换。通过 `getRepoRoot()` 算法清洗提取 GitHub 仓库根路径，生成形如 `${pkg} skills add ${repoRoot} --skill ${skill.slug}` 的标准指令。折叠区提供针对大语言模型的结构化提示词（Structured Prompt）。
- **`RepoSuiteClientView.tsx`**：
  - 仓库套件工作台：支持“全部安装”与“自选安装”模式切换。在自选模式下，技能网格切换为复选态，选中的技能 slug 汇聚到屏幕底部的吸附浮动条，支持一键复制代码与重置。
- **`CapabilityChart.tsx`**：
  - 纯 SVG 环形分布图：利用极坐标转换算法（`polarToCartesian`）动态计算 SVG 路径 `M ... A ...` 指令，客户端无任何状态，避免水合不一致问题。
- **`SkillsGrid.tsx` & `CategorySkillsList.tsx`**：
  - 无限滚动引擎：使用 `IntersectionObserver` 监控底部哨兵元素（Sentinel，预留 200px `rootMargin` 触发）。
  - 翻页请求携带内部专用头 `x-skills-client: web-app-v1`。
  - 数据合并使用 `Set<id>` 严格排重。
- **`CompaniesDirectory.tsx`**：
  - 科技企业大黄页检索：包含 8 大核心领域 Tab 切换与实时输入过滤。服务端一次性返回官方企业全集，客户端内存切片分页（每次展示 24 家），搜索和过滤无需网络开销。
- **`AgentConnectButton.tsx`**：
  - 自动识别用户操作系统（Windows PowerShell vs Unix/macOS Bash），下拉支持 Claude Code、Codex、Cursor、Trae、OpenClaw 等智能体目录，点击后自动复制对应的 `git sparse-checkout` 脚本。

### 4.4 服务端组件 (`src/components/server/`)

- **`MarkdownView.tsx`**：
  - 安全排版渲染引擎：基于 `react-markdown`。为防止用户提供的内容破坏整站单一 H1 的 SEO 评分，组件强制执行标题降级映射：
    - `h1` $\rightarrow$ `<h2>`（带底部分隔线）
    - `h2` $\rightarrow$ `<h3>`（带蓝色圆角小竖条）
    - `h3` $\rightarrow$ `<h4>`
- **`Footer.tsx`**：
  - 采用四列经典导航架构（Discovery, Developers, Platform, Legal），全站无死链；提供平滑回到顶部按钮与实时系统运行状态指示灯。

---

## 5. 国际化与静态数据字典 (`src/lib/i18n.ts` & `src/lib/staticData.ts`)

- 国际化支持英语（`en`）与简体中文（`cn`），状态持久化在 `localStorage.getItem('skills-lang')`。
- 调用 `t(key, lang)` 获取双语字典。当字典缺少键名时，开发环境记录警告，生产环境安全回退键名自身。
- 10 大核心垂直业务分类固化在 `STATIC_CATEGORIES` 数组中，各分类均有固定 ID、Emoji 与 slug：
  1. Product & Management (`product-management`, `🚀`)
  2. Software Engineering (`software-engineering`, `💻`)
  3. Design & Creative (`design-creative`, `🎨`)
  4. Marketing & Sales (`marketing-sales`, `📈`)
  5. Data & Analytics (`data-analytics`, `📊`)
  6. Legal & Compliance (`legal-compliance`, `⚖️`)
  7. Finance & Accounting (`finance-accounting`, `💰`)
  8. Content & Communication (`content-communication`, `✍️`)
  9. Education & Research (`education-research`, `🎓`)
  10. Personal & Entrepreneur (`personal-entrepreneur`, `💡`)

---

## 6. 安全、反爬与 SEO 体系

### 6.1 反爬虫与安全性设计
- **接口暗号拦截**：
  内部数据流接口 `/api/skills` 强制校验请求头 `x-skills-client: web-app-v1`。脚本非法直刷接口直接返回 403 Forbidden。
- **最大分页深度防御（Offset Guardrails）**：
  - Explore 探索与公共搜索：硬性拦截 `offset + limit <= 200`，超出部分直接短路返回空数组。
  - 作者专页：考虑到大厂的技能量，限制放宽至 `offset + limit <= 2000`。
- **爬虫抓取黑洞封堵 (`src/app/robots.ts`)**：
  明确声明 `disallow: ['/api/', '/private/', '/*?*']`，阻止搜索引擎抓取带查询参数的动态页面，聚焦抓取静态落地页与详情页。

### 6.2 Schema.org 结构化数据
- **`WebSiteStructuredData.tsx`**：注入顶级 `WebSite` 实体（激活 Google 站内直达搜索框 `potentialAction`）与 `Organization` 实体。
- **`StructuredData.tsx`**：为技能单页注入 `SoftwareApplication`、`BreadcrumbList` 以及 `FAQPage` 实体。内置 `toIsoDate()` 修复 SQLite 空格时间，避免出现 Google 警告。
- **`AuthorStructuredData.tsx`**：为作者页注入 `Organization` / `Person` 与 `CollectionPage`，建立作品集到实体的关联映射。
- **`CategoryStructuredData.tsx`**：为各分类页面注入 `CollectionPage` 与分类面包屑实体。

---

## 7. 常用开发与构建指令

```bash
# 启动本地开发服务 (Next.js + Turbopack)
npm run dev

# 生产环境编译构建
npm run build

# 代码风格与 Lint 检查
npm run lint

# 构建 Cloudflare Pages 静态产物与 Worker 边缘打包
npm run pages:build
```

### 本地环境变量配置 (`.env.local`)
当本地调试需要直连线上 Cloudflare D1 进行数据验证时，配置如下参数：
```ini
CLOUDFLARE_ACCOUNT_ID="your_cloudflare_account_id"
CLOUDFLARE_API_TOKEN="your_d1_api_read_token"
D1_DATABASE_ID="6b151f56-acad-4d30-9de5-7a11b5108aef"
NEXT_PUBLIC_SITE_URL="https://skills.rest"
```

---

## 8. AI 助手修改代码的必须守则 (Golden Rules for Coding)

1. **绝对禁令**：禁止执行 `git commit` 或 `git push` 命令，除非用户在当前对话中明确要求。
2. **边缘环境兼容**：所有新增及修改的代码必须能够在 Cloudflare Workers Edge Runtime 下编译运行，禁止引入 Node.js 专属原生包。
3. **保持延迟关联机制**：严禁在 `filterSkills` 或类似函数中直接将 `skills` 宽表与外部大表全字段连接。必须保持“一阶段查有序主键 ID，二阶段批量主键回表拉取宽字段”的设计。
4. **恪守数据发布状态**：在所有前台查询中，**必须保证 `status = 'pending'` 判定条件**。禁止将其擅自修改为 `approved`。
5. **保证唯一 H1**：修改组件或页面时，确保单个 HTML 页面内存在且仅存在一个 `<h1>` 标签。Markdown 正文渲染必须维持标题降级策略。