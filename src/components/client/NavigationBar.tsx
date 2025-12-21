
'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

interface NavigationBarProps {
  skillName: string;
  categoryName?: string;
  categorySlug?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ skillName, categoryName, categorySlug }) => {
  const { language } = useTheme();

  return (
    <nav className="flex items-center text-sm text-slate-400 mb-6 overflow-hidden whitespace-nowrap">
      <Link href="/" className="hover:text-white transition-colors">{t('skill.home', language)}</Link>
      <span className="mx-2 text-slate-600">/</span>
      {categoryName && categorySlug ? (
        <>
          <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors">{t(`category.${categorySlug}`, language)}</Link>
          <span className="mx-2 text-slate-600">/</span>
        </>
      ) : null}
      {skillName && (
        <span className="text-slate-200 truncate max-w-[200px] sm:max-w-md">{skillName}</span>
      )}
      {/* If we are just browsing a category without a skill */}
      {!skillName && categoryName && categorySlug && (
        <span className="text-slate-200 truncate">{t(`category.${categorySlug}`, language)}</span>
      )}</nav>
  );
};

export default NavigationBar;
