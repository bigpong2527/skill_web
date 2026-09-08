import React from 'react';
import { Category, Skill } from '../types';

interface FAQ {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  skill: Skill;
  categories: Category[];
  faqs?: FAQ[];
}

// ✅ 解决 SQLite 带空格时间导致 Google 报 Invalid ISO 8601 Date 警告
function toIsoDate(dateStr?: string | null): string {
  if (!dateStr || dateStr === 'NULL') return '2025-10-01';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '2025-10-01';
    return d.toISOString().split('T')[0];
  } catch {
    return '2025-10-01';
  }
}

export default function StructuredData({
  skill,
  categories,
  faqs = [],
}: StructuredDataProps) {
  const categoryNames = categories.map((category) => category.name);
  const primaryCategory = categories[0];

  const baseUrl = 'https://skills.rest';
  const skillUrl = `${baseUrl}/skill/${encodeURIComponent(skill.slug)}`;

  // 1. 软件应用 Schema
  const softwareSchema: Record<string, unknown> = {
    '@type': 'SoftwareApplication',
    name: skill.name,
    description: skill.tagline || (skill.description ? skill.description.slice(0, 200) : skill.name),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    author: {
      '@type': skill.author_type === 'Official' ? 'Organization' : 'Person',
      name: skill.author_display_name || skill.author_name,
      url: `${baseUrl}/company/${encodeURIComponent(skill.author_name.toLowerCase())}`,
    },
    creator: {
      '@type': skill.author_type === 'Official' ? 'Organization' : 'Person',
      name: skill.author_display_name || skill.author_name,
    },
    version: skill.version,
    dateModified: toIsoDate(skill.updated_at),
    datePublished: toIsoDate(skill.created_at),
    url: skillUrl,
    installUrl: skillUrl,
    softwareRequirements: (function() {
      if (!skill.dependencies) return undefined;
      try {
        let raw = skill.dependencies;
        if (raw.startsWith('"') && raw.endsWith('"')) raw = JSON.parse(raw);
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.join(', ') : undefined;
      } catch {
        return skill.dependencies.replace(/["\[\]\\]/g, '').trim() || undefined;
      }
    })(),
    keywords: [
      skill.name,
      ...categoryNames,
      ...(skill.keywords || []),
      'Agent Skill',
      'AI Skill',
      'Claude Skill',
      'ChatGPT Skill',
      'Gemini Skill',
    ].join(', '),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  // 仅在有真实有效评分时输出评分，杜绝虚假打分风险
  if (skill.ratings_count > 0 && skill.rating > 0) {
    softwareSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: skill.rating.toFixed(1),
      ratingCount: skill.ratings_count,
      bestRating: '5',
      worstRating: '1',
    };
  }

  // 2. 面包屑导航 Schema
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...(primaryCategory
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: primaryCategory.name,
              item: `${baseUrl}/category/${encodeURIComponent(primaryCategory.slug)}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: primaryCategory ? 3 : 2,
        name: skill.name,
        item: skillUrl,
      },
    ],
  };

  // 3. 构造干净的知识图谱树（无多余中间变量，100% 杜绝 null 入树）
  const validFaqs = faqs.filter(
    (faq) =>
      typeof faq?.question === 'string' &&
      faq.question.trim() &&
      typeof faq?.answer === 'string' &&
      faq.answer.trim()
  );

  const graphList: any[] = [softwareSchema, breadcrumbSchema];

  if (validFaqs.length > 0) {
    graphList.push({
      '@type': 'FAQPage',
      mainEntity: validFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graphList,
        }),
      }}
    />
  );
}