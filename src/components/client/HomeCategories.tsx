'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';
import { Category } from '@/types';

interface HomeCategoriesProps {
    categories: Category[];
}

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
    const { language } = useTheme();

    return (
        <section className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        prefetch={false}
                        className="group flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B1121] transition-all duration-200 hover:border-blue-500/30 hover:shadow-md dark:hover:bg-[#0F172A] hover:-translate-y-1"
                    >
                        <span className="text-2xl mb-3 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                            {cat.icon}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 tracking-wide text-center">
                            {t(`category.${cat.slug}`, language)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomeCategories;
