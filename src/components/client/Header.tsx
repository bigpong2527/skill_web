'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

const Header: React.FC = () => {
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
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${scrolled
        ? 'bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-slate-200 dark:border-white/5 shadow-sm'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center font-bold tracking-tight">
            <div className="logo-container text-xl font-bold text-slate-900 dark:text-white w-[10em] justify-center select-none cursor-pointer">
              {/* Part 1: Skills */}
              <span>Skills</span>

              {/* Animation Bridge */}
              <div className="animated-bridge">
                {/* State A: Dot */}
                <span className="dot">.</span>
                {/* State B: Slogan */}
                <span className="slogan-part">Work. You</span>
              </div>

              {/* Part 3: Rest */}
              <span>Rest</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/explore" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              {t('nav.explore', language)}
            </Link>
            <Link href="/explore?filter=recent" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              {t('nav.new_arrivals', language)}
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            {language === 'en' ? 'EN' : '中'}
          </button>

          {/* Environment Selector - Moved to InstallGuide */}
        </div>
      </div>
    </header>
  );
};

export default Header;