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
    
    const query = typeof params.q === 'string' ? params.q.trim() : '';
    const hasCategory = typeof params.category === 'string' && params.category.trim().length > 0;
    const hasAuthorType = typeof params.authorType === 'string' && params.authorType.trim().length > 0;
    const hasComplexity = typeof params.complexity === 'string' && params.complexity.trim().length > 0;
    const hasFilter = typeof params.filter === 'string' && params.filter.trim().length > 0;

    // 存在任何筛选参数或搜索词时，禁止搜索引擎抓取动态中间结果页
    if (query || hasCategory || hasAuthorType || hasComplexity || hasFilter) {
        return {
            title: query ? `Search "${query}" - Agent Skills | skills.rest` : 'Filtered Skills | skills.rest',
            description: 'Filtered view of the Agent Skills library.',
            robots: {
                index: false,
                follow: true,
            },
        };
    }

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
    
    // 规范化修剪参数，彻底避免传递空字符串
    const query = typeof params.q === 'string' ? params.q.trim() : '';
    const categorySlug = typeof params.category === 'string' ? params.category.trim() : '';
    const authorType = typeof params.authorType === 'string' && params.authorType.trim() ? params.authorType.trim() : undefined;
    const complexity = typeof params.complexity === 'string' && params.complexity.trim() ? params.complexity.trim() : undefined;

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

    // 判断是否为无搜索、无分类、无维度的初始纯净态
    const isPristine = !query && !categorySlug && !authorType && !complexity;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col gap-12 lg:flex-row">

                    {/* 侧边栏筛选 */}
                    <ExploreSidebar
                        categories={categories}
                        currentCategory={categorySlug}
                        currentQuery={query}
                        authorType={authorType}
                        complexity={complexity}
                    />

                    {/* 主工作区域 */}
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

                        {/* 状态 1：无选择或无搜索词时，纯净留白，不显示数据，也不提示丢失信号 */}
                        {isPristine ? (
                            <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center select-none border border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/40 dark:bg-slate-900/20">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-xl mb-3 text-slate-400 dark:text-slate-500 shadow-xs">
                                    🔍
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 font-mono text-xs max-w-sm leading-relaxed">
                                    Select a category from the sidebar or search above to find skills.
                                </p>
                            </div>
                        ) : initialSkills.length > 0 ? (
                            /* 状态 2：用户有筛选条件且命中数据 */
                            <SkillsGrid
                                initialSkills={initialSkills}
                                category={categorySlug}
                                searchQuery={query}
                                authorType={authorType}
                                complexity={complexity}
                            />
                        ) : (
                            /* 状态 3：用户主动搜索或筛选但未匹配到结果 */
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