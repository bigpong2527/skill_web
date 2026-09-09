import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { filterSkills, getAllCategories, getSkillsMaxId } from '@/lib/db';
import SkillsGrid from '@/components/client/SkillsGrid';
import SearchBar from '@/components/client/SearchBar';
import ExploreSidebar from '@/components/client/ExploreSidebar';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 604800;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    
    // 🔍 严格检查：是否存在任何筛选参数
    const query = typeof params.q === 'string' ? params.q : '';
    const hasCategory = typeof params.category === 'string';
    const hasAuthorType = typeof params.authorType === 'string';
    const hasComplexity = typeof params.complexity === 'string';
    const hasFilter = typeof params.filter === 'string'; // 处理首页传来的 ?filter=recent

    // 🛑 SEO 核心修复：
    // 如果存在任何搜索词或筛选参数，强制 Google 不要索引此页面。
    // 这告诉 Google："这个页面只是筛选结果，不是核心内容，请去索引 /skill/[slug] 详情页"。
    if (query || hasCategory || hasAuthorType || hasComplexity || hasFilter) {
        return {
            title: query ? `Search "${query}" - Agent Skills | skills.rest` : 'Filtered Skills | skills.rest',
            description: 'Filtered view of the Agent Skills library.',
            robots: {
                index: false, // ❌ 禁止索引筛选结果页
                follow: true, // ✅ 允许顺着链接爬取详情页
            },
        };
    }

    // 🌟 动态读取数据库实时总数
    const totalSkillsRaw = await getSkillsMaxId();
    const thousands = Math.floor(totalSkillsRaw / 1000);
    const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();

    return {
        title: 'Explore Agent Skills for ChatGPT & Claude | skills.rest',
        description: `Browse ${formattedCount}+ AI agent skills for ChatGPT, Claude & Gemini. Search, filter, and discover verified tools for every workflow.`,
        alternates: {
            canonical: 'https://skills.rest/explore',
        },
    };
}

export default async function ExplorePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : '';
    const categorySlug = typeof params.category === 'string' ? params.category : '';
    const authorType = typeof params.authorType === 'string' ? params.authorType : undefined;
    const complexity = typeof params.complexity === 'string' ? params.complexity : undefined;

    // Fetch data
    const [initialSkills, categories] = await Promise.all([
        filterSkills({
            searchQuery: query,
            categorySlug: categorySlug || undefined,
            authorType: authorType,
            complexity: complexity,
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
                        complexity={complexity}
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
                                complexity={complexity}
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
