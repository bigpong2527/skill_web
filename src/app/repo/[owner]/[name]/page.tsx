import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getRepoSuiteByOwnerName,
  getSkillsByIds,
  getRelatedRepoSuites,
  getAllCategories,
  getAuthorByLogin,
} from '@/lib/db';
import { safeParseJsonArray } from '@/lib/utils';
import { GuideItem } from '@/types';
import RepoSuiteClientView from '@/components/client/RepoSuiteClientView';

export const runtime = 'edge';
export const revalidate = 604800; // 缓存 7 天

interface PageProps {
  params: Promise<{ owner: string; name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, name } = await params;
  const repo = await getRepoSuiteByOwnerName(owner, name);

  if (!repo) {
    return {
      title: '404 - Repository Not Found | skills.rest',
      description: 'The requested repository could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const canonical = `https://skills.rest/repo/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}`;

  return {
    title: `${repo.name} — Agent Skills Repository by ${repo.owner} | skills.rest`,
    description: `${repo.tagline}. Install all ${repo.skills_count} skills from this GitHub repository for Claude Code, ChatGPT, and Codex via npx skills add ${repo.owner}/${repo.name}.`,
    alternates: { canonical },
    openGraph: {
      title: `${repo.name} Repository (${repo.skills_count} Skills) | skills.rest`,
      description: repo.tagline,
      type: 'website',
      url: canonical,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: repo.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${repo.name} Repository by ${repo.owner}`,
      description: repo.tagline,
      images: ['/og-image.png'],
    },
  };
}

export default async function RepoSuitePage({ params }: PageProps) {
  const { owner, name } = await params;
  const repo = await getRepoSuiteByOwnerName(owner, name);

  if (!repo) {
    notFound();
  }

  // 并行拉取数据：子技能列表、分类信息、相关推荐仓库与作者档案 (全部走主键与索引点查)
  const [skills, categories, relatedRepos, author] = await Promise.all([
    getSkillsByIds(repo.skill_ids, 150),
    getAllCategories(),
    getRelatedRepoSuites(repo.primary_category_id, repo.id, 3),
    getAuthorByLogin(repo.owner),
  ]);

  const currentCategory = categories.find((c) => c.id === repo.primary_category_id) || categories[0];
  const availableGuides = safeParseJsonArray<GuideItem>(repo.available_guides);
  const faqs = safeParseJsonArray<{ question: string; answer: string }>(repo.faqs);

  // 构造标准 Google JSON-LD 结构化数据树 (@graph)
  const baseUrl = 'https://skills.rest';
  const pageUrl = `${baseUrl}/repo/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: currentCategory.name, item: `${baseUrl}/category/${currentCategory.slug}` },
          { '@type': 'ListItem', position: 3, name: repo.owner, item: `${baseUrl}/company/${encodeURIComponent(repo.owner.toLowerCase())}` },
          { '@type': 'ListItem', position: 4, name: repo.name, item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: `${repo.name} Repository`,
        description: repo.tagline,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        author: {
          '@type': repo.author_type === 'Official' ? 'Organization' : 'Person',
          name: author?.name || repo.owner,
          url: `${baseUrl}/company/${encodeURIComponent(repo.owner.toLowerCase())}`,
        },
        url: pageUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      },
      ...(faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <RepoSuiteClientView
        repo={repo}
        skills={skills}
        currentCategory={currentCategory}
        relatedRepos={relatedRepos}
        availableGuides={availableGuides}
        faqs={faqs}
        authorAvatar={author?.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(repo.owner)}?s=100`}
      />
    </>
  );
}