
import React from 'react';
import { Category } from '../types';

interface CategoryStructuredDataProps {
    category: Category;
}

export default function CategoryStructuredData({ category }: CategoryStructuredDataProps) {
  const baseUrl = 'https://skills.rest';
  const categoryUrl = `${baseUrl}/category/${encodeURIComponent(category.slug)}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${categoryUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: category.name,
            item: categoryUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${categoryUrl}#collectionpage`,
        name: `${category.name} Skills`,
        description: `Browse Agent Skills for ${category.name} workflows and automation`,
        url: categoryUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'skills.rest',
          url: baseUrl,
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
