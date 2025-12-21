import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { filterSkills, getAllCategories } from '@/lib/db';
import { STATIC_CATEGORIES } from '@/lib/staticData';
import CategorySkillsList from '@/components/client/CategorySkillsList';
import CategoryStructuredData from '@/components/CategoryStructuredData';
import { t } from '@/lib/i18n';

// ✅ 强制使用 Edge Runtime
export const runtime = 'edge';

// ✅ ISR 配置：1小时更新一次
// 平衡了 SEO、首屏加载速度和数据新鲜度
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = STATIC_CATEGORIES.find(c => c.slug === slug);

    if (!category) {
        return {
            title: '404 - Category Not Found | skills.rest',
            description: 'The requested category could not be found.',
            robots: { index: false, follow: false },
        };
    }

    return {
        title: `Claude Skills for ${category.name} Workflows | Enterprise AI Automation | skills.rest`,
        description: `Discover powerful Claude Skills designed for ${category.name} workflows. Automate tasks, enhance productivity, and streamline operations with AI-powered tools for ${category.name} professionals.`,
        alternates: {
            canonical: `/category/${slug}`,
        },
        openGraph: {
            title: `Claude Skills for ${category.name} | skills.rest`,
            description: `Automate ${category.name} workflows with Claude AI Skills`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Claude Skills for ${category.name} | skills.rest`,
            description: `Automate ${category.name} workflows with Claude AI Skills`,
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    // 并行获取数据：前12个技能 + 所有分类信息
    const [skills, categories] = await Promise.all([
        filterSkills({ categorySlug: slug, limit: 12 }),
        getAllCategories()
    ]);

    const category = categories.find(c => c.slug === slug);

    if (!category) {
        notFound();
    }

    const language = 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
            <CategoryStructuredData category={category} />

            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-16 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/50 dark:bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl text-5xl mb-6 text-slate-800 dark:text-white">
                        {category.icon}
                    </div>
                    <h1 className="relative text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        {t(`category.${category.slug}`, language)}
                    </h1>
                    <p className="relative text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        {t(`category.desc.${category.slug}`, language)}
                    </p>
                </div>

                {/* Skills List Section */}
                {skills.length > 0 ? (
                    // ✅ 传递初始数据给客户端组件，后续加载由组件内的 Server Action 触发
                    <CategorySkillsList
                        initialSkills={skills}
                        categorySlug={slug}
                    />
                ) : (
                    <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5">
                        {t('category.no_data', language)}
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-16 text-center">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        {t('category.return', language)}
                    </Link>
                </div>
            </div>

            {/* SEO Content Block */}
            <article className="mt-20 prose dark:prose-invert max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    {t('category.seo.title_prefix', language)} {category.name}{t('category.seo.title_suffix', language)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('category.seo.p1_start', language)} {category.name} {t('category.seo.p1_end', language)}
                    {t('category.seo.p2', language)}
                </p>
            </article>
        </div>
    );
}