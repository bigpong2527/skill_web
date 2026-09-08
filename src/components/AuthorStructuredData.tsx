import React from 'react';
import { Author } from '../types';

interface AuthorStructuredDataProps {
  author: Author;
  skillsCount: number;
}

export default function AuthorStructuredData({
  author,
  skillsCount,
}: AuthorStructuredDataProps) {
  const displayName = author.name || author.login;
  const baseUrl = 'https://skills.rest';
  const authorUrl = `${baseUrl}/company/${encodeURIComponent(author.login.toLowerCase())}`;
  const authorId = `${authorUrl}#identity`; // ✅ 新增

  // 1. twitter 防御性字符串转换 (防止数字或非 string 类型调用 .replace 崩溃)
  const sameAsLinks = [
    author.website || undefined,
    author.twitter ? `https://x.com/${String(author.twitter).replace(/^@/, '')}` : undefined,
    `https://github.com/${encodeURIComponent(author.login)}`,
  ].filter(Boolean);

  const entityType = author.author_type === 'Official' ? 'Organization' : 'Person';

  const graphList: any[] = [
    // 1. 机构 / 个人实体
    {
      '@type': entityType,
      '@id': authorId,
      name: displayName,
      alternateName: author.login,
      url: authorUrl,
      image: author.avatar_url || undefined,
      description:
        author.headline || author.bio || `${displayName} publishes verified Agent Skills on skills.rest.`,
      sameAs: sameAsLinks,
      // 2. capability_breakdown 防御性对象校验 (防止 null 或非 object 数据调用 Object.keys 崩溃)
      knowsAbout: (author.capability_breakdown && typeof author.capability_breakdown === 'object')
        ? Object.keys(author.capability_breakdown)
        : undefined,
    },
    // 2. 聚合作品集
    {
      '@type': 'CollectionPage',
      name: `${displayName} — Agent Skills`,
      url: authorUrl,
      description: `Browse ${skillsCount.toLocaleString()} agent skills published by ${displayName} on skills.rest.`,
      isPartOf: { '@type': 'WebSite', name: 'skills.rest', url: baseUrl },
      about: { '@id': authorId }, // ✅ 新增：把作品集关联到作者实体
    },
    // 3. 根级面包屑
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: displayName, item: authorUrl },
      ],
    },
  ];

  // 3. faqs 防御性数组校验 (防止非数组数据调用 .filter 崩溃 500)
  const validFaqs = Array.isArray(author.faqs)
    ? author.faqs.filter(
        (faq) => typeof faq?.question === 'string' && faq.question.trim() && typeof faq?.answer === 'string' && faq.answer.trim()
      )
    : [];

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
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graphList }) }}
    />
  );
}