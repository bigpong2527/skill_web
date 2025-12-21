import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllCategories } from '@/lib/db';
import { t } from '@/lib/i18n';

export const runtime = 'edge';

export const metadata: Metadata = {
    title: 'Categories - Explore Claude Skills by Professional Domain | skills.rest',
    description: 'Browse Claude Skills by 10 core professional domains. Find the perfect AI tools for your work.',
    alternates: {
        canonical: 'https://skills.rest/categories',
    },
};

export default async function CategoriesPage() {
    const categories = await getAllCategories();
    const language = 'en'; // 默认语言，后续可对接 Context

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        {t('categories.title', language)}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('categories.subtitle', language)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="group relative overflow-hidden bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200 dark:border-white/5 p-6 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-5">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {t(`category.${category.slug}`, language)}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {t(`category.desc.${category.slug}`, language)}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative gradient glow */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
