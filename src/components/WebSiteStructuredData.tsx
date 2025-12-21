
import React from 'react';

export default function WebSiteStructuredData() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'skills.rest',
        alternateName: 'Claude Skills Library',
        url: 'https://skills.rest',
        description: 'The ultimate registry for Claude AI capabilities, tools, and automation skills',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://skills.rest/explore?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'skills.rest',
        url: 'https://skills.rest',
        logo: 'https://skills.rest/og-image.png',
        sameAs: [],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}
