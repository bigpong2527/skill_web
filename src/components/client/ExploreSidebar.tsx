'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';
import { Category } from '@/types';

interface ExploreSidebarProps {
    categories: Category[];
    currentCategory?: string;
    currentQuery?: string;
    authorType?: string;
    complexity?: string; // ✅ 新增
}

const ExploreSidebar: React.FC<ExploreSidebarProps> = ({
    categories,
    currentCategory,
    currentQuery,
    authorType,
    complexity // ✅ 新增
}) => {
    const { language } = useTheme();

    // 核心辅助函数：生成带有当前所有筛选状态的 URL
    const getFilterLink = (type: 'category' | 'authorType' | 'complexity', value?: string) => {
        const params = new URLSearchParams();

        // 1. 处理搜索词 (始终保留)
        if (currentQuery) params.set('q', currentQuery);

        // 2. 处理分类
        if (type === 'category') {
            if (value) params.set('category', value);
        } else {
            if (currentCategory) params.set('category', currentCategory);
        }

        // 3. 处理来源 (Author Type)
        if (type === 'authorType') {
            if (value && value !== authorType) {
                params.set('authorType', value);
            }
        } else {
            if (authorType) params.set('authorType', authorType);
        }

        // 4. 处理复杂度 (Complexity) ✅ 新增
        if (type === 'complexity') {
            if (value && value !== complexity) {
                params.set('complexity', value);
            }
        } else {
            if (complexity) params.set('complexity', complexity);
        }

        const queryString = params.toString();
        return queryString ? `/explore?${queryString}` : '/explore';
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
                {/* Category Filter */}
                <div>
                    <h3 className="mb-4 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                        {t('explore.sidebar.category', language)}
                    </h3>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                href={getFilterLink('category', undefined)}
                                prefetch={false}
                                className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${!currentCategory
                                    ? 'bg-blue-100 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-600/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {t('explore.sidebar.all_nodes', language)}
                            </Link>
                        </li>

                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Link
                                    href={getFilterLink('category', cat.slug)}
                                    prefetch={false}
                                    className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${currentCategory === cat.slug
                                        ? 'bg-blue-100 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-600/20 text-blue-600 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className="truncate">{t(`category.${cat.slug}`, language)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Origin Filter */}
                <div>
                    <h3 className="mb-4 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                        {t('explore.sidebar.origin', language)}
                    </h3>
                    <div className="space-y-3">
                        <Link
                            href={getFilterLink('authorType', 'Official')}
                            prefetch={false}
                            className="group flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                            <div className="relative flex items-center">
                                <div className={`h-4 w-4 rounded border ${authorType === 'Official' ? 'bg-blue-500 border-blue-500' : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'} flex items-center justify-center transition-colors`}>
                                    {authorType === 'Official' && (
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </div>
                            </div>
                            {t('explore.sidebar.verified', language)}
                        </Link>

                        <Link
                            href={getFilterLink('authorType', 'Community')}
                            prefetch={false}
                            className="group flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                            <div className="relative flex items-center">
                                <div className={`h-4 w-4 rounded border ${authorType === 'Community' ? 'bg-blue-500 border-blue-500' : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'} flex items-center justify-center transition-colors`}>
                                    {authorType === 'Community' && (
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </div>
                            </div>
                            {t('explore.sidebar.community', language)}
                        </Link>
                    </div>
                </div>

                {/* Complexity Filter ✅ 新增 */}
                <div>
                    <h3 className="mb-4 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                        {t('explore.sidebar.complexity', language)}
                    </h3>
                    <div className="space-y-3">
                        {['Basic', 'Intermediate', 'Advanced'].map((level) => (
                            <Link
                                key={level}
                                href={getFilterLink('complexity', level)}
                                prefetch={false}
                                className="group flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <div className="relative flex items-center">
                                    <div className={`h-4 w-4 rounded border ${complexity === level ? 'bg-blue-500 border-blue-500' : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'} flex items-center justify-center transition-colors`}>
                                        {complexity === level && (
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </div>
                                </div>
                                {t(`complexity.${level}`, language)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ExploreSidebar;
