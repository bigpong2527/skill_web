'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';
import AgentConnectButton from '@/components/client/AgentConnectButton';

interface HeaderProps {
  totalSkills?: number;
}

export default function Header({ totalSkills = 645954 }: HeaderProps) {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-slate-200 dark:border-white/5 shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-[1440px]">
        {/* Logo 与导航 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center font-bold tracking-tight">
            <span className="text-xl font-bold text-slate-900 dark:text-white select-none hover:opacity-90 transition-opacity">
              skills<span className="text-blue-600 dark:text-blue-500">.</span>rest
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/explore" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              {t('nav.explore', language)}
            </Link>
            <Link href="/best-skills" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              {t('home.featured.title', language)}
            </Link>
            <Link href="/companies" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              {t('nav.companies', language)}
            </Link>
          </nav>
        </div>

        {/* 右侧操作区：平滑集成 Agent 连接工具 */}
        <div className="flex items-center gap-3">
          {/* 实时收录胶囊（Apple 极简风格） */}
          <div
            className="hidden sm:inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-slate-100/80 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 select-none tracking-tight transition-colors hover:border-slate-300 dark:hover:border-white/20"
            title="Real-time indexed skills"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            <span>{totalSkills ? `${totalSkills.toLocaleString('en-US')}+ skills indexed` : '665,000+ skills indexed'}</span>
          </div>

          <div className="hidden sm:block">
            <AgentConnectButton totalSkills={totalSkills} />
          </div>

          <Link
            href="/contribute"
            className="hidden lg:inline-flex px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-mono text-xs font-semibold transition-colors"
          >
            {t('nav.contribute', language)}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            {language === 'en' ? 'EN' : '中'}
          </button>
        </div>
      </div>
    </header>
  );
}
