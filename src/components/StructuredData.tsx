
import React from 'react';
import { Skill, Category } from '../types';
import { safeParseJsonArray } from '../lib/utils';

interface StructuredDataProps {
  skill: Skill;
  categories: Category[];
}

export default function StructuredData({ skill, categories }: StructuredDataProps) {
  const dependencies = safeParseJsonArray(skill.dependencies);

  const categoryNames = categories.map((c) => c.name);
  const primaryCategory = categories[0];
  const primaryCategoryName = primaryCategory?.name || 'Developer Tool';
  const primaryCategorySlug = primaryCategory?.slug || 'software-engineering';

  // Comprehensive category mapping based on slug for all 10 static categories
  const categoryToSchemaMap: Record<string, string> = {
    'software-engineering': 'DeveloperApplication',
    'data-analytics': 'DataApplication',
    'design-creative': 'DesignApplication',
    'marketing-sales': 'BusinessApplication',
    'finance-accounting': 'BusinessApplication',
    'product-management': 'BusinessApplication',
    'content-communication': 'CommunicationApplication',
    'education-research': 'EducationalApplication',
    'legal-compliance': 'BusinessApplication',
    'personal-entrepreneur': 'LifestyleApplication',
  };

  // SEO CRITICAL: Use 'Application' as fallback (more generic and Google-friendly than 'Utility')
  const applicationCategory = categoryToSchemaMap[primaryCategorySlug] || 'Application';

  const softwareRequirements = dependencies.length > 0 ? `Requires: ${dependencies.join(', ')}` : undefined;

  const allKeywords = [skill.name, ...categoryNames, 'Claude Skill', 'Agent Skill', 'AI Tool', skill.author_name].join(
    ', '
  );

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.name,
    description: skill.tagline || skill.description.substring(0, 200),
    applicationCategory,
    operatingSystem: 'Claude AI, Cross-platform',
    author: {
      '@type': 'Person',
      name: skill.author_name,
    },
    // Download interaction statistics
    interactionStatistic: skill.downloads > 0 ? {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/DownloadAction',
      userInteractionCount: skill.downloads,
    } : undefined,
    creator: {
      '@type': 'Organization',
      name: skill.author_name,
    },
    version: skill.version,
    releaseNotes: `Version ${skill.version} - Complexity: ${skill.complexity}`,
    dateModified: skill.updated_at,
    datePublished: skill.created_at,
    downloadUrl: `https://skills.rest/skill/${skill.slug}`,
    installUrl: `https://skills.rest/skill/${skill.slug}`,
    softwareRequirements: softwareRequirements,
    // SEO CRITICAL: Schema accuracy is essential for Google Rich Results
    // Price is currently hardcoded as free. Future: add price field to database
    offers: {
      '@type': 'Offer',
      price: '0', // Free tier - update when paid skills are introduced
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    keywords: allKeywords,
    workExample: {
      '@type': 'Thing',
      name: `${skill.name} Use Case`,
      description: skill.tagline,
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://skills.rest/skill/${skill.slug}`,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
      },
    },
    isPartOf: {
      '@type': 'WebApplication',
      name: 'skills.rest',
      url: 'https://skills.rest',
      applicationCategory: 'SkillDiscoveryPlatform',
    },
  };

  // Only add rating schema if ratings exist, complying with Google policies
  if (skill.ratings_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: skill.rating.toFixed(1),
      ratingCount: skill.ratings_count,
      bestRating: '5',
      worstRating: '1',
    };

    schema.review = {
      '@type': 'Review',
      author: {
        '@type': 'Organization',
        name: 'Aggregated User Reviews',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: skill.rating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
    };
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://skills.rest',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: primaryCategoryName,
        item: `https://skills.rest/category/${primaryCategory?.slug || 'general'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: skill.name,
        item: `https://skills.rest/skill/${skill.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
