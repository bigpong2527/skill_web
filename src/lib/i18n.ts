export type Language = 'en' | 'cn';

type Dictionary = {
  [key: string]: {
    en: string;
    cn: string;
  };
};

const dictionary: Dictionary = {
  // --- Header ---
  'nav.explore': { en: 'Explore', cn: '探索' },

  // --- Home Hero ---
  'home.hero.title': { en: 'Agent Skills Library', cn: '智能体技能库' },
  'home.hero.stats_suffix': { en: 'Skills Included', cn: '个已收录技能' },
  
  // ✅ [修改] 按钮文案：安装以连接
  'home.hero.btn.action': { en: 'Install to connect', cn: '安装以连接' },
  'home.hero.btn.value_suffix': { en: 'Skills', cn: '个技能' },
  
  // ✅ [保留] 复制成功反馈
  'home.hero.btn.copied.unix': { en: 'Bash Command Copied!', cn: 'Bash 指令已复制！' },
  'home.hero.btn.copied.windows': { en: 'PowerShell Copied!', cn: 'PowerShell 指令已复制！' },
  
  // ✅ 核心背书文案
  'home.hero.trust.safe': { en: 'Vetted & Safe', cn: '安全' },
  'home.hero.trust.light': { en: 'Zero Bloat', cn: '轻量' },
  'home.hero.trust.free': { en: '100% Free', cn: '免费' },

  // ✅ 粘贴指引
  'home.hero.instruction.paste.unix': { en: '👉 Paste into Terminal (Bash/Zsh)', cn: '👉 请粘贴到终端 (Terminal) 运行' },
  'home.hero.instruction.paste.windows': { en: '👉 Paste into PowerShell', cn: '👉 请粘贴到 PowerShell 运行' },

  'home.hero.search_placeholder': { en: "Search for 'data analysis', 'web scraping'...", cn: "搜索 '数据分析', '网页抓取'..." },
  'home.hero.search_btn': { en: 'Search', cn: '搜索' },
  'home.hero.suggested': { en: 'Suggested:', cn: '推荐:' },
  'home.sectors.title': { en: '// Protocol Sectors', cn: '// 协议领域' },
  'home.sectors.view_all': { en: 'VIEW_ALL_SECTORS', cn: '查看所有领域' },
  'home.trending.title': { en: 'Trending', cn: '热门趋势' },
  'home.trending.view_all': { en: 'VIEW_ALL', cn: '查看全部' },
  'home.fresh.title': { en: 'Recently Updated', cn: '最近更新' },

  // --- Explore ---
  'explore.sidebar.category': { en: 'Filter: Category', cn: '过滤: 分类' },
  'explore.sidebar.all_nodes': { en: 'All Skills', cn: '所有技能' },
  'explore.sidebar.origin': { en: 'Filter: Origin', cn: '过滤: 来源' },
  'explore.sidebar.complexity': { en: 'Filter: Complexity', cn: '过滤: 复杂度' },
  'explore.sidebar.verified': { en: 'OFFICIAL', cn: '官方认证' },
  'explore.sidebar.community': { en: 'Community', cn: '社区贡献' },
  'explore.title': { en: 'Skill Explorer', cn: '技能探索' },
  'explore.subtitle.search': { en: 'Searching protocol for', cn: '正在搜索协议' },
  'explore.subtitle.browse': { en: 'Browsing Sector:', cn: '浏览领域:' },
  'explore.subtitle.default': { en: 'Access the complete library of Agent Skills.', cn: '访问完整的 Claude 技能库。' },
  'explore.search_placeholder': { en: 'Filter skills...', cn: '筛选技能...' },
  'explore.signal_lost': { en: 'Signal Lost', cn: '信号丢失' },
  'explore.no_results': { en: 'No skills match your query parameters.', cn: '没有符合查询参数的技能。' },
  'explore.reset': { en: 'Reset Signal', cn: '重置信号' },

  // --- Install Guide ---
  'install.claude_code.title': { en: '💻 Claude Code Installation', cn: '💻 Claude Code 安装指南' },
  'install.claude_code.desc': { en: 'Recommended: Let Claude install automatically. Simply copy and paste the text below to Claude Code.', cn: '推荐：让 Claude 自动完成安装。只需将下方指令复制并粘贴到 Claude Code 终端即可。' },
  'install.manual.title': { en: '💬 Claude.ai Installation', cn: '💬 Claude.ai 网页版安装' },
  'install.manual.desc': { en: 'Follow these three steps to manually install this Skill:', cn: '请遵循以下三个步骤手动部署此技能：' },
  'install.step1.title': { en: 'Download Skill Package', cn: '下载技能包' },
  'install.step1.btn': { en: 'Download .zip file', cn: '下载 .zip 压缩文件' },
  'install.step2.title': { en: 'Extract and Upload', cn: '解压并上传' },
  'install.step2.desc': { en: 'Extract the .zip file and upload Skill files in your Claude.ai project settings.', cn: '解压 .zip 文件，并在 Claude.ai 的项目设置中上传技能文件。' },
  'install.step3.title': { en: 'Activate Skill', cn: '激活技能' },
  'install.step3.desc': { en: 'Activate this Skill in your project using the /skill command.', cn: '在对话框中使用 /skill 命令激活并调用此技能。' },
  'install.api.title': { en: '⚙️ API Usage', cn: '⚙️ API 调用集成' },
  'install.api.desc': { en: 'Reference this Skill when calling APIs in your code:', cn: '在代码中调用 Anthropic API 时引用此技能：' },
  'install.copy': { en: 'Copy', cn: '复制' },
  'install.copied': { en: '✓ Copied', cn: '✓ 已复制' },

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

  // --- Category Page ---
  'category.return': { en: 'Return to Main Library', cn: '返回主库' },
  'category.no_data': { en: 'No data found in this sector.', cn: '该领域未发现数据。' },

  // --- Categories Page ---
  'categories.title': { en: 'All Categories', cn: '全部分类' },
  'categories.subtitle': { en: 'Explore Agent Skills by professional domain and find the perfect AI tools for your work.', cn: '按专业领域探索 Claude 技能，发现适合您工作流的最佳 AI 自动化工具。' },

  // --- Category Detail SEO Block ---
  'category.seo.title_prefix': { en: 'Why use Agent Skills for', cn: '为什么要在' },
  'category.seo.title_suffix': { en: '?', cn: '领域使用 Claude 技能？' },
  'category.seo.p1_start': { en: 'Integrating specialized skills into your', cn: '将专业技能集成到您的' },
  'category.seo.p1_end': { en: 'workflow transforms Claude from a chatbot into a domain expert.', cn: '工作流中，能让 Claude 从普通聊天机器人进化为该领域的业务专家。' },
  'category.seo.p2': { en: 'Whether you need automation for tasks or advanced data processing, these verified tools ensure consistency and reliability in your enterprise environment.', cn: '无论是自动化日常任务还是处理复杂数据，这些经过验证的工具都能确保企业级环境下的输出一致性与可靠性。' },

  // --- Skill Detail ---
  'skill.author': { en: 'Author', cn: '作者' },
  'skill.version': { en: 'Version', cn: '版本' },
  'skill.installs': { en: 'Installs', cn: '安装量' },
  'skill.rating': { en: 'Rating', cn: '评分' },
  'skill.system_docs': { en: 'System Documentation', cn: '系统文档' },
  'skill.dependency_matrix': { en: 'Dependency Matrix', cn: '依赖矩阵' },
  'skill.required_modules': { en: 'Required Modules', cn: '所需模块' },
  'skill.none_required': { en: 'None required', cn: '无须依赖' },
  'skill.components': { en: 'Components', cn: '组件' },
  'skill.standard_pkg': { en: 'Standard package', cn: '标准包' },
  'skill.view_source': { en: 'View Source Repository', cn: '查看源代码库' },
  'skill.home': { en: 'Home', cn: '首页' },
  'skill.badge.official': { en: 'Official', cn: '官方认证' },
  'skill.badge.partner': { en: 'Partner', cn: '合作伙伴' },
  'skill.badge.community': { en: 'Community', cn: '社区贡献' },
  'skill.card.by': { en: 'by', cn: '作者：' },
  'grid.end_of_stream': { en: '// End of Stream //', cn: '// 已加载全部数据 //' },

  // --- Complexity ---
  'complexity.Basic': { en: 'No Config', cn: '无需配置' },
  'complexity.Intermediate': { en: 'Few Config', cn: '少量配置' },
  'complexity.Advanced': { en: 'Advanced', cn: '进阶' },

  // --- OpenClaw Page ---
  'openclaw.hero.eyebrow': { en: 'Skills Library for OpenClaw', cn: 'OpenClaw 技能库' },
  'openclaw.hero.subtitle1': { en: 'vetted skills, one command away.', cn: '个经过审核的技能，一条命令即可获取。' },
  'openclaw.hero.subtitle2': { en: 'The fastest way to make OpenClaw actually useful.', cn: '让你的 OpenClaw 真正发挥作用的最快方式。' },
  'openclaw.trust.title': { en: 'Safe. Precise. Always on.', cn: '安全、精准、随时可用' },
  'openclaw.trust.p1.title': { en: 'Two security reviews', cn: '双重安全审查' },
  'openclaw.trust.p1': { en: 'Every skill is security-reviewed twice before it reaches your agent.', cn: '每个技能上架前，均经过两轮安全审核。' },
  'openclaw.trust.p2.title': { en: 'Exact fit, zero bloat', cn: '精准匹配，零冗余' },
  'openclaw.trust.p2': { en: 'Returns only the skill package your agent actually needs.', cn: '只返回 Agent 真正需要的技能包，不多不少。' },
  'openclaw.trust.p3.title': { en: 'Always on standby', cn: '随叫随到' },
  'openclaw.trust.p3': { en: 'Responds in under a second — no waiting, no retries.', cn: '响应时间 <1 秒，不让 Agent 空等。' },
  'openclaw.stats.label.skills': { en: 'Skills', cn: '个技能' },
  'openclaw.stats.label.trusted': { en: 'Trusted by', cn: '已获信赖' },
  'openclaw.stats.value.trusted': { en: '12,000+', cn: '12,000+' },
  'openclaw.stats.label.response': { en: 'Response', cn: '响应时间' },
  'openclaw.stats.value.response': { en: '<1s', cn: '<1s' },
  'openclaw.stats.value.reviewed': { en: 'Reviewed', cn: '安全审查' },
  'openclaw.stats.label.reviewed': { en: 'Twice', cn: '两轮' },
  'openclaw.how.title': { en: 'How It Works', cn: '如何使用' },
  'openclaw.how.subtitle': { en: 'From zero to {count} skills in under a minute.', cn: '不到一分钟，从零到 {count} 个技能。' },
  'openclaw.step1.title': { en: 'Copy the command', cn: '复制命令' },
  'openclaw.step1.desc': { en: 'One click. The install command is copied to your clipboard — no sign-up, no config.', cn: '一键复制。安装命令即刻进入剪贴板——无需注册，无需配置。' },
  'openclaw.step2.title': { en: 'Paste into your terminal', cn: '粘贴到终端' },
  'openclaw.step2.desc': { en: 'Run it in Terminal (macOS/Linux) or PowerShell (Windows). Takes about 5 seconds.', cn: '在终端 (macOS/Linux) 或 PowerShell (Windows) 中运行，约 5 秒完成。' },
  'openclaw.step3.title': { en: 'Run refresh', cn: '执行刷新' },
  'openclaw.step3.desc': { en: '{count} skills are now on standby — ready the moment your agent needs one.', cn: '{count} 个技能随时待命，Agent 需要时即刻取用。' },
  'openclaw.before_after.before_label': { en: 'Before', cn: '以前' },
  'openclaw.before_after.before_text': { en: "Tokens burned finding tools. Tokens burned on setup. Tokens burned on retries. Work hasn't started.", cn: '找工具烧 token，装环境烧 token，出错重试再烧 token——活还没开始干。' },
  'openclaw.before_after.after_label': { en: 'After', cn: '现在' },
  'openclaw.before_after.after_text': { en: 'State your goal. Skill arrives. Done. Every token goes toward actual work.', cn: '说出需求，技能到位，直接完成。Token 只花在结果上。' },
  'openclaw.showcase.title': { en: 'What OpenClaw Can Do Now', cn: 'OpenClaw 现在能做什么' },
  'openclaw.showcase.subtitle': { en: "A taste of what's waiting inside the library.", cn: '技能库中精彩内容的一瞥。' },
  'openclaw.showcase.browse': { en: 'Browse all', cn: '浏览全部' },
  'openclaw.cta.title': { en: 'Ready to supercharge OpenClaw?', cn: '准备好为 OpenClaw 提速了吗？' },
  'openclaw.cta.desc': { en: "One command connects your agent to the world's largest vetted skills library. No account needed.", cn: '一条命令，将你的 Agent 接入全球最大的经审核技能库。无需账号。' },
  'openclaw.btn.os.unix': { en: 'macOS / Linux', cn: 'macOS / Linux' },
  'openclaw.btn.os.windows': { en: 'Windows', cn: 'Windows' },
  'openclaw.btn.action': { en: 'Install to OpenClaw', cn: '安装到 OpenClaw' },
  'openclaw.btn.value': { en: '1 command', cn: '一条命令' },
  'openclaw.btn.copied': { en: 'Copied for OpenClaw!', cn: '已复制 OpenClaw 指令！' },
  'openclaw.btn.paste.unix': { en: 'Paste into Terminal to connect OpenClaw', cn: '粘贴到终端以连接 OpenClaw' },
  'openclaw.btn.paste.windows': { en: 'Paste into PowerShell to connect OpenClaw', cn: '粘贴到 PowerShell 以连接 OpenClaw' },

  // --- Footer ---
  'footer.operational': { en: 'System Operational', cn: '系统运行中' },
  'footer.privacy': { en: 'Privacy_Protocol', cn: '隐私协议' },
  'footer.terms': { en: 'Terms_of_Use', cn: '使用条款' },
  'footer.contribute': { en: 'Contribute_Skill', cn: '贡献技能' },
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
