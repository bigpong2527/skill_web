import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { filterSkills, getAllCategories } from '@/lib/db';
import SkillsGrid from '@/components/client/SkillsGrid';
import SearchBar from '@/components/client/SearchBar';
import ExploreSidebar from '@/components/client/ExploreSidebar';
import { t } from '@/lib/i18n';

export const runtime = 'edge';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : '';

    if (query) {
        return {
            title: `Search "${query}" - Agent skills | skills.rest`,
            description: `Search results for "${query}" in the Agent skills library. Find AI tools and automation capabilities matching your needs.`,
            alternates: {
                canonical: `/explore`,
            },
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    return {
        title: 'Explore Agent skills | Ultimate Skills Library | skills.rest',
        description: 'Browse the complete Agent skills library with 2000+ verified tools. Search, filter, and discover AI automation capabilities for every workflow.',
        alternates: {
            canonical: '/explore',
        },
    };
}

export default async function ExplorePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : '';
    const categorySlug = typeof params.category === 'string' ? params.category : '';
    const authorType = typeof params.authorType === 'string' ? params.authorType : undefined;
    const complexity = typeof params.complexity === 'string' ? params.complexity : undefined; // ✅ 新增

    // Fetch data
    const [initialSkills, categories] = await Promise.all([
        filterSkills({
            searchQuery: query,
            categorySlug: categorySlug || undefined,
            authorType: authorType,
            complexity: complexity, // ✅ 传递给 filterSkills
            limit: 12,
        }),
        getAllCategories()
    ]);

    const language = 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col gap-12 lg:flex-row">

                    {/* Sidebar Filters */}
                    <ExploreSidebar
                        categories={categories}
                        currentCategory={categorySlug}
                        currentQuery={query}
                        authorType={authorType}
                        complexity={complexity} // ✅ 传递给 Sidebar
                    />

                    {/* Main Grid */}
                    <div className="flex-1">
                        <div className="mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('explore.title', language)}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                                        {query ?
                                            <span>{t('explore.subtitle.search', language)} <span className="text-slate-800 dark:text-white font-mono bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded">"{query}"</span></span>
                                            : categorySlug ?
                                                <span>{t('explore.subtitle.browse', language)} <span className="text-blue-600 dark:text-blue-400">{t(`category.${categorySlug}`, language)}</span></span>
                                                : t('explore.subtitle.default', language)}
                                    </p>
                                </div>

                                <SearchBar />
                            </div>
                        </div>

                        {initialSkills.length > 0 ? (
                            <SkillsGrid
                                initialSkills={initialSkills}
                                category={categorySlug}
                                searchQuery={query}
                                authorType={authorType}
                                complexity={complexity} // ✅ 传递给 SkillsGrid
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                                <div className="text-6xl mb-6 opacity-50 grayscale">📡</div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('explore.signal_lost', language)}</h3>
                                <p className="text-slate-500 mb-6">{t('explore.no_results', language)}</p>
                                <Link
                                    href="/explore"
                                    className="px-6 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-medium transition-colors border border-slate-300 dark:border-white/10 shadow-sm"
                                >
                                    {t('explore.reset', language)}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}