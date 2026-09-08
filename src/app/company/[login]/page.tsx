import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAuthorByLogin,
  getAuthorSkills,
  getAuthorSkillsCount,
  getAuthorRepositories,
} from '@/lib/db';
import AuthorStructuredData from '@/components/AuthorStructuredData';
import AuthorPageContent from '@/components/client/AuthorPageContent';
import CapabilityChart from '@/components/client/CapabilityChart';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 604800;

interface PageProps {
  params: Promise<{ login: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { login } = await params;
  const author = await getAuthorByLogin(login);

  if (!author) {
    return {
      title: '404 - Author Not Found | skills.rest',
      description: 'The requested author or organization could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const skillsCount = await getAuthorSkillsCount(author.login);
  const displayName = author.name || author.login;
  const canonicalUrl = `https://skills.rest/company/${encodeURIComponent(author.login.toLowerCase())}`;
  const authorDesc = author.headline || author.bio;

  return {
    title: `${displayName} — ${skillsCount.toLocaleString()} Agent Skills | skills.rest`,
    description: authorDesc
      ? `${authorDesc} Browse ${skillsCount} verified Agent Skills published by ${displayName} on skills.rest.`
      : `Browse ${skillsCount} verified Agent Skills published by ${displayName} for ChatGPT, Claude, and Codex.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${displayName} — Agent Skills Portfolio`,
      description: `Explore ${skillsCount} verified Agent Skills published by ${displayName}.`,
      type: 'profile',
      url: canonicalUrl,
      images: author.avatar_url ? [{ url: author.avatar_url, width: 400, height: 400, alt: displayName }] : [{ url: '/og-image.png', width: 1200, height: 630, alt: displayName }],
    },
    twitter: {
      card: 'summary',
      title: `${displayName} — Agent Skills Portfolio`,
      description: `Explore ${skillsCount} verified Agent Skills published by ${displayName}.`,
      images: author.avatar_url ? [author.avatar_url] : ['/og-image.png'],
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const language = 'en';
  const { login } = await params;
  const author = await getAuthorByLogin(login);

  if (!author) {
    notFound();
  }

  // 并行拉取数据 (首屏前 24 条极速出流，后续由客户端安全加载)
  const [skillsCount, skills, repositories] = await Promise.all([
    getAuthorSkillsCount(author.login),
    getAuthorSkills(author.login, 24, 0),
    getAuthorRepositories(author.login),
  ]);

  const displayName = author.name || author.login;
  const avatarUrl =
    author.avatar_url ||
    `https://avatars.githubusercontent.com/${encodeURIComponent(author.login)}?s=160`;

  return (
    <>
      <AuthorStructuredData author={author} skillsCount={skillsCount} />

      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
          {/* 面包屑导航 */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('skill.home', language)}</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
            <Link href="/companies" className="hover:text-slate-900 dark:hover:text-white transition-colors">Organizations</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">{displayName}</span>
          </nav>

          {/* 顶部作者档案卡片 (左右分栏，3大指标置于名下，无数据时不渲染右侧) */}
          {(() => {
            const breakdown = author.capability_breakdown;
            // 🚨 严谨检测：确保对象内至少有一个百分比大于 0，否则干掉右侧避免留白
            const hasDistribution = Boolean(
              breakdown &&
              typeof breakdown === 'object' &&
              Object.values(breakdown).some(v => Number(v) > 0)
            );

            return (
              <section className="bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm dark:shadow-xl transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                  {/* ===== 左侧: 作者主信息 + 3 大指标数据 ===== */}
                  <div className={`${hasDistribution ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col sm:flex-row items-start gap-5 min-w-0`}>
                    <img
                      src={avatarUrl}
                      alt={`${displayName} avatar`}
                      width={88}
                      height={88}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border border-slate-200 dark:border-white/10 object-cover bg-slate-100 dark:bg-slate-900 shrink-0 shadow-xs"
                      loading="lazy"
                    />

                    <div className="space-y-3.5 min-w-0 flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {displayName}
                        </h1>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${
                            author.author_type === 'Official'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                              : author.author_type === 'Partner'
                              ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {author.author_type}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        @{author.login}
                        {author.location && <span className="text-slate-300 dark:text-slate-700"> · {author.location}</span>}
                      </p>

                      {/* 🌟 3 大核心指标数据 (强制使用 en-US 防控服务端与客户端不同语言导致的 React Mismatch 报错) */}
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-2 border-y border-slate-100 dark:border-white/5 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{author.followers.toLocaleString('en-US')}</span>
                          <span className="text-slate-500 text-[11px]">{t('author.followers', language)}</span>
                        </div>
                        <span className="text-slate-200 dark:text-slate-800">|</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{author.public_repos.toLocaleString('en-US')}</span>
                          <span className="text-slate-500 text-[11px]">{t('author.public_repos', language)}</span>
                        </div>
                        <span className="text-slate-200 dark:text-slate-800">|</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{skillsCount.toLocaleString('en-US')}</span>
                          <span className="text-blue-600/70 dark:text-blue-400/70 text-[11px] font-semibold">{t('author.published_skills', language)}</span>
                        </div>
                      </div>

                      {(author.bio || author.headline) && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-3">
                          {author.bio || author.headline}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                        <a href={`https://github.com/${encodeURIComponent(author.login)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-colors flex items-center gap-1.5">
                          🐙 <span>GitHub</span> ↗
                        </a>
                        {author.website && (
                          <a href={author.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-colors flex items-center gap-1.5">
                            🌐 <span>Website</span> ↗
                          </a>
                        )}
                        {author.twitter && (
                          <a href={`https://x.com/${String(author.twitter).replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-colors flex items-center gap-1.5">
                            🐤 <span>@{String(author.twitter).replace(/^@/, '')}</span> ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== 右侧: 仅在有数据时渲染技能分布 ===== */}
                  {hasDistribution && (
                    <div className="lg:col-span-5 w-full">
                      <CapabilityChart
                        breakdown={breakdown}
                        primaryDomain={author.primary_domain}
                      />
                    </div>
                  )}

                </div>
              </section>
            );
          })()}

          {/* 交互主体 */}
          <AuthorPageContent
            author={author}
            initialSkills={skills}
            repositories={repositories}
            totalSkillsCount={skillsCount}
          />
        </div>
      </div>
    </>
  );
}
