'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RepositorySuite, Skill, Category, GuideItem } from '@/types';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

interface Props {
  repo: RepositorySuite;
  skills: Skill[];
  currentCategory: Category;
  relatedRepos: RepositorySuite[];
  availableGuides: GuideItem[];
  faqs: Array<{ question: string; answer: string }>;
  authorAvatar: string;
}

const PKG_MANAGERS = [
  { id: 'npx', label: 'npx', cmd: 'npx' },
  { id: 'pnpm', label: 'pnpm', cmd: 'pnpm dlx' },
  { id: 'bunx', label: 'bunx', cmd: 'bunx' },
] as const;

export default function RepoSuiteClientView({
  repo,
  skills,
  currentCategory,
  relatedRepos,
  availableGuides,
  faqs,
  authorAvatar,
}: Props) {
  const { language } = useTheme();
  const [selectedPkg, setSelectedPkg] = useState<string>('npx');
  const [mode, setMode] = useState<'all' | 'custom'>('all');
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(
    new Set(skills.slice(0, Math.min(skills.length, 2)).map((s) => s.slug))
  );
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 🌟 纯内存展开：初始 12 个，超出支持一键展开，0 网络请求
  const [visibleCount, setVisibleCount] = useState(12);
  const visibleSkills = skills.slice(0, visibleCount);

  // 获取当前生效的包管理器执行前缀 (如 'pnpm dlx')
  const activePkgCmd = PKG_MANAGERS.find((p) => p.id === selectedPkg)?.cmd || 'npx';

  // 动态组装终端指令
  const repoPath = `${repo.owner}/${repo.name}`;
  const assembledCommand =
    mode === 'all'
      ? `${activePkgCmd} skills add ${repoPath} --all -g -y`
      : `${activePkgCmd} skills add ${repoPath} ${Array.from(selectedSlugs).map((s) => `--skill ${s}`).join(' ')} -g -y`;

  const toggleSkill = (slug: string) => {
    if (mode === 'all') setMode('custom');
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(assembledCommand);
    setCopied(true);
    setToastMsg('Command copied! Paste it into your terminal to install the selected skills.');
    setTimeout(() => {
      setCopied(false);
      setMode('all'); // 恢复默认模式，悬浮栏消失
    }, 2000);
    setTimeout(() => setToastMsg(null), 5000); // 提示信息持续 5 秒
  };

  const copyGuidePrompt = (guide: GuideItem) => {
    const rawCleanPath = guide.relative_path.replace(/^\.\//, '');
    const guideUrl = `https://github.com/${repo.owner}/${repo.name}/blob/HEAD/${rawCleanPath}`;

    const promptText = `Please help me configure this repository orchestration guide file (${guide.file_name}) for my Agent environment.

Guide Source URL: ${guideUrl}
Target Installation Path: ${guide.relative_path}

INSTRUCTIONS FOR THE AGENT:
1. Inspect the content of ${guide.file_name} from the URL above.
2. Check if a ${guide.file_name} file already exists in my local project root (${guide.relative_path}).
3. CRITICAL SAFETY RULE: If ${guide.file_name} already exists locally, DO NOT overwrite or modify it directly. You must explicitly report the differences, explain the potential impacts of applying the new instructions, and ask for my confirmation.
4. Only when I explicitly confirm (or if the file does not exist), save the content to ${guide.relative_path} and report the active orchestration rules.`;

    navigator.clipboard.writeText(promptText);
    setToastMsg(`Copied install prompt for ${guide.file_name}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        
        {/* 1. 面包屑导航 */}
        <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
          <Link href={`/category/${currentCategory.slug}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">{currentCategory.name}</Link>
          <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
          <Link href={`/company/${encodeURIComponent(repo.owner.toLowerCase())}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">{repo.owner}</Link>
          <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">{repo.name}</span>
        </nav>

        {/* 2. 仓库 Hero 卡片 */}
        <section className="bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 左侧 7 列 */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <Link href={`/company/${encodeURIComponent(repo.owner.toLowerCase())}`} className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img src={authorAvatar} alt={repo.owner} width={24} height={24} className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 object-cover" />
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{repo.owner}</span>
                </Link>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono border ${repo.author_type === 'Official' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                  {repo.author_type}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{skills.length} Agent Skills Included</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  {repo.name}
                </h1>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {repo.tagline}
                </p>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2.5 font-light pt-1 whitespace-pre-line">
                {repo.description}
              </div>
            </div>

            {/* 右侧 5 列 */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Star & Fork 权威指标 */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-2xl text-xs font-mono">
                <div className="flex items-center gap-4">
                  <a href={`https://github.com/${repo.owner}/${repo.name}/stargazers`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-400" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                    <span>{repo.stars.toLocaleString()}</span>
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <a href={`https://github.com/${repo.owner}/${repo.name}/forks`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5 text-slate-500 fill-current" viewBox="0 0 16 16"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm.75-2.122v-.878A2.25 2.25 0 0 0 8 7.5a2.25 2.25 0 0 0-1.5 2.25v.878a2.25 2.25 0 1 0 1.5 0v-.878a.75.75 0 0 1 .75-.75.75.75 0 0 1 .75.75v.878a2.25 2.25 0 1 0 1.5 0Z"></path></svg>
                    <span>{repo.forks.toLocaleString()}</span>
                  </a>
                </div>
                <a href={repo.repo_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 text-sm font-semibold transition-colors" title="Open in GitHub">↗</a>
              </div>

              {/* 窄长安装器 (npx / pnpm / bunx) */}
              <div className="bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3 shadow-xs font-mono">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px]">
                    {PKG_MANAGERS.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg.id)}
                        className={`px-2.5 py-0.5 rounded-md transition-all ${selectedPkg === pkg.id ? 'font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        {pkg.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px]">
                    <button onClick={() => setMode('all')} className={`px-2.5 py-0.5 rounded-md transition-all ${mode === 'all' ? 'font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}>
                      {t('repo.install_all', language)}
                    </button>
                    <button onClick={() => setMode('custom')} className={`px-2.5 py-0.5 rounded-md transition-all ${mode === 'custom' ? 'font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}>
                      {t('repo.install_partial', language)} ({selectedSlugs.size})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-[11px] font-mono text-emerald-400 whitespace-nowrap overflow-x-auto shadow-inner">
                    {assembledCommand}
                  </div>
                  <button onClick={copyCommand} type="button" className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs rounded-xl shadow-xs transition-all shrink-0">
                    {copied ? t('repo.copied', language) : t('repo.copy', language)}
                  </button>
                </div>
              </div>

              {/* Available 引导 (仅在存在指引文件时展示) */}
              {availableGuides.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 space-y-2.5 font-mono shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Available:</span>
                    <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px]">
                      {availableGuides.map((g, idx) => (
                        <button
                          key={g.file_name}
                          onClick={() => setActiveGuideIndex(idx)}
                          className={`px-2 py-0.5 rounded-md transition-all ${activeGuideIndex === idx ? 'font-bold bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                          {g.file_name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => copyGuidePrompt(availableGuides[activeGuideIndex])}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition-all shadow-xs shrink-0"
                    >
                      Copy install prompt to agent
                    </button>
                  </div>
                  {repo.guide_summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans font-light leading-relaxed">
                      {repo.guide_summary}
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* 3. 所含 Skill 列表 (自选模式带勾选，无 Star 占位，全绿信号) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
              {t('repo.all_skills_title', language)} ({skills.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">Pure Emerald Level Indicators</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSkills.map((skill) => {
              const isSelected = selectedSlugs.has(skill.slug);

              const SkillInnerContent = (
                <div
                  className={`relative h-full flex flex-col justify-between bg-white dark:bg-[#0B1121] rounded-2xl p-5 transition-all select-none border ${
                    mode === 'custom' && isSelected
                      ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.01]'
                      : 'border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="absolute top-4 right-4 z-10">
                    {mode === 'all' ? (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-white/5">
                        📦 In Repo
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold transition-colors ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                      }`}>
                        {isSelected ? '✓ Selected' : '+ Select'}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 min-w-0 mb-3 pr-20">
                      <img src={authorAvatar} className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/10 object-cover" alt={repo.owner} />
                      <span className="text-xs font-mono text-slate-500 truncate">{repo.owner}</span>
                    </div>

                    <div className="space-y-1.5 mb-5 flex-grow">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-light">
                        {skill.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {skill.author_type}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 mr-1">{skill.complexity}</span>
                      <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
                      <span className={`w-2 h-1.5 rounded-sm ${skill.complexity !== 'Basic' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></span>
                      <span className={`w-2 h-1.5 rounded-sm ${skill.complexity === 'Advanced' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></span>
                    </div>
                  </div>
                </div>
              );

              // 🌟 默认模式是原生 Link 直跳详情页；自选模式才作为勾选交互
              return mode === 'all' ? (
                <Link
                  key={skill.id}
                  href={`/skill/${encodeURIComponent(skill.slug)}`}
                  className="group block h-full select-none"
                >
                  {SkillInnerContent}
                </Link>
              ) : (
                <div
                  key={skill.id}
                  onClick={() => toggleSkill(skill.slug)}
                  className="cursor-pointer h-full select-none"
                >
                  {SkillInnerContent}
                </div>
              );
            })}
          </div>

          {/* 🌟 纯内存展开按钮：点击仅展开本地数组，发 0 次网络请求 */}
          {visibleCount < skills.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount(skills.length)}
                className="px-6 py-2 rounded-xl bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold hover:bg-slate-50 transition-all"
              >
                Show All {skills.length} Skills in this Repository
              </button>
            </div>
          )}
        </section>

        {/* 4. 专属 FAQ */}
        {faqs.length > 0 && (
          <section className="bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                Frequently Asked Questions
              </h2>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20 font-semibold">
                FAQPage Schema
              </span>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group border-b border-slate-100 dark:border-white/5 pb-3.5 last:border-none" {...(idx === 0 ? { open: true } : {})}>
                  <summary className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer list-none">
                    <span className="group-hover:text-blue-600 transition-colors">{faq.question}</span>
                    <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 font-light">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 5. 相关仓库推荐 */}
        {relatedRepos.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                {t('repo.related_title', language)} {currentCategory.name}
              </h2>
              <Link href={`/category/${currentCategory.slug}`} className="text-xs font-mono text-blue-600 hover:underline font-semibold flex items-center gap-1">
                <span>View All in {currentCategory.name}</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRepos.map((rel) => (
                <Link key={rel.id} href={`/repo/${encodeURIComponent(rel.owner)}/${encodeURIComponent(rel.name)}`} className="group block h-full select-none">
                  <div className="relative h-full flex flex-col bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 transition-all hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={`https://avatars.githubusercontent.com/${encodeURIComponent(rel.owner)}?s=40`} className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/10" alt={rel.owner} />
                        <span className="text-xs font-mono text-slate-500 truncate group-hover:text-blue-600 transition-colors">{rel.owner}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-xs font-mono shrink-0">
                        <svg className="w-3 h-3 text-amber-500 fill-amber-400" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                        <span>{rel.stars >= 1000 ? `${(rel.stars / 1000).toFixed(1)}k` : rel.stars}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-5 flex-grow">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{rel.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{rel.tagline}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">{rel.author_type}</span>
                      <span className="text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">📦 {rel.skills_count} Skills</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* 🌟 自选模式专属吸附悬浮栏 (自适应状态提醒，告别原生弹窗) */}
      {mode === 'custom' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 dark:bg-[#0B1121]/95 text-white border border-slate-700 dark:border-white/10 shadow-2xl backdrop-blur-md font-mono text-xs">

            {/* 左侧：根据选择数量智能切换提示 */}
            <div className="flex items-center gap-2.5 min-w-0">
              {selectedSlugs.size > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                  <div className="truncate">
                    <span className="font-bold text-blue-400">{selectedSlugs.size}</span>
                    <span className="text-slate-300"> of {skills.length} skills selected</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0"></span>
                  <span className="text-amber-400 font-medium truncate">
                    ⚠️ Select at least 1 skill to generate command
                  </span>
                </>
              )}
            </div>

            {/* 右侧：操作按钮组 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMode('all')}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                Reset to All
              </button>

              <button
                type="button"
                onClick={copyCommand}
                disabled={selectedSlugs.size === 0}
                className={`px-4 py-1.5 font-bold rounded-lg shadow-sm transition-all ${
                  selectedSlugs.size === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                    : copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Command'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 浮动 Toast 成功提示 */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white border border-slate-700 px-4 py-3.5 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 z-50">
          <span className="text-emerald-400 text-lg">✓</span>
          <div>
            <div className="font-bold text-emerald-400">{toastMsg}</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-sans">👉 <strong>Next Step:</strong> Paste into your Agent chat to configure automatically.</div>
          </div>
        </div>
      )}
    </div>
  );
}