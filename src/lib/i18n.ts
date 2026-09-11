export type Language = 'en' | 'cn';

type Dictionary = {
  [key: string]: {
    en: string;
    cn: string;
  };
};

const dictionary: Dictionary = {
  // --- Header & Nav ---
  'nav.explore': { en: 'Explore', cn: '探索技能' },
  'nav.categories': { en: 'Categories', cn: '全部分类' },
  'nav.companies': { en: 'Organizations', cn: '大厂官方' },
  'nav.contribute': { en: 'Submit Skill', cn: '提交技能' },

  // --- Home Hero ---
  'home.hero.title': { en: 'Agent Skills Library', cn: '智能体技能库' },
  'home.hero.subtitle': { en: 'Equip ChatGPT and Claude with expert-level skills.', cn: '为 ChatGPT 与 Claude 装配专家级技能。' },
  'home.hero.search_placeholder': { en: "Search by task, tool, or keyword (e.g. 'pdf extraction', 'tdd workflow')...", cn: "按任务、工具或关键词搜索 (例如 'pdf extraction', 'tdd workflow')..." },
  'home.hero.search_btn': { en: 'Search', cn: '搜索' },

  // --- Home Sections ---
  'home.tech_leaders.title': { en: 'Official Skills by Tech Leaders', cn: '全球科技巨头官方认证技能' },
  'home.tech_leaders.view_all': { en: 'Explore All Organizations', cn: '探索全部官方组织' },
  'home.featured.title': { en: 'Best Skills', cn: '精选最佳技能' },
  'home.featured.subtitle': { en: 'Market-validated, top-starred agent skills across the community', cn: '经过市场验证、开源社区星标最高的高质量智能体技能。' },
  'home.featured.view_all': { en: 'View All Best Skills', cn: '查看全部最佳技能' },
  'home.domains.title': { en: 'Explore by Domain', cn: '按专业业务领域探索' },
  'home.domains.subtitle': { en: 'Hand-picked essential skills across 10 specialized workflow domains.', cn: '按 10 大核心专业领域精选的实用技能。' },

  // --- Home FAQs ---
  'home.faq.badge': { en: 'FAQ', cn: '常见问题' },
  'home.faq.title': { en: 'Frequently Asked Questions', cn: '常见问题解答' },
  'home.faq.subtitle': { en: 'Everything you need to know about what skills are, how to use them, and safety.', cn: '快速了解什么是技能、如何安装以及安全机制。' },
  'home.faq.q1': { en: 'What are Agent Skills for Claude Code and Codex?', cn: '什么是用于 Claude Code 和 Codex 的 Agent Skills？' },
  'home.faq.a1': { en: 'Introduced by Anthropic in 2025, Agent Skills are standardized instruction packages--typically a SKILL.md file plus optional scripts--that give AI coding agents specialized procedural knowledge. They teach agents like Claude Code and Codex exactly how to perform complex developer tasks deterministically.', cn: 'Agent Skills 于 2025 年由 Anthropic 推出,是标准化的指令包--通常包含一个 SKILL.md 文件和可选的执行脚本--为 AI 编程智能体提供专门的程序化知识。' },
  'home.faq.q2': { en: 'Are "Claude Skills" and "Agent Skills" the same thing?', cn: '"Claude Skills"与"Agent Skills"是同一个概念吗？' },
  'home.faq.a2': { en: 'Yes. Anthropic launched the feature as "Claude Skills," but the underlying open specification is widely known as Agent Skills because leading frameworks like Codex and Cursor have adopted the exact same SKILL.md format.', cn: '是的。Anthropic 最初将该功能命名为"Claude Skills"推出，但其底层的开放标准通称为 Agent Skills，因为 Codex 和 Cursor 等主流框架均已全面采用完全相同的 SKILL.md 格式规范。' },
  'home.faq.q3': { en: 'How does the Agent Search Tool work?', cn: 'Agent 搜索工具（Search Tool）是如何工作的？' },
  'home.faq.a3': { en: 'Our Search Tool is designed specifically for the agents themselves. By installing it once into your environment, your AI agent gains the ability to autonomously search, fetch, and execute any skill from the skills.rest library on demand, bypassing manual installations entirely.', cn: '我们的搜索工具专为 AI 智能体本身设计。只需在您的环境中安装一次，您的 AI 智能体便能根据当前任务自主检索、获取并执行 skills.rest 库中的任意技能。' },
  'home.faq.q4': { en: 'What is the difference between an Agent Skill and an MCP Server?', cn: 'Agent Skill 与 MCP Server（模型上下文协议）有什么区别？' },
  'home.faq.a4': { en: 'An MCP (Model Context Protocol) server provides your agent with live external data connections and API access via a client-server process. An Agent Skill provides local procedural logic, execution scripts, and guidelines. They are engineered to work together seamlessly.', cn: 'MCP（Model Context Protocol）服务器为智能体提供实时外部数据连接和 API 访问通道；而 Agent Skill 则提供本地程序逻辑、执行脚本和工作流指引。' },
  'home.faq.q5': { en: 'How does skills.rest ensure the security of indexed skills?', cn: 'skills.rest 如何确保收录技能的安全性？' },
  'home.faq.a5': { en: 'During ingestion, every skill--including its SKILL.md file, attached resources, and execution code--undergoes a strict security audit. To further assist developer assessment, we explicitly verify "Official" skills from recognized technology organizations and display real-time GitHub metrics for community submissions.', cn: '在收录过程中，每个技能都经过严格的安全审计。为方便开发者评估，我们明确认证来自知名科技大厂的"Official"官方技能，并展示实时 GitHub 数据指标。' },

  // --- Author / Company Page ---
  'author.artifacts_by': { en: 'Agent Skills by', cn: '收录的智能体技能：' },
  'author.indexed_desc': { en: 'Showing {skillsCount} vetted skills indexed across {reposCount} GitHub repositories.', cn: '展示收录于 {reposCount} 个 GitHub 仓库中的 {skillsCount} 个已审核技能。' },
  'author.skills_view': { en: 'Skills View', cn: '技能视图' },
  'author.repos_view': { en: 'Repositories', cn: '代码仓库' },
  'author.all_repos': { en: 'All repositories', cn: '全部代码仓库' },
  'author.search_placeholder': { en: "Search {author}'s skills...", cn: "搜索 {author} 的技能..." },
  'author.no_skills': { en: 'No matching skills found for this criteria.', cn: '未找到符合条件的技能。' },
  'author.followers': { en: 'Followers', cn: '关注者' },
  'author.public_repos': { en: 'Public Repos', cn: '公开仓库' },
  'author.published_skills': { en: 'Published Skills', cn: '收录技能数' },

  // --- Explore Page ---
  'explore.sidebar.category': { en: 'Filter: Category', cn: '过滤: 分类' },
  'explore.sidebar.all_nodes': { en: 'All Agent Skills', cn: '全部智能体技能' },
  'explore.sidebar.origin': { en: 'Filter: Origin', cn: '过滤: 来源' },
  'explore.sidebar.complexity': { en: 'Filter: Complexity', cn: '过滤: 复杂度' },
  'explore.sidebar.verified': { en: 'OFFICIAL', cn: '官方认证' },
  'explore.sidebar.community': { en: 'Community', cn: '社区贡献' },
  'explore.title': { en: 'Skill Explorer', cn: '技能探索' },
  'explore.subtitle.search': { en: 'Search results for', cn: '搜索结果：' },
  'explore.subtitle.browse': { en: 'Browsing Category:', cn: '当前分类：' },
  'explore.subtitle.default': { en: 'Access the complete library of Agent Skills.', cn: '访问完整的智能体技能库。' },
  'explore.search_placeholder': { en: 'Filter skills...', cn: '筛选技能...' },
  'explore.signal_lost': { en: 'Signal Lost', cn: '未找到匹配结果' },
  'explore.no_results': { en: 'No skills match your query parameters.', cn: '没有符合查询参数的技能。' },
  'explore.reset': { en: 'Reset Filters', cn: '重置筛选条件' },

  // --- Companies Directory ---
  'companies.title': { en: 'Tech Organizations & Publishers', cn: '全球科技企业与官方组织' },
  'companies.subtitle': { en: 'Discover enterprise-grade skills, official prompt repositories, and production frameworks built by the world\'s leading technology teams. Filtered by ecosystem niche and technical domain.', cn: '探索由全球顶尖技术团队构建的生产级智能体工具、官方提示词库与工程框架。' },
  'companies.search_placeholder': { en: 'Search organizations or tech...', cn: '搜索组织或技术栈...' },
  'companies.domain.all': { en: 'All', cn: '全部领域' },
  'companies.domain.cloud': { en: 'Cloud & Infra', cn: '云与基础设施' },
  'companies.domain.ai': { en: 'AI & Models', cn: 'AI 与大模型' },
  'companies.domain.data': { en: 'Data & DBs', cn: '数据与数据库' },
  'companies.domain.security': { en: 'Security', cn: '安全与合规' },
  'companies.domain.devtools': { en: 'Dev Tools', cn: '开发工具与语言' },
  'companies.domain.creative': { en: 'UI & Creative', cn: 'UI 与创意设计' },
  'companies.domain.growth': { en: 'Growth & Content', cn: '增长与内容' },
  'companies.domain.biz': { en: 'Finance & Biz', cn: '商业与金融' },
  'companies.explore_portfolio': { en: 'Explore Portfolio', cn: '查看作品集' },
  'companies.no_orgs': { en: 'No organizations found', cn: '未找到匹配的组织' },
  'companies.no_orgs_hint': { en: 'Try searching with different technical keywords or resetting the domain filter.', cn: '尝试使用不同的技术关键词或重置领域筛选。' },

  // --- Contribute Page ---
  'contribute.form_title': { en: 'Submit Your Skill', cn: '提交您的技能' },
  'contribute.form_desc': { en: 'Paste your GitHub repository or specific skill folder URL. We will inspect and index it automatically.', cn: '粘贴您的 GitHub 仓库或 Skill 目录链接，系统将自动进行扫描与索引收录。' },
  'contribute.repo_label': { en: 'GitHub Repository or Folder URL', cn: 'GitHub 仓库或文件夹链接' },
  'contribute.contact_label': { en: 'Contact Email / Twitter (Optional)', cn: '联系方式 Email / Twitter (选填)' },
  'contribute.notes_label': { en: 'Target Category / Workflow (Optional)', cn: '目标分类 / 工作流说明 (选填)' },
  'contribute.submit_btn': { en: 'Submit Skill for Indexing', cn: '立即提交收录' },
  'contribute.submitting': { en: 'Submitting...', cn: '正在提交...' },

  // --- Footer ---
  'footer.discovery': { en: 'Discovery', cn: '技能发现' },
  'footer.developers': { en: 'Developers', cn: '开发者' },
  'footer.platform': { en: 'Platform', cn: '平台' },
  'footer.legal': { en: 'Legal', cn: '法律与合规' },
  'footer.explore_all': { en: 'Explore All Skills', cn: '探索全部技能' },
  'footer.organizations': { en: 'Organizations', cn: '大厂官方' },
  'footer.cli_tool': { en: 'Skills Search CLI', cn: 'Skills 搜索命令行' },
  'footer.about_support': { en: 'About & Support', cn: '关于与支持' },
  'footer.founder_twitter': { en: 'Founder Twitter / X', cn: '创始人 Twitter / X' },
  'footer.privacy_policy': { en: 'Privacy Policy', cn: '隐私政策' },
  'footer.terms_of_service': { en: 'Terms of Service', cn: '服务条款' },
  'footer.rights': { en: 'All rights reserved.', cn: '保留所有权利。' },
  'footer.operational': { en: 'System Operational', cn: '系统运行正常' },
  'footer.disclaimer': { en: 'skills.rest is an independent open directory. All product names, logos, and brands are property of their respective owners and are used for identification purposes only.', cn: 'skills.rest 是独立开放目录。所有产品名称、徽标和品牌均为其各自所有者的财产，仅用于识别目的。' },
  'footer.back_to_top': { en: 'Top', cn: '返回顶部' },

  // --- Category Names ---
  'category.content-communication': { en: 'Content & Communication', cn: '内容与传播' },
  'category.data-analytics': { en: 'Data & Analytics', cn: '数据与分析' },
  'category.design-creative': { en: 'Design & Creative', cn: '设计与创意' },
  'category.education-research': { en: 'Education & Research', cn: '教育与研究' },
  'category.finance-accounting': { en: 'Finance & Accounting', cn: '财务与会计' },
  'category.legal-compliance': { en: 'Legal & Compliance', cn: '法律与合规' },
  'category.marketing-sales': { en: 'Marketing & Sales', cn: '市场与销售' },
  'category.personal-entrepreneur': { en: 'Personal & Entrepreneur', cn: '个人与创业' },
  'category.product-management': { en: 'Product & Management', cn: '产品与管理' },
  'category.software-engineering': { en: 'Software Engineering', cn: '软件工程' },

  // --- Category Page Content ---
  'category.no_data': { en: 'No skills available in this category yet.', cn: '该分类下暂无收录技能。' },
  'category.return': { en: 'Back to Explore', cn: '返回探索页' },
  'category.seo.title_prefix': { en: 'Why Use Agent Skills for', cn: '为何使用智能体技能来实现' },
  'category.seo.title_suffix': { en: 'Workflows?', cn: '工作流自动化？' },
  'category.seo.p1_start': { en: 'Agent Skills designed for', cn: '专为' },
  'category.seo.p1_end': { en: 'professionals provide deterministic, reproducible automation that eliminates repetitive manual work.', cn: '专业人士设计的智能体技能提供确定性、可重现的自动化，彻底消除重复性手工操作。' },
  'category.seo.p2': { en: ' Whether you are building production workflows or exploring AI-assisted tooling, these vetted open-source skills integrate seamlessly with Claude Code, ChatGPT, and Cursor.', cn: '无论您是在构建生产工作流还是探索 AI 辅助工具，这些经过审核的开源技能都能与 Claude Code、ChatGPT 和 Cursor 无缝集成。' },

  // --- Category Descriptions ---
  'category.desc.content-communication': { en: 'Skills for writing, editing, and social media management.', cn: '用于写作、编辑和社交媒体管理的技能。' },
  'category.desc.data-analytics': { en: 'Tools for data processing, visualization, and analysis.', cn: '用于数据处理、可视化和分析的工具。' },
  'category.desc.design-creative': { en: 'Generate art, edit images, and brainstorm creative concepts.', cn: '生成艺术作品、编辑图像和构思创意概念。' },
  'category.desc.education-research': { en: 'Academic research, summarization, and learning aids.', cn: '学术研究、摘要和学习辅助工具。' },
  'category.desc.finance-accounting': { en: 'Financial modeling, bookkeeping, and market analysis.', cn: '财务建模、记账和市场分析。' },
  'category.desc.legal-compliance': { en: 'Contract review, regulatory checks, and legal research.', cn: '合同审查、监管检查和法律研究。' },
  'category.desc.marketing-sales': { en: 'SEO, email campaigns, and customer relationship tools.', cn: 'SEO、邮件营销和客户关系工具。' },
  'category.desc.personal-entrepreneur': { en: 'Productivity, organization, and startup resources.', cn: '生产力、组织和创业资源。' },
  'category.desc.product-management': { en: 'Roadmapping, user stories, and agile workflow skills.', cn: '路线图、用户故事和敏捷工作流技能。' },
  'category.desc.software-engineering': { en: 'Code generation, debugging, and documentation tools.', cn: '代码生成、调试和文档工具。' },

  // --- Complexity ---
  'complexity.Basic': { en: 'Basic', cn: '基础' },
  'complexity.Intermediate': { en: 'Intermediate', cn: '中等' },
  'complexity.Advanced': { en: 'Advanced', cn: '高级' },

  // --- Badges & General ---
  'skill.badge.official': { en: 'Official', cn: '官方认证' },
  'skill.badge.partner': { en: 'Partner', cn: '合作伙伴' },
  'skill.badge.community': { en: 'Community', cn: '社区贡献' },
  'skill.card.by': { en: 'by', cn: '作者：' },
  'skill.home': { en: 'Home', cn: '首页' },
  'grid.end_of_stream': { en: '// End of Stream //', cn: '// 已加载全部数据 //' },

  // --- Skill Detail & Install Protocol ---
  'skill.install_protocol': { en: 'Installation Command', cn: '安装指令与配置' },
  'skill.tab_npx': { en: 'npx CLI Command', cn: 'npx 命令行安装' },
  'skill.tab_prompt': { en: 'Structured Prompt', cn: '结构化提示词' },
  'skill.copied_success': { en: '✓ Copied to Clipboard!', cn: '✓ 已复制到剪贴板！' },
  'skill.copy_npx': { en: 'Copy npx Command', cn: '复制 npx 安装指令' },
  'skill.copy_prompt': { en: 'Copy Prompt Instruction', cn: '复制 Prompt 指令' },
  'skill.explore_author': { en: 'Explore all skills by this author →', cn: '查看该作者发布的全部技能 →' },
  'skill.search_tags': { en: 'Search Tags:', cn: '搜索标签：' },
  'skill.agent_helper_title': { en: 'Agent Search Skill', cn: 'Agent 技能发现工具' },
  'skill.system_docs_title': { en: 'SYSTEM DOCUMENTATION & REQUIREMENTS', cn: '系统文档与运行规范' },
  'skill.faq_title': { en: 'Frequently Asked Questions about', cn: '常见问题解答：' },
  'skill.related_title': { en: 'Related Skills', cn: '相关技能推荐' },

  // --- Agent Connect Button ---
  'agent.connect_btn': { en: 'Connect Agent', cn: '连接 Agent' },
  'agent.select_title': { en: 'Select your AI Agent', cn: '选择您的 AI 智能体' },
  'agent.copied_prefix': { en: 'Copied for', cn: '已复制适用配置：' },

  // --- Contribute Guidelines ---
  'contribute.title': { en: 'Contribute an Agent Skill', cn: '提交智能体技能' },
  'contribute.subtitle': { en: 'Join the open ecosystem. Submit your GitHub repository URL to index your tools across {count}+ developer agent workflows.', cn: '加入开放生态。提交您的 GitHub 仓库链接，让您的工具被 {count}+ 开发者的智能体工作流索引。' },
  'contribute.guidelines_title': { en: 'Submission Guidelines & Formats', cn: '技能收录标准与规范' },
  'contribute.guide_1_title': { en: '1. SKILL.md Standard', cn: '1. SKILL.md 标准规范' },
  'contribute.guide_1_desc': { en: 'Your folder must contain a valid SKILL.md with standard frontmatter (name, description, tags).', cn: '您的代码目录必须包含带有标准 YAML Frontmatter 的 SKILL.md。' },
  'contribute.guide_2_title': { en: '2. Security Audit', cn: '2. 安全合规审计' },
  'contribute.guide_2_desc': { en: 'Skills must not contain obfuscated scripts, token loggers, or unauthorized network exfiltration.', cn: '技能严禁包含混淆代码、Token 窃取脚本或未经授权的外部网络外发行为。' },
  'contribute.guide_3_title': { en: '3. Fast Ingestion', cn: '3. 极速自动化索引' },
  'contribute.guide_3_desc': { en: 'Submissions are automatically screened and indexed within 24 hours of form submission.', cn: '提交后，自动化审计流水线将在 24 小时内完成扫描并收录上线。' },

  // --- Repository Suite Page ---
  'repo.install_all': { en: 'Install All', cn: '安装全部' },
  'repo.install_partial': { en: 'Install Partial', cn: '自选安装' },
  'repo.copy': { en: 'Copy', cn: '复制' },
  'repo.copied': { en: '✓ Copied', cn: '✓ 已复制' },
  'repo.all_skills_title': { en: 'All Skills in This Repository', cn: '本仓库包含的所有技能' },
  'repo.related_title': { en: 'Related Repositories in', cn: '同分类推荐仓库：' },

  // --- Best Skills Hub Page ---
  'best_skills.meta_title': { en: 'Best Skills — ChatGPT & Claude Agent Skills (2026) | skills.rest', cn: '精选最佳技能 — 适用于 ChatGPT 与 Claude 的智能体技能库 | skills.rest' },
  'best_skills.meta_desc': { en: 'Discover the best skills for ChatGPT, Claude & Gemini. Top-starred, market-validated repositories across 10 specialized workflow domains. Free one-click install.', cn: '发现适用于 ChatGPT、Claude 与 Gemini 的精选最佳技能与开源代码仓库。覆盖 10 大专业领域、经过市场验证的高星标开源工具库。' },
  'best_skills.hero_title': { en: 'Best Skills for AI Agents', cn: '精选最佳 AI 智能体技能' },
  'best_skills.hero_subtitle': { en: 'The curated collection of the best skills for ChatGPT and Claude. Discover, install, and execute verified open-source agent tools across 10 core workflow domains.', cn: '专为 ChatGPT 和 Claude 精选的最佳技能库。一键发现、安装并执行覆盖 10 大核心工作流的开源智能体工具。' },
  'best_skills.overall_title': { en: 'Best Skills Overall', cn: '全网综合最佳技能' },
  'best_skills.overall_subtitle': { en: 'Top-Starred by Community', cn: '开源社区星标最高' },
  'best_skills.shelf_prefix': { en: 'Best Skills for', cn: '精选最佳' },
  'best_skills.explore_all_category': { en: 'Explore All {category} Skills →', cn: '查看全部 {category} 技能 →' },
  'best_skills.faq_title': { en: 'Frequently Asked Questions', cn: '常见问题解答' },
  'best_skills.faq.q1': { en: 'What are the best skills for ChatGPT and Claude?', cn: '什么是适用于 ChatGPT 与 Claude 的最佳技能？' },
  'best_skills.faq.a1': { en: 'The best skills for ChatGPT and Claude are standardized instruction packages that teach AI agents deterministic workflows like test-driven development, code reviews, and automated marketing.', cn: '适用于 ChatGPT 与 Claude 的最佳技能是标准化的指令包，旨在教会 AI 智能体执行测试驱动开发、代码审查、自动化营销等确定性工作流。' },
  'best_skills.faq.q2': { en: 'How to install the best skills for AI agents?', cn: '如何为 AI 智能体安装这些最佳技能？' },
  'best_skills.faq.a2': { en: 'Run npx skills add <owner>/<repo> --all -g -y in your terminal to batch-install any complete collection of best skills directly into your local agent environment.', cn: '在终端运行 npx skills add <owner>/<repo> --all -g -y 即可将完整的最佳技能库直接批量安装到本地智能体环境中。' },
  'best_skills.faq.q3': { en: 'Do these skills work across different AI agents?', cn: '这些技能可以在不同的 AI 智能体之间通用吗？' },
  'best_skills.faq.a3': { en: 'Yes. All indexed tools use the open SKILL.md specification and run seamlessly across ChatGPT, Claude Code, Cursor, and Codex.', cn: '是的。所有收录的工具均遵循开放的 SKILL.md 规范，可以在 ChatGPT、Claude Code、Cursor 和 Codex 之间无缝运行。' },
};

export const t = (key: string, lang: string = 'en'): string => {
  const language = (lang === 'cn' ? 'cn' : 'en') as Language;

  if (!dictionary[key]) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key: ${key}`);
    }
    return key;
  }

  return dictionary[key][language];
};
