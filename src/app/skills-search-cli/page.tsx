import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import SkillsSearchCliView from '@/components/client/SkillsSearchCliView';
import { getSkillsMaxId } from '@/lib/db';

export const runtime = 'edge';
export const revalidate = 604800; // 缓存 7 天

const BASE_URL = 'https://skills.rest';
const CANONICAL_URL = `${BASE_URL}/skills-search-cli`;

export async function generateMetadata(): Promise<Metadata> {
  const totalSkillsRaw = await getSkillsMaxId();
  const thousands = Math.floor(totalSkillsRaw / 1000);
  const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();

  const title = `Skills Search CLI — Autonomous Skill Discovery for AI Agents | skills.rest`;
  const description = `Equip Claude Code, Codex, Cursor, and any AI agent to autonomously search and install across ${formattedCount}+ verified Agent Skills on demand.`;

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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Skills Search CLI' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function SkillsSearchCliPage() {
  const totalSkills = await getSkillsMaxId();
  const thousands = Math.floor(totalSkills / 1000);
  const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000+` : `${totalSkills}+`;

  // 构造标准 Google 知识图谱 (@graph)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Skills Search CLI', item: CANONICAL_URL },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Skills Search CLI',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        description: `Universal autonomous skill discovery protocol for AI agents to query and install ${formattedCount} verified skills.`,
        url: CANONICAL_URL,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 py-12 selection:bg-blue-500/20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-10">

          {/* 面包屑导航 */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">Skills Search CLI</span>
          </nav>

          {/* 客户端交互主体 */}
          <SkillsSearchCliView formattedCount={formattedCount} />

        </div>
      </div>
    </>
  );
}
