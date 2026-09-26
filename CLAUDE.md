# CLAUDE.md

本文件为 **skills.rest** 项目的完整架构指南与技术规范，全面、详尽地记录了整个系统的运行逻辑、数据流转机制、各模块代码的职能划分以及开发维护规范。

---

## 1. 项目概述与核心哲学

**skills.rest** 是一个面向 AI 智能体（涵盖 Claude Code、OpenClaw、Cursor、Codex、Trae、ChatGPT 等）的开源技能注册表与检索分发市场，索引了 645,000+ 个已审核的可执行智能体技能。每个技能均遵循开源 `SKILL.md` 规范，包含标准化的结构化指令以及可选的执行脚本和外部资源。

### 核心架构原则
1. **边缘计算优先（Edge-First Execution）**：全站所有动态与静态路由均运行在 Cloudflare Edge Runtime 边缘节点上（代码中统一声明 `export const runtime = 'edge'`），依托 Cloudflare Pages 与 Workers 实现全球就近执行与毫秒级首字节响应。
2. **极致缓存体系（Extreme Cache Strategy）**：静态及以读取为主的动态路由重度依赖长效 CDN 缓存控制头（`s-maxage`、`stale-while-revalidate`）以及 Next.js 增量静态再生成机制（ISR：`revalidate = 604800`［7天］或 `31536000`［1年］）。
3. **防御性数据库查询（Defensive Database Queries）**：针对 645k+ 的超大数据集，严格采用“延迟关联（Deferred Join）”、SQLite FTS5 BM25 搜索结果截断、深度分页边界防御（普通检索限制最大分页偏移量 offset 200，作者维度限制 2000）以及内存切片纯前端分页，彻底杜绝导致数据库 CPU 打满的全表扫描。
4. **反直觉的底层数据状态定义（Counter-Intuitive Model Status）**：
   - **`status = 'pending'`** 在数据库中代表**已上线、处于发布状态、公开可见的技能**。
   - `'approved'` 与 `'rejected'` 仅用作历史或内部审核标记。
5. **Git 提交铁律（No GitHub Push Rule）**：
   > **关键禁令**：除非用户给出明确要求，严禁执行任何 `git commit` 或 `git push` 操作（`禁止提交和推送到GitHub。除非用户明确要求。`）。

---

## 2. 技术栈与底层依赖

- **应用框架**：Next.js 15.5+（App Router 架构，兼容 Turbopack 编译）
- **运行环境**：Cloudflare Pages / Workers（适配器为 `@cloudflare/next-on-pages`，开启 `nodejs_compat` 运行时兼容标志）
- **用户界面库**：React 19（`react`, `react-dom`）
- **样式与设计系统**：Tailwind CSS 3.4+（集成了 `@tailwindcss/typography` 排版插件，基于 HTML class 的自定义深浅色模式切换）
- **主数据库**：Cloudflare D1（基于 SQLite 的分布式 Serverless SQL 数据库），辅以 SQLite FTS5 全文检索虚拟表
- **对象存储**：Cloudflare R2（用于技能 ZIP 压缩包的存储与全球 CDN 下载加速：`pub-cd65669746d54319c4e830260a1c3864.r2.dev`）
- **Markdown 渲染引擎**：`react-markdown`（10.x 版本），配合自定义标头降级处理器以保证文档 SEO 权重
- **开发语言与字体配置**：严格类型检查的 TypeScript，搭配 Google 字体 Inter（`--font-sans`）与 JetBrains Mono（`--font-mono`）

---

## 3. 完整目录结构与各模块职能说明

```
skill_web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 全局根布局：管理字体注入、全局 Meta 声明、GitHub 头像域名预连接（preconnect/dns-prefetch）与全局上下文 Providers
│   │   ├── page.tsx                  # 官方首页：包含 Hero 搜索区、10 大科技巨头信任背书墙、明星仓库榜单、10 大业务领域货架流与 FAQ 问答库
│   │   ├── globals.css               # 全局样式定义：包含数字噪点背景覆盖层（Digital Noise Overlay）与深浅色模式自适应滚动条
│   │   ├── actions.ts                # 服务端动作（Server Actions）：包含带蜜罐陷阱与强正则校验的技能提交接口（submitSkillUrl）及服务端检索接口（fetchSkills）
│   │   ├── robots.ts                 # 搜索引擎爬虫抓取规则定义：放行主干页面，屏蔽 /api/、/private/ 与带参数的多维筛选动态中间页（/*?*）
│   │   ├── error.tsx                 # 全局顶级未捕获异常降级兜底错误页面
│   │   ├── api/
│   │   │   └── skills/route.ts       # 内部技能数据接口：设有 x-skills-client: web-app-v1 专用暗号鉴权与最大分页深度拦截
│   │   ├── sitemap.xml/route.ts      # 根站点地图索引生成器（Sitemap Index）：动态计算总切片数并分发展现各子地图入口
│   │   ├── sitemap-index/[id]/       # 分块 XML 站点地图接口（每卷限 10,000 条）：分为静态页、仓库套件页、作者画像分块以及全量技能分块
│   │   ├── explore/                  # 全库技能多维探索筛选系统
│   │   │   ├── page.tsx              # 探索页面服务端壳工程：无筛选时展现纯净引导态，存在筛选时调度 SkillsGrid
│   │   │   ├── loading.tsx           # 探索页骨架屏加载过渡动画
│   │   │   └── error.tsx             # 探索页专属异常重试界面
│   │   ├── skill/[slug]/page.tsx     # 技能单页详情视图：包含安装代码终端（npx/pnpm/bunx）、系统依赖自然语言描述、正文 Markdown、FAQ 展开项与底部相关技能推荐
│   │   ├── category/[slug]/          # 10 大垂直领域分类落地页
│   │   │   ├── page.tsx              # 分类落地页主入口：包含专属分类 Icon、SEO 长文本及基于精选主键列表的首屏直出
│   │   │   ├── loading.tsx           # 分类页骨架屏加载动画
│   │   │   └── error.tsx             # 分类页错误降级界面
│   │   ├── company/[login]/page.tsx  # 机构/作者开发者专属主页：包含作者 E-E-A-T 档案、纯 SVG 技能分布图谱、技能/代码仓库双视图
│   │   ├── companies/page.tsx        # 全球 335+ 认证官方科技企业与组织大黄页（基于 8 大生态位划分）
│   │   ├── repo/[owner]/[name]/page.tsx # 精选仓库套件专题页：展示全套技能批量安装指令、自定义勾选组合安装抽屉、仓库引导文件提示词提取器
│   │   ├── best-skills/page.tsx      # 最佳技能集合主枢纽（Best Skills Hub）：聚合全网最高 Star 技能仓库及 10 大业务分类下的顶级开源套件
│   │   ├── skills-search-cli/page.tsx# 智能体自主检索协议说明页：提供 npx 自动化工具安装指引与全智能体通用的系统级提示词规则配置（AGENTS.md/CLAUDE.md）
│   │   ├── contribute/page.tsx       # 技能收录提交页面：包含客户端输入表单与三大收录规范指南
│   │   ├── privacy/page.tsx          # 隐私合规政策：包含 Cookie 用途明细表、GDPR 与 CCPA 权利行使条款
│   │   └── terms/page.tsx            # 服务使用条款：平台权利界定、内容免责声明与知识产权归属
│   ├── components/
│   │   ├── providers/
│   │   │   ├── ThemeContext.tsx      # 主题与国际化状态注入：管理浅色/深色切换（dark class）及 en/cn 双语状态，持久化至 localStorage
│   │   │   └── EnvironmentContext.tsx# 客户端运行环境状态注入（'Claude Code' | 'Claude.ai' | 'API'）
│   │   ├── server/
│   │   │   ├── Footer.tsx            # 多层级系统页脚：分列展示 4 大功能导航组，内置实时运行状态指示灯与平滑回到顶部按钮
│   │   │   └── MarkdownView.tsx      # 安全 Markdown 渲染组件：实施标题级别降级策略（H1->H2, H2->H3），防止破坏页面单一 H1 权重
│   │   ├── client/
│   │   │   ├── Header.tsx            # 顶部吸顶导航栏：展示实时索引总数胶囊、语言/主题切换开关以及 Agent 连接弹窗开关
│   │   │   ├── HomeHero.tsx          # 首页大尺寸 Hero 搜索区：提供舒展的搜索框布局与翡翠绿纯文字信任背书
│   │   │   ├── SkillCard.tsx         # 全站统一技能展示卡片：包含 28px 独立可点击头像、金色 Star 勋章、三段式复杂度等级信号条与点击时位置记忆
│   │   │   ├── RepoCard.tsx          # 仓库套件展示卡片：展示 GitHub 真实 Star 数、作者认证徽章与收录子技能计数
│   │   │   ├── SkillInstallBlock.tsx # 紧凑型一键安装面板：集成 npx、pnpm dlx、bunx 三大包管理器指令切换与结构化提示词折叠复制
│   │   │   ├── SkillsGrid.tsx        # 技能无限滚动网格：使用 IntersectionObserver 监听哨兵元素，支持去重与 sessionStorage 滚动位置无感恢复
│   │   │   ├── ExploreSidebar.tsx    # 探索页多维侧边栏：聚合分类、来源属性（Official/Community）以及复杂度等级筛选
│   │   │   ├── SearchBar.tsx         # 通用搜索输入框：实时同步搜索词到 URL 查询参数（?q=...）
│   │   │   ├── CompaniesDirectory.tsx# 企业大黄页交互视图：内置 8 大生态位切换 Tab，基于客户端内存快速切片展现，完全零网络消耗
│   │   │   ├── AuthorPageContent.tsx # 作者主页核心交互：支持技能流与仓库流双视图切换、库内子搜索、仓库专属下拉过滤与触底自动翻页
│   │   │   ├── CapabilityChart.tsx   # 纯 SVG 环形分布图：利用极坐标转换算法（polarToCartesian）动态绘制扇区与引出文本，杜绝服务端与客户端渲染差异
│   │   │   ├── SkillsSearchCliView.tsx# CLI 页面客户端交互：提供多智能体目录切换（.claude, .codex, .cursor 等）与双配置安装卡片
│   │   │   ├── RepoSuiteClientView.tsx# 仓库专题页客户端控制台：支持全部安装与多选自选模式，自选时动态唤起底部吸附式操作面板
│   │   │   ├── ContributeForm.tsx    # 提交收录表单：带透明蜜罐防护，异步调用 Server Action 并给予响应式状态反馈
│   │   │   ├── AgentConnectButton.tsx# 智能体连接浮层按钮：自动检测 Windows/Unix 操作系统，提供多智能体配置脚本一键复制
│   │   │   ├── AnimatedCounter.tsx   # 缓动数字递增动效组件（基于 Ease-Out-Expo 算法）
│   │   │   ├── NavigationBar.tsx     # 基础面包屑导航组件
│   │   │   └── CategorySkillsList.tsx# 分类落地页专用无限滚动技能容器
│   │   ├── StructuredData.tsx        # 技能详情页 Schema.org 结构化数据注入（包含 SoftwareApplication、BreadcrumbList、FAQPage）
│   │   ├── AuthorStructuredData.tsx  # 机构/作者主页结构化数据（包含 Organization/Person、CollectionPage 及其 knowsAbout 知识领域）
│   │   ├── CategoryStructuredData.tsx# 分类落地页 CollectionPage 结构化数据
│   │   └── WebSiteStructuredData.tsx # 站点顶级 WebSite（附带 Sitelinks Searchbox）与 Organization 开源背书实体图谱
│   ├── lib/
│   │   ├── db.ts                     # 数据库底层驱动与数据访问引擎：双模连接适配、字段归一化清洗、延迟关联查询器与各类主键缓存函数
│   │   ├── staticData.ts             # 10 大核心分类静态定义（固定的分类 ID、英文名称、Slug 与专属 Emoji）
│   │   ├── i18n.ts                   # 国际化语言包字典（中英双语）与全局翻译工具函数 t(key, lang)
│   │   └── utils.ts                  # 数据解析容错工具：包含兼容双重引号转义的 safeParseJsonArray 函数
│   └── types.ts                      # 全局 TypeScript 类型定义与核心实体数据库接口契约
├── wrangler.toml                     # Cloudflare Worker 配置文件，声明 D1 数据库绑定（DB）与构建静态产物目录
└── 索引和触发器.sql                  # 生产数据库现役索引与触发器 DDL 备份（维护 FTS5 自动同步与技能总数递增）
```

---

## 4. 数据库模式与数据访问层 (`src/lib/db.ts`)

### 4.1 数据表定义与业务触发器

- **`skills`（技能主表）**：
  - 核心字段：`id`, `slug`, `name`, `tagline`, `description`, `source_url`, `r2_zip_key`, `author_name`, `author_type`, `complexity`, `stars`, `forks`, `hotness_score`, `status`, `dependencies`, `components`, `faq_json`, `related_ids`。
  - **`status` 状态字段**：发布状态为 `'pending'`，所有面向公众的前台查询均硬性限制 `status = 'pending'`。
- **`authors`（作者与企业表）**：
  - 存储 GitHub 用户及知名组织画像：`login`, `name`, `website`, `twitter`, `avatar_url`, `public_repos`, `followers`, `author_type`, `headline`, `primary_domain`, `capability_breakdown`（JSON）, `faqs`（JSON）, `skills_count`, `is_404`。
- **`repositories`（精选代码仓库套件表）**：
  - 聚合多技能仓库：`owner`, `name`, `repo_url`, `primary_category_id`, `author_type`, `stars`, `forks`, `skills_count`, `tagline`, `description`, `available_guides`（JSON）, `skill_ids`（逗号分隔的技能主键串）, `faqs`（JSON）。
- **`categories` 与 `skill_categories`（分类与映射表）**：
  - 多对多关联表，支持技能多分类映射。`categories.featured_skill_ids` 字段直接固化了该分类下的精选技能主键列表，用于支撑分类落地页与首页货架的高性能直出。
- **`keywords` 与 `skill_keywords`（关键词与标签表）**：
  - 存储打标数据，供关键词关联匹配与标签导航使用。
- **`site_stats`（全局静态计数器与配置表）**：
  - 键值（key-value）元数据表：
    - `'skills_count'`：全站已发布技能总数（由触发器实时维护，免去全表扫描 COUNT）。
    - `'featured_home_repo_ids'`：首页展示的明星仓库 ID 串。
    - `'featured_repo_ids_cat_{id}'`：对应分类下精选的仓库 ID 串。
- **`skills_fts`（SQLite FTS5 全文检索虚拟表）**：
  - 索引字段：`slug`, `author_name`, `name`, `tagline`, `description`。
  - 触发器联动：通过 `skills_ai`（插入后）、`skills_au`（更新后）、`skills_ad`（删除后）三套触发器保持与 `skills` 主表的物理数据实时同步。

### 4.2 双模式数据库查询引擎

`src/lib/db.ts` 中的 `query(sql, params)` 采用无缝双模工作机制：
1. **生产运行态（Cloudflare Worker 边缘节点）**：
   通过 `@cloudflare/next-on-pages` 的 `getRequestContext()` 获取环境变量上下文中的 `ctx.env.DB`（即 D1 原生实例），执行 `.prepare(sql).bind(...params).all()` 获得极低延迟响应。
2. **本地开发调试态（HTTP API Fallback）**：
   若未检测到 Worker 环境，自动读取 `.env.local` 中的 `CLOUDFLARE_ACCOUNT_ID`、`D1_DATABASE_ID` 与 `CLOUDFLARE_API_TOKEN`，通过原生 `fetch()` 请求 Cloudflare REST API 执行查询，支持开发机直连生产只读库进行调试。

### 4.3 高级查询模式与防击穿优化设计

- **延迟关联机制（Deferred Join）**：
  在复杂筛选与搜索函数 `filterSkills()` 中，绝不直接执行宽表关联。系统首先执行 `SELECT s.id FROM skills s ... LIMIT ? OFFSET ?` 只拉取极轻量的有序主键列表（12 至 24 个整数 ID），随后使用 `SELECT * FROM skills WHERE id IN (...)` 通过主键精准拉回全字段数据。该机制规避了大数据量多表连接引起的临时表排序和内存耗尽。
- **FTS5 检索 BM25 评分与 Top-100 强行截断**：
  用户搜索时，搜索词会被清洗提取为前缀匹配表达式（如 `pdf* AND extract*`），并在 FTS 虚拟表子查询中利用 BM25 权重 `(0.0, 0.0, 10.0, 5.0, 1.0)` 进行精准排序，同时严格执行 `LIMIT 100`。主表查询仅在此 100 条候选主键集合内进行约束关联，彻底将全文检索的检索范围限制在常数级别。
- **反爬虫最大分页深度防护（Scraping Offset Guardrails）**：
  - 普通 Explore 搜索与多维筛选：硬性限制最大可见深度为 `offset + limit <= 200`。任何超出 200 的翻页请求直接在应用层短路返回空数组。
  - 作者主页专属搜索：因顶级大厂（如 Microsoft）技能数较多，限制放宽至 `offset + limit <= 2000`。
- **数值取整规整化（Count Normalization）**：
  为避免实时数据的微小变动导致搜索引擎缓存摘要频繁失效，`getSkillsCount()` 与 `getSkillsMaxId()` 对外呈现时均抹去个、十、百位，向下保留至千位整数（如 645,954 被规范化呈现为 645,000）。
- **React 请求生命周期级去重（Request Memoization）**：
  所有关键的点查函数（如 `getSkillBySlug`、`getAuthorByLogin`、`getSkillsByIds`、`getFeaturedRepoSuites`）全部通过 React 原生 `cache()` 函数包装。同一服务端请求渲染生命周期内的多次重复调用均复用首次查询结果，避免重复打点数据库。

---

## 5. 路由架构与运行时执行逻辑

| 访问路由 | 动态参数 | 缓存与再生成（ISR） | 核心业务与渲染逻辑 |
|---|---|---|---|
| `/` | 无 | `revalidate = 604800`（7天） | **官方主站入口**：并发拉取全站总数、8 个首页明星仓库、10 大官方科技大厂以及 10 大分类下的精选技能。按 10 大专业领域分排展现“技能货架”，底部渲染结构化 FAQPage Schema 问答库。 |
| `/explore` | `q`, `category`, `authorType`, `complexity` | `revalidate = 604800`（7天） | **全景技能探索工作台**：未传入任何筛选或搜索参数时，渲染纯净空白引导态（不扫库）；一旦带有筛选参数，调度 `filterSkills` 执行延迟关联查询，并通过 `SkillsGrid` 支持触底无限滚动。 |
| `/skill/[slug]` | `slug` | `revalidate = 31536000`（1年超长缓存） | **技能详情单页**：利用 slug 检索技能宽表与作者信息。渲染 npx/pnpm/bunx 多包管理器终端安装框、自然语言依赖规范、安全 Markdown 正文、FAQ 问答手风琴以及一排 4 列相关技能推荐。 |
| `/category/[slug]` | `slug` | `revalidate = 604800`（7天） | **垂直业务分类落地页**：根据 Slug 匹配 10 大分类配置，直接提取对应分类预存的 `featured_skill_ids` 快速出流展示卡片，支持客户端下拉追加加载，底部附带 SEO 引导长文本。 |
| `/best-skills` | 无 | `revalidate = 604800`（7天） | **最佳技能与优质套件聚合中心**：横向铺设全网最高 Star 综合套件，纵向平铺 10 大分类精选仓库货架，强化“Best Skills”核心商业搜索词的自然收录。 |
| `/companies` | 无 | `revalidate = 604800`（7天） | **企业与官方开发者大黄页**：一次性拉取全量 Official 认证组织，在客户端交由 `CompaniesDirectory` 组件实现 8 大生态位无感切换与纯内存切片加载。 |
| `/company/[login]`| `login` | `revalidate = 604800`（7天） | **开发者个人与企业主页**：校验作者非 404 状态。渲染作者头像与社交矩阵，展示专属纯 SVG 技能分布图，提供“技能视图”与“代码仓库视图”无刷新 Tab 切换与库内搜索。 |
| `/repo/[owner]/[name]`| `owner`, `name` | `revalidate = 604800`（7天） | **精选代码仓库专题页**：包含该仓库下的全部子技能网格。默认模式支持直接点击卡片查看技能，自选模式勾选时在屏幕底部唤起常驻吸附式命令组装抽屉；提供配置指引文件（Guide）提示词提取器。 |
| `/skills-search-cli` | 无 | `revalidate = 604800`（7天） | **技能检索命令行指南**：专为开发者与智能体自身设计，介绍如何通过 npx 安装自动化检索工具或将通用提示词规则（Rule）写入工程根目录。 |
| `/contribute` | 无 | `revalidate = 604800`（7天） | **开放技能提交门户**：渲染包含蜜罐陷阱的表单，直通 Server Action 处理用户提交并告知审核规范。 |
| `/privacy`, `/terms`| 无 | `revalidate = 604800`（7天） | **法律合规单页**：明确数据使用方式、第三方托管服务、免责声明及知识产权保护。 |
| `/api/skills` | 查询参数 | Edge HTTP 强缓存 | **内部流式分页接口**：供无限滚动组件异步请求。硬性检验 `x-skills-client: web-app-v1` 报头，实施最大偏移截断。 |
| `/sitemap.xml` | 无 | Edge HTTP 缓存 | **站点地图总索引**：动态聚合全站技能数与作者数，按每卷 10,000 条输出包含所有子 XML 路径的索引树。 |
| `/sitemap-index/[id]`| `id` | Edge HTTP 缓存 | **站点地图分卷实体**：动态构建各分卷 XML 内容。涵盖 static（固定单页与分类）、repos（仓库套件）、authors-*（作者画像）与数字 ID 技能集。 |

---

## 6. 核心组件职能详解

### 6.1 交互式客户端组件

- **`SkillInstallBlock.tsx`（技能终端安装面板）**：
  - 核心功能：自动解析 GitHub 源码链接并提取根路径，动态生成安装命令。
  - 包管理器支持：提供 `npx`、`pnpm dlx`、`bunx` 三选一 Tab 切换，指令形如 `${pkg} skills add ${repoRoot} --skill ${skill.slug}`。
  - 辅助功能：折叠提供专为 AI Agent 设计的结构化提示词（Structured Prompt），供用户直接粘贴至对话界面引导模型自行拉取技能。
- **`RepoSuiteClientView.tsx`（仓库专题页客户端控制台）**：
  - 模式切换：
    1. *全部安装（Install All）*：组装 `--all -g -y` 全局安装参数。
    2. *自选安装（Install Partial）*：将技能网格切换为复选交互。选中的技能 Slug 实时汇总至屏幕底部常驻浮动操作栏中，支持一键重置与指令复制。
  - Guide 引导文件提取：支持一键复制带安全规则的系统提示词（强调不可直接覆盖本地同名配置，需主动比对差异）。
- **`CapabilityChart.tsx`（纯 SVG 环形分布图）**：
  - 算法实现：不引入第三方图表库，完全基于几何三角函数（`Math.sin`、`Math.cos`）与 SVG Path 的 `A`（椭圆弧）指令绘制环形切片。
  - 稳定性：数据在服务端清洗为标准对象，客户端无状态纯渲染，杜绝了 SSR 与客户端 Hydration 的不一致问题。
- **`AgentConnectButton.tsx`（智能体连接快捷弹窗）**：
  - 自动操作系统识别：依据浏览器 `userAgent` 识别 Windows 或 Unix/macOS 环境。
  - 智能体适配：下拉菜单罗列 Claude Code（`.claude`）、Codex（`.codex`）、Cursor（`.cursor`）、OpenClaw（`.openclaw`）等目标目录。点击后自动复制对应的 PowerShell 或 Bash 命令，使用稀疏检出（Sparse-Checkout）下载 `skill-discovery` 辅助包。
- **`CompaniesDirectory.tsx`（企业大黄页检索工作台）**：
  - 8 大生态位分类：预置全量覆盖的 MECE 技术生态位（云基础设施、AI与模型、数据与数据库、安全合规、开发者工具等）。
  - 零网络开销交互：服务端一次性加载全量列表，前端通过 `useMemo` 实时响应搜索与生态位切换，采用每页 24 条切片展示，杜绝重复向后端发送 HTTP 请求。
- **`SkillsGrid.tsx` 与 `CategorySkillsList.tsx`（无限滚动列表）**：
  - 视口监听：利用 `IntersectionObserver` 监控列表底部的隐形哨兵元素（Sentinel），在距离底部 200px 时自动发起网络翻页请求。
  - 体验与数据防御：跳转前将当前 Y 轴滚动距离保存至 `sessionStorage`，回退时自动定位；追加新数据时使用 `Set<id>` 做排重校验。

### 6.2 服务端组件

- **`MarkdownView.tsx`（排版与 Markdown 渲染引擎）**：
  - 职能：安全将数据库中存储的 Markdown 描述文档转换为符合 Tailwind 样式的 HTML 内容。
  - SEO 标题层级约束：为保证全站 HTML 规范中页面独占唯一的 `<h1>`，本组件通过覆盖 `react-markdown` 的渲染规则，强制将内容中的 `#` 转为 `<h2>`、`##` 转为 `<h3>`、`###` 转为 `<h4>`，确保 Google 等搜索引擎的文档大纲层级评分最优。
- **`Footer.tsx`（多功能系统级页脚）**：
  - 四列布局：清晰划分技能发现（Discovery）、开发者工具（Developers）、平台支撑（Platform）与法律事务（Legal）。
  - 零死链设计：所有站内链接均指向有效承载页；内置回到顶部交互与系统健康指示灯。

---

## 7. 安全、反爬与 SEO 系统

### 7.1 安全防护与反爬虫设计
- **透明蜜罐陷阱（Honeypot Bot Trap - `src/app/actions.ts`）**：
  技能收录表单包含一个在视觉与屏幕阅读器上完全隐藏的输入字段 `company_verification_hp`。正常人类用户无法感知，而自动化爬虫脚本在抓取 DOM 后会自动填入垃圾内容。服务端一旦检测到该字段有值，会**伪装返回提交成功状态**，既不入库也不抛错，防止恶意脚本探知防护策略。
- **强类型过滤与参数截断**：
  所有外部输入严格实施最大字符数硬截断（仓库 URL 限制 255 字符、Email 限制 100 字符、备注限制 500 字符），仓库链接强制使用严格 GitHub 仓库正则表达式白名单校验。
- **内部接口调用暗号校验**：
  `/api/skills` 接口在入口处强制比对请求头 `x-skills-client: web-app-v1`。凡是非法发起的脚本直连请求，一律直接在边缘响应 HTTP 403 Forbidden。

### 7.2 搜索引擎优化与结构化数据体系
- **全方位 Schema.org 知识图谱**：
  - `WebSiteStructuredData.tsx`：为整站注入 WebSite 实体（激活 Google 站内直达搜索框 Sitelinks Searchbox）以及 Organization 实体。
  - `StructuredData.tsx`：为每个技能单页注入 `SoftwareApplication` 实体、`BreadcrumbList` 面包屑实体以及 `FAQPage` 问答实体；内置 `toIsoDate()` 修复函数，将 SQLite 空格时间强制转换为合法 ISO-8601 格式，消除 Google Search Console 警告。
  - `AuthorStructuredData.tsx`：为作者主页注入 `Organization` 或 `Person` 实体，通过 `about: { '@id': ... }` 关联作品集并注入擅长领域（`knowsAbout`）。
- **爬虫抓取配额优化（`src/app/robots.ts`）**：
  - 显式声明禁止抓取 `/api/` 内部接口与 `/private/` 目录。
  - 声明 `disallow: ['/*?*']`，封堵任何由带查询参数的筛选页面构成的无限 URL 抓取黑洞，将抓取预算集中于静态落地页与技能详情单页。
- **动态分卷站点地图（`src/app/sitemap.xml`）**：
  针对 645k+ 的超庞大索引量，动态以 10,000 条为单位拆分站点地图分卷（`0.xml`, `1.xml`, ..., `authors-0.xml`, `repos.xml`, `static.xml`），确保单个 XML 体积远低于 50MB 及 50,000 条的 Google 抓取红线。

---

## 8. 国际化体系 (`src/lib/i18n.ts`)

- 支持**英文（`en`）**与**简体中文（`cn`）**双语无缝切换。
- 状态由客户端 `ThemeContext` 统一管理，并持久化到本地存储（`localStorage.getItem('skills-lang')`）。
- 首页文案、导航标签、分类名称、分类业务描述、各大核心 FAQ 以及操作按钮文案均在 `dictionary` 字典中完整维护，通过调用 `t(key, lang)` 获得对应语言文本，若键名缺失则在开发环境下抛出警告并安全回退。

---

## 9. 开发、构建与部署指令

```bash
# 启动本地开发服务器（基于 Next.js 与 Turbopack 编译）
npm run dev

# 执行标准生产打包构建
npm run build

# 执行代码风格与 Next.js ESLint 规范检查
npm run lint

# 构建 Cloudflare Pages 静态产物与 Worker 边缘执行脚本
npm run pages:build
```

### 本地开发环境变量配置 (`.env.local`)

本地调试若需通过 HTTP 接口查询远程 Cloudflare D1 数据库，必须在项目根目录创建 `.env.local` 文件并配置以下变量：
```ini
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_d1_read_token"
D1_DATABASE_ID="6b151f56-acad-4d30-9de5-7a11b5108aef"
NEXT_PUBLIC_SITE_URL="https://skills.rest"
```

---

## 10. AI 辅助开发的核心铁律

所有协助开发本项目的 AI 编程助手（Claude Code / Codex / Cursor 等）必须严格遵循以下原则：

1. **绝对禁止私自提交与推送代码**：严禁在未获得用户明确指令的情况下擅自执行 `git commit` 或 `git push` 命令。
2. **严守 Edge Runtime 兼容规范**：严禁引入 Node.js 原生特有模块（例如 `fs`、`path`、`child_process` 等）。全站所有代码必须能够在 Cloudflare Workers 边缘环境中无报错编译运行。
3. **不得破坏 `db.ts` 中的延迟关联架构**：严禁将 `filterSkills()` 重新改写为带大表宽字段的多表直接联查；必须始终保持“第一阶段查有序主键 ID，第二阶段用主键批量回表拉取宽字段”的设计。
4. **恪守数据状态定义规范**：牢记在 `skills` 数据表中，**`status = 'pending'` 才是已上线的公开技能**。任何查询前台技能的代码都必须保持此条件，严禁擅自变更为 `status = 'approved'`。
5. **保证文档大纲 SEO 唯一性**：任何页面只能包含一个 `<h1>` 标签。在编写组件时，严禁在 `MarkdownView.tsx` 或次级组件中引入非受控的 `<h1>`。