import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { query } from '@/lib/db';
import CompaniesDirectory from '@/components/client/CompaniesDirectory';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'Verified Organizations & Tech Leaders — Agent Skills Registry | skills.rest',
  description:
    'Explore technology leaders and official organizations publishing Skills.',
  alternates: { canonical: 'https://skills.rest/companies' },
  openGraph: {
    title: 'Verified Organizations & Tech Leaders | skills.rest',
    description: 'Explore technology leaders and official organizations publishing Skills.',
    url: 'https://skills.rest/companies',
    type: 'website',
  },
};

export default async function CompaniesDirectoryPage() {
  // ✅ 直接读取 authors 表的 skills_count 物理列（极速毫秒级响应）
  const results = await query(`
    SELECT
      login,
      name,
      avatar_url,
      public_repos,
      followers,
      website,
      headline,
      primary_domain,
      capability_breakdown,
      skills_count
    FROM authors
    WHERE author_type = 'Official'
      AND is_404 = 0
    ORDER BY skills_count DESC, public_repos DESC
  `);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] py-12 text-slate-900 dark:text-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-8 w-full">
        
        {/* 面包屑导航 */}
        <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Organizations</span>
        </nav>

        {/* 顶部标题与说明 */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-[11px] font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
            Enterprise Ecosystem Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('companies.title', 'en')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-normal">
            {t('companies.subtitle', 'en')}
          </p>
        </section>

        {/* 核心交互区 (8 大生态位切换 + 进度条渲染 + 实时搜索) */}
        <CompaniesDirectory organizations={results} />

      </div>
    </div>
  );
}