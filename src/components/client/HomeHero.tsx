'use client';

import React from 'react';
import AnimatedCounter from '@/components/client/AnimatedCounter';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface HomeHeroProps {
    totalSkills: number;
}

const HomeHero: React.FC<HomeHeroProps> = ({ totalSkills }) => {
    const { language } = useTheme();

    return (
        <section className="relative pt-24 pb-8 lg:pt-36 lg:pb-12 border-b border-slate-200 dark:border-white/5 overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
            {/* Subtle Background Glow - Hidden on mobile for performance */}
            <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="hidden md:block absolute top-[20%] left-[10%] w-72 h-72 bg-emerald-100/50 dark:bg-emerald-900/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 text-center z-10 flex flex-col items-center">

                <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                    {t('home.hero.title', language)}
                </h1>

                {/* Animated Counter */}
                <div className="mb-12 flex items-center gap-3 text-xl sm:text-2xl font-light text-slate-500 dark:text-slate-400">
                    <span className="text-blue-600 dark:text-blue-500 font-bold font-mono text-3xl sm:text-4xl">
                        <AnimatedCounter end={totalSkills > 0 ? totalSkills : 500} />
                    </span>
                    <span>{t('home.hero.stats_suffix', language)}</span>
                </div>

                {/* Central Search Bar */}
                <form action="/explore" className="w-full max-w-2xl mx-auto mb-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <svg className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            name="q"
                            className="block w-full h-[60px] pl-16 pr-32 text-lg text-slate-900 dark:text-white bg-white dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/10 rounded-full placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#0F172A] backdrop-blur-xl transition-all shadow-xl dark:shadow-none"
                            placeholder={t('home.hero.search_placeholder', language)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors shadow-lg shadow-blue-900/20"
                        >
                            {t('home.hero.search_btn', language)}
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
};

export default HomeHero;
