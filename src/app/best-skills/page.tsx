import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getFeaturedRepoSuites,
  getAllCategories,
  getTopRepoSuitesByCategory,
  getSkillsMaxId,
} from '@/lib/db';
import RepoCard from '@/components/client/RepoCard';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 604800; // 缓存 7 天

const BASE_URL = 'https://skills.rest';
const CANONICAL_URL = `${BASE_URL}/best-skills`;

export async function generateMetadata(): Promise<Metadata> {
  const language = 'en';
  const totalSkillsRaw = await getSkillsMaxId();
  const thousands = Math.floor(totalSkillsRaw / 1000);
  const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();

  const title = t('best_skills.meta_title', language);
  const description = `${formattedCount}+ AI agent skills for ChatGPT, Claude & Gemini. ${t('best_skills.meta_desc', language)}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: CANONICAL_URL },
    openGraph: {
      title,
      description,
      url: CANONICAL_URL,
      siteName: 'skills.rest',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Best AI Agent Skills' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function BestSkillsHubPage() {
  const language = 'en';

  const [featuredRepos, categories] = await Promise.all([
    getFeaturedRepoSuites(8),
    getAllCategories(),
  ]);

  // 并行拉取 10 大分类的预设/精选仓库 (0 全表扫描，精准走索引点查)
  const categoryReposPromises = categories.map((cat) => getTopRepoSuitesByCategory(cat.id, 8));
  const categoryReposArray = await Promise.all(categoryReposPromises);

  // 构造标准 Google JSON-LD 结构化数据树 (@graph)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Best Skills', item: CANONICAL_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Best AI Agent Skills & Repositories Directory',
        description: 'Comprehensive directory of the best open-source AI agent skills and repositories.',
        url: CANONICAL_URL,
        isPartOf: { '@type': 'WebSite', name: 'skills.rest', url: BASE_URL },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: t('best_skills.faq.q1', 'en'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('best_skills.faq.a1', 'en'),
            },
          },
          {
            '@type': 'Question',
            name: t('best_skills.faq.q2', 'en'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('best_skills.faq.a2', 'en'),
            },
          },
          {
            '@type': 'Question',
            name: t('best_skills.faq.q3', 'en'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('best_skills.faq.a3', 'en'),
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-slate-50 dark:bg-[#020617] py-10 flex-grow text-slate-900 dark:text-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-16 w-full">
          
          {/* 1. 面包屑导航 */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('skill.home', language)}</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">Best Skills</span>
          </nav>

          {/* 2. 页面 Hero (强力锁定 "Best Skills for AI Agents" 核心词) */}
          <section className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('best_skills.hero_title', language)}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
              {t('best_skills.hero_subtitle', language)}
            </p>
          </section>

          {/* 3. 货架 1: 全网综合 Top 8 最佳套件 */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌟</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('best_skills.overall_title', language)}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">{t('best_skills.overall_subtitle', language)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </section>

          {/* 4. 10 大专业领域纵向平铺货架流 */}
          <div className="space-y-16">
            {categories.map((cat, index) => {
              const catRepos = categoryReposArray[index];
              if (!catRepos || catRepos.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cat.icon}</span>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {t('best_skills.shelf_prefix', language)} {t(`category.${cat.slug}`, language)}
                      </h2>
                    </div>
                    <Link
                      href={`/category/${cat.slug}`}
                      title={`Best skills for ${t(`category.${cat.slug}`, language)}`}
                      className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{t('best_skills.explore_all_category', language).replace('{category}', t(`category.${cat.slug}`, language))}</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {catRepos.map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* 5. 严格精炼的 3 条核心 FAQ */}
          <section className="bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                {t('best_skills.faq_title', language)}
              </h2>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20 font-semibold">
                FAQPage Schema
              </span>
            </div>

            <div className="space-y-3">
              <details className="group border-b border-slate-100 dark:border-white/5 pb-3.5 last:border-none" open>
                <summary className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer list-none">
                  <span className="group-hover:text-blue-600 transition-colors">{t('best_skills.faq.q1', language)}</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 font-light">
                  {t('best_skills.faq.a1', language)}
                </p>
              </details>

              <details className="group border-b border-slate-100 dark:border-white/5 pb-3.5 last:border-none">
                <summary className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer list-none">
                  <span className="group-hover:text-blue-600 transition-colors">{t('best_skills.faq.q2', language)}</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 font-light">
                  {t('best_skills.faq.a2', language)}
                </p>
              </details>

              <details className="group border-b border-slate-100 dark:border-white/5 pb-3.5 last:border-none">
                <summary className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer list-none">
                  <span className="group-hover:text-blue-600 transition-colors">{t('best_skills.faq.q3', language)}</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 font-light">
                  {t('best_skills.faq.a3', language)}
                </p>
              </details>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}