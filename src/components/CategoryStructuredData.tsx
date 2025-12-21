
import React from 'react';
import { Category } from '../types';

interface CategoryStructuredDataProps {
    category: Category;
}

export default function CategoryStructuredData({ category }: CategoryStructuredDataProps) {
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
                name: category.name,
                item: `https://skills.rest/category/${category.slug}`,
            },
        ],
    };

    // CollectionPage schema for category
    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.name} Skills`,
        description: `Browse Agent skills for ${category.name} workflows and automation`,
        url: `https://skills.rest/category/${category.slug}`,
        isPartOf: {
            '@type': 'WebSite',
            name: 'skills.rest',
            url: 'https://skills.rest',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
        </>
    );
}
