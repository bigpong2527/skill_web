import React from 'react';

interface WebSiteStructuredDataProps {
  totalSkills: number;
}

export default function WebSiteStructuredData({
  totalSkills,
}: WebSiteStructuredDataProps) {
  const formattedSkills = totalSkills.toLocaleString('en-US');

  // ✅ 100% 与全站 Meta Description 逐字严格对齐
  const siteDescription = `${formattedSkills}+ AI agent skills for ChatGPT, Claude & Gemini. Vetted. One-click install. 100% free. Updated daily.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. 网站实体 (WebSite) — 激活 Google 站内直达搜索框 (Sitelinks Searchbox) 与 SERP 网站名
      {
        '@type': 'WebSite',
        '@id': 'https://skills.rest/#website',
        url: 'https://skills.rest',
        name: 'skills.rest',
        alternateName: 'Agent Skills Library',
        description: siteDescription,
        inLanguage: 'en-US',
        // ✅ 已彻底移除原有的 about: [ ... ] 9 个违规关键词堆砌
        publisher: {
          '@type': 'Organization',
          '@id': 'https://skills.rest/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://skills.rest/explore?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },

      // 2. 机构主体 (Organization) — 确立知识图谱所有权与 E-E-A-T 开源背书
      {
        '@type': 'Organization',
        '@id': 'https://skills.rest/#organization',
        name: 'skills.rest',
        url: 'https://skills.rest',
        logo: 'https://skills.rest/icon.png',
        sameAs: [
          'https://github.com/WupDev/skills_discovery',
        ],
        // ✅ 已移除 Organization 中堆砌的 knowsAbout 泛词，保持实体定义合规
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@skills.rest',
          url: 'https://skills.rest/privacy',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}