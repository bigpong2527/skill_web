'use client';

import React from 'react';
import Link from 'next/link';
import { Skill } from '@/types';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface SkillCardProps {
    skill: Skill;
    lang?: 'en' | 'cn';
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, lang: propLang }) => {
    const { language: themeLang } = useTheme();
    const lang = propLang || themeLang;

    // Save scroll position on click
    const handleCardClick = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('skillListScrollPosition', window.scrollY.toString());
        }
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Official':
                return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
            case 'Partner':
                return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            default:
                return 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50';
        }
    };

    const getComplexityColor = (complexity: string) => {
        switch (complexity) {
            case 'Basic':
                return 'text-emerald-600 dark:text-emerald-500';
            case 'Intermediate':
                return 'text-amber-600 dark:text-amber-500';
            case 'Advanced':
                return 'text-rose-600 dark:text-rose-500';
            default:
                return 'text-slate-500';
        }
    };

    return (
        <Link
            href={`/skill/${skill.slug}`}
            className="group block h-full"
            onClick={handleCardClick}
        >
            <div className="relative h-full flex flex-col bg-white dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 p-5 transition-all duration-200 ease-out hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-lg dark:hover:bg-[#0F172A] hover:translate-y-[-2px]">

                {/* Header: Title & Badge */}
                <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {skill.name}
                    </h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border ${getBadgeColor(skill.author_type)}`}>
                        {t(`skill.badge.${skill.author_type.toLowerCase()}`, lang)}
                    </span>
                </div>

                {/* Body: Tagline */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6 flex-grow font-light">
                    {skill.tagline}
                </p>

                {/* Footer: Meta Data */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                    {/* Left: Complexity */}
                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 ${getComplexityColor(skill.complexity)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {t(`complexity.${skill.complexity}`, lang)}
                        </span>
                    </div>

                    {/* Right: Author */}
                    <div className="flex items-center gap-1 text-slate-400 truncate max-w-[120px] justify-end">
                        <span>{t('skill.card.by', lang)}</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium truncate" title={skill.author_name}>
                            {skill.author_name}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SkillCard;
