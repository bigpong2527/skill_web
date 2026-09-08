import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getSkillBySlug,
  getSkillCategories,
  getSkillKeywords,
  getSkillsMaxId,
  getRelatedSkills,
} from '@/lib/db';
import { safeParseJsonArray } from '@/lib/utils';
import MarkdownView from '@/components/server/MarkdownView';
import StructuredData from '@/components/StructuredData';
import SkillInstallBlock from '@/components/client/SkillInstallBlock';
import SkillCard from '@/components/client/SkillCard';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 31536000; // 365天 (1年超长缓存，彻底冰封 66.5 万个详情页)

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface FAQ {
  question: string;
  answer: string;
}

function parseRelatedIds(value: string | null | undefined): number[] {
  if (!value) return [];
  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => Number.parseInt(item.trim(), 10))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  ).slice(0, 4);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr || dateStr === 'NULL') return '';
  try {
    // 关键优化：兼容 SQLite 带空格的 datetime
    const d = new Date(dateStr.replace(' ', 'T'));
    if (d.getFullYear() > 1970) {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return '';
  } catch {
    return '';
  }
}

function formatCount(num: number | null | undefined): string {
  if (!num || num <= 0) return '0';
  if (num >= 100000) return `${(num / 1000).toFixed(0)}k`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return {
      title: '404 - Skill Not Found | skills.rest',
      description: 'The requested skill could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const statement = skill.tagline?.replace(/\.$/, '') || `A powerful skill for ${skill.name}`;
  const baseUrl = 'https://skills.rest';
  const canonical = `${baseUrl}/skill/${encodeURIComponent(skill.slug)}`;

  return {
    title: `${skill.name}: ${statement} | skills.rest`,
    description: `${skill.tagline} Browse installation instructions, technical dependencies, and related skills by ${skill.author_name}.`,
    alternates: { canonical },
    openGraph: {
      title: `${skill.name}: ${statement}`,
      description: skill.tagline,
      type: 'website',
      url: canonical,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: skill.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.name}: ${statement}`,
      description: skill.tagline,
      images: ['/og-image.png'],
    },
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const [categories, keywords, totalSkills] = await Promise.all([
    getSkillCategories(skill.id),
    getSkillKeywords(skill.id),
    getSkillsMaxId(),
  ]);

  const faqs = safeParseJsonArray<FAQ>(skill.faq_json);
  const dependencies = safeParseJsonArray<string>(skill.dependencies);
  const components = safeParseJsonArray<string>(skill.components);

  const relatedIds = parseRelatedIds(skill.related_ids);
  const relatedSkills = await getRelatedSkills(relatedIds);

  const authorAvatarUrl =
    skill.author_avatar ||
    `https://avatars.githubusercontent.com/${encodeURIComponent(skill.author_name)}?s=100`;

  const starsCount = skill.stars || 0;
  const forksCount = skill.forks || 0;
  const repoDateFormatted = formatDate(skill.repo_created_at || skill.updated_at);
  const hasGitHubStats = starsCount > 0 || forksCount > 0 || Boolean(repoDateFormatted);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Official':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Partner':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const language = 'en'; // Server component, default to English

  return (
    <>
      <StructuredData skill={skill} categories={categories} faqs={faqs} />

      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* 1. 面包屑导航 */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('skill.home', language)}</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
            {categories[0] ? (
              <>
                <Link
                  href={`/category/${encodeURIComponent(categories[0].slug)}`}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {categories[0].name}
                </Link>
                <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
              </>
            ) : null}
            <span className="text-slate-900 dark:text-slate-200 font-medium">{skill.name}</span>
          </nav>

          {/* ============================================================
               2. 核心：Skill 深度名片 (左7列) vs 紧凑多包管理器安装器 (右5列)
               ============================================================ */}
          <article className="w-full bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm dark:shadow-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* ===== 左侧 7 列: 技能深度名片 ===== */}
              <div className="lg:col-span-7 space-y-5">

                {/* 作者 E-E-A-T + 官方认证外链 (无章鱼 Emoji，纯净矢量图标) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                  <Link
                    href={`/company/${encodeURIComponent(skill.author_name.toLowerCase())}`}
                    className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
                    title={`Explore all skills by ${skill.author_name}`}
                  >
                    <img
                      src={authorAvatarUrl}
                      alt={skill.author_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 object-cover bg-slate-100 dark:bg-slate-800"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.author_name}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border font-mono ${getBadgeColor(skill.author_type)}`}>
                          {skill.author_type === 'Official' ? 'OFFICIAL' : skill.author_type.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5 group-hover:underline">
                        {t('skill.explore_author', language)}
                      </span>
                    </div>
                  </Link>

                  {/* 🌟 优雅外链胶囊 (去除章鱼 🐙，改用精致 SVG 矢量图标) */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">Verified:</span>
                    {skill.author_website && (
                      <a href={skill.author_website} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors flex items-center gap-1.5" title="Official Website">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        <span>Website</span>
                      </a>
                    )}
                    {skill.author_twitter && (
                      <a href={`https://x.com/${skill.author_twitter.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors flex items-center gap-1.5" title="Twitter / X">
                        <span className="text-blue-400 font-bold">𝕏</span>
                        <span>@{skill.author_twitter.replace(/^@/, '')}</span>
                      </a>
                    )}
                    {skill.source_url && (
                      <a href={skill.source_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors flex items-center gap-1.5" title="GitHub Repository">
                        <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 fill-current" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" /></svg>
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 标题与 Tagline */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {skill.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                    {skill.tagline}
                  </p>
                </div>

                {/* 🌟 优雅重构的 GitHub 指标栏 (去除 emoji 黄星星与西餐刀叉 🍴) */}
                {hasGitHubStats && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-600 dark:text-slate-400">
                      {starsCount > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                          <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-400" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" /></svg>
                          <span>{formatCount(starsCount)}</span>
                        </span>
                      )}
                      {starsCount > 0 && forksCount > 0 && <span className="text-slate-300 dark:text-slate-700">|</span>}
                      {forksCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm.75-2.122v-.878A2.25 2.25 0 0 0 8 7.5a2.25 2.25 0 0 0-1.5 2.25v.878a2.25 2.25 0 1 0 1.5 0v-.878a.75.75 0 0 1 .75-.75.75.75 0 0 1 .75.75v.878a2.25 2.25 0 1 0 1.5 0Z" /></svg>
                          <span>{formatCount(forksCount)}</span>
                        </span>
                      )}
                      {(starsCount > 0 || forksCount > 0) && repoDateFormatted && <span className="text-slate-300 dark:text-slate-700">|</span>}
                      {repoDateFormatted && (
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>Updated {repoDateFormatted}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 搜索入口标签 (Tags) */}
                {keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] mr-1">{t('skill.search_tags', language)}</span>
                    {keywords.map((k) => (
                      <Link
                        key={k.id}
                        href={`/explore?q=${encodeURIComponent(k.name)}`}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-mono border border-blue-200/60 dark:border-blue-500/20 transition-colors"
                      >
                        #{k.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ===== 右侧 5 列: 紧凑三合一安装器 (不再拉长) ===== */}
              <div className="lg:col-span-5 w-full">
                <SkillInstallBlock skill={skill} />
              </div>

            </div>
          </article>

          {/* 3. 系统文档与 Markdown 正文 (全宽流畅阅读) */}
          <section className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-6">
                <h2 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
                  {t('skill.system_docs_title', language)}
                </h2>

                {/* 自然语言依赖说明 */}
                {(dependencies.length > 0 || components.length > 0) && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    💡 This Skill
                    {dependencies.length > 0 && (
                      <> requires <strong className="text-blue-700 dark:text-blue-400 font-mono">{dependencies.join(', ')}</strong></>
                    )}
                    {dependencies.length > 0 && components.length > 0 && ', and includes'}
                    {dependencies.length === 0 && components.length > 0 && ' includes'}
                    {components.length > 0 && (
                      <> <strong className="text-emerald-700 dark:text-emerald-400">{components.map((c) => `${c} (resource)`).join(' and ')}</strong> components</>
                    )}
                    .
                  </div>
                )}

                {/* Markdown 正文内容 */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                  <MarkdownView content={skill.description} />
                </div>
              </section>

          {/* 4. FAQ 问答手风琴 */}
          {faqs.length > 0 && (
            <section className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm dark:shadow-xl text-left">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                        Frequently Asked Questions about {skill.name}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-intent search queries and answers about installing and using this skill.</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-semibold shrink-0">
                      FAQPage Schema
                    </span>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq: FAQ, idx: number) => (
                      <details key={idx} className="group border-b border-slate-100 dark:border-white/5 pb-4 last:border-none [&_summary::-webkit-details-marker]:hidden" {...(idx === 0 ? { open: true } : {})}>
                        <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 cursor-pointer select-none list-none">
                          <span>{faq.question}</span>
                          <span className="ml-2 text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform duration-200">▼</span>
                        </summary>
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 dark:border-blue-500 font-light">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

          {/* 🌟 5. 底部相关技能推荐 (横向 4 列货架，在 FAQ 与页脚之间，复用公共 SkillCard) */}
          {relatedSkills.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500"></span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t('skill.related_title', language)}
                  </h2>
                </div>
                {categories[0] && (
                  <Link
                    href={`/category/${categories[0].slug}`}
                    className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Explore More {categories[0].name} Skills</span>
                    <span>&rarr;</span>
                  </Link>
                )}
              </div>

              {/* ✅ 一排 4 列标准技能卡片 (带 28px 大头像、⭐ 金色勋章与绿条等级) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedSkills.map((relSkill) => (
                  <SkillCard key={relSkill.id} skill={relSkill} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}