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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        scrolled || mobileMenuOpen
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md border-slate-200 dark:border-white/5 shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-[1440px]">
        {/* Logo 与桌面导航 */}
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
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Theme Toggle (触控目标优化并保证无障碍标签) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
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

          {/* Language Toggle (带明确 aria-label) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Switch language, currently ${language === 'en' ? 'English' : 'Chinese'}`}
          >
            {language === 'en' ? 'EN' : '中'}
          </button>

          {/* 移动端汉堡切换按钮 (Mobile Hamburger Toggle) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端下拉折叠抽屉菜单 (Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#020617] px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('nav.explore', language)}
          </Link>
          <Link
            href="/best-skills"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('home.featured.title', language)}
          </Link>
          <Link
            href="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('nav.companies', language)}
          </Link>
          <Link
            href="/contribute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('nav.contribute', language)}
          </Link>
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 sm:hidden">
            <AgentConnectButton totalSkills={totalSkills} />
          </div>
        </div>
      )}
    </header>
  );
}
