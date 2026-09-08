'use client';

import React from 'react';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface HomeHeroProps {
  totalSkills: number;
}

export default function HomeHero({ totalSkills }: HomeHeroProps) {
  const { language } = useTheme();

  return (
    <section className="relative pt-20 pb-16 text-center max-w-4xl mx-auto px-4 z-10 select-none">

      {/* 1. H1 标题：大字号、舒展布局、黄金行高与字距 */}
      <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-slate-900 dark:text-white leading-[1.08] mb-5">
        {t('home.hero.title', language)}
      </h1>

      {/* 2. 副标题：字号提升，上下拉开呼吸空隙，彻底告别文字挤压 */}
      <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed tracking-[-0.012em] max-w-2xl mx-auto mb-10">
        {t('home.hero.subtitle', language)}
      </p>

      {/* 3. 搜索栏：横向加宽至 max-w-2xl，高度设为舒适的 56px，按钮与文字自然透气 */}
      <form
        action="/explore"
        method="GET"
        role="search"
        className="relative w-full max-w-2xl mx-auto group mb-4"
      >
        <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          name="q"
          autoComplete="off"
          spellCheck="false"
          className="w-full h-14 bg-white/90 dark:bg-[#121826]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl pl-12 pr-28 shadow-xs hover:border-slate-300 dark:hover:border-white/20 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all placeholder:text-slate-400 font-sans"
          placeholder={t('home.hero.search_placeholder', language)}
        />

        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-500 active:scale-96 text-white font-medium rounded-xl text-sm transition-all duration-150 shadow-xs flex items-center cursor-pointer"
        >
          <span>{t('home.hero.search_btn', language)}</span>
        </button>
      </form>

      {/* 4. 信任背书：色块统一为 Apple 风格的翡翠绿，克制高雅 */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tight">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          Vetted
        </span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          100% Free
        </span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          Updated Daily
        </span>
      </div>

    </section>
  );
}
