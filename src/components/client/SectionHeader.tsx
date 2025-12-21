'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface SectionHeaderProps {
    titleKey: string;
    linkTextKey: string;
    href: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ titleKey, linkTextKey, href }) => {
    const { language } = useTheme();

    return (
        <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t(titleKey, language)}</h2>
            <Link href={href} className="text-sm font-mono text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1">
                {t(linkTextKey, language)} <span aria-hidden="true">&rarr;</span>
            </Link>
        </div>
    );
};

export default SectionHeader;
