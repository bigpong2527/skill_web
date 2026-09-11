'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

interface FooterProps {
  totalSkills: number;
}

export default function Footer({ totalSkills }: FooterProps) {
  const { language } = useTheme();
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formattedSkills = totalSkills.toLocaleString('en-US');

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#080E1E] pt-14 pb-12 text-[12px] text-slate-600 dark:text-slate-400 font-sans transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* TIER 1: 品牌纯净声明 */}
        <div className="pb-6 border-b border-slate-100 dark:border-white/5 text-left">
          <div className="space-y-1.5 max-w-3xl">
            <Link href="/" className="font-bold text-lg text-slate-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity">
              skills<span className="text-blue-600 dark:text-blue-500">.</span>rest
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-relaxed">
              {formattedSkills}+ AI agent skills for ChatGPT, Claude &amp; Gemini. Vetted. One-click install. 100% free. Updated daily.
            </p>
          </div>
        </div>

        {/* TIER 2: 4 核心功能导航组 (0 死链) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left">
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.discovery', language)}
            </h3>
            <ul className="space-y-2 font-mono text-slate-500 dark:text-slate-400 text-xs">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('skill.home', language)}</Link></li>
              <li><Link href="/explore" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.explore_all', language)}</Link></li>
              <li><Link href="/best-skills" className="hover:text-blue-600 dark:hover:text-white transition-colors font-medium">{t('home.featured.title', language)}</Link></li>
              <li><Link href="/companies" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.organizations', language)}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.developers', language)}
            </h3>
            <ul className="space-y-2 font-mono text-slate-500 dark:text-slate-400 text-xs">
              <li>
                <Link
                  href="/skills-search-cli"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  {t('footer.cli_tool', language)}
                </Link>
              </li>
              <li><Link href="/contribute" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('nav.contribute', language)}</Link></li>
              <li><a href="https://skills.rest/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors">Sitemap</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.platform', language)}
            </h3>
            <ul className="space-y-2 font-mono text-slate-500 dark:text-slate-400 text-xs">
              <li><a href="mailto:support@skills.rest" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.about_support', language)}</a></li>
              <li><a href="https://x.com/DPZH2527" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.founder_twitter', language)}</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">
              {t('footer.legal', language)}
            </h3>
            <ul className="space-y-2 font-mono text-slate-500 dark:text-slate-400 text-xs">
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.privacy_policy', language)}</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('footer.terms_of_service', language)}</Link></li>
            </ul>
          </div>
        </div>

        {/* TIER 3: 法定声明与回到顶部 */}
        <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span>© 2026 skills.rest. {t('footer.rights', language)}</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t('footer.operational', language)}
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 max-w-4xl leading-normal font-sans text-[11px]">
              {t('footer.disclaimer', language)}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="px-5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center gap-2 shadow-sm transition-colors shrink-0"
            aria-label="Back to Top"
          >
            ↑ {t('footer.back_to_top', language)}
          </button>
        </div>
      </div>
    </footer>
  );
}
