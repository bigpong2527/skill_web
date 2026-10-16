'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RepositorySuite } from '@/types';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface RepoCardProps {
  repo: RepositorySuite;
  lang?: 'en' | 'cn';
}

export default function RepoCard({ repo, lang: propLang }: RepoCardProps) {
  const { language: themeLang } = useTheme();
  const lang = propLang || themeLang;
  const router = useRouter();

  // 阻止外层 Link 冒泡，单独跳转到作者主页
  const triggerAuthorNavigation = () => {
    router.push(`/company/${encodeURIComponent(repo.owner.toLowerCase())}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerAuthorNavigation();
  };

  const handleAuthorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      triggerAuthorNavigation();
    }
  };

  // 作者认证徽章颜色
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Official':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Partner':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const authorAvatarUrl = `https://avatars.githubusercontent.com/${encodeURIComponent(repo.owner)}?s=40`;
  const formattedStars =
    repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars;

  return (
    <Link
      href={`/repo/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}`}
      prefetch={false}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 transition-all duration-300 ease-out hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:bg-[#0F172A] hover:-translate-y-1">
        
        {/* 1. 顶部：作者头像与名称 (左侧独立跳转) | ⭐ Star 勋章 (右上角高亮) */}
        <div className="flex items-center justify-between gap-3 mb-3 select-none">
          
          {/* 左侧作者区：带防冒泡独立跳转 */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleAuthorClick}
            onKeyDown={handleAuthorKeyDown}
            aria-label={`View profile of ${repo.owner}`}
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md cursor-pointer"
            title={`View all skills by ${repo.owner}`}
          >
            <img
              src={authorAvatarUrl}
              alt={repo.owner}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(repo.owner)}&background=0D8ABC&color=fff&size=40`;
              }}
            />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {repo.owner}
            </span>
          </div>

          {/* 右上角：GitHub 原生标准金色 Star 勋章 */}
          <div
            className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/20 text-[11px] font-mono shrink-0 select-none"
            title={`${repo.stars.toLocaleString()} GitHub stars`}
          >
            <svg className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
            <span>{formattedStars}</span>
          </div>
        </div>

        {/* 2. 中部：仓库大标题 + 一句话大白话副标题 (tagline) */}
        <div className="space-y-1.5 mb-5 flex-grow">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {repo.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-light">
            {repo.tagline || `Open-source Agent Skills repository by ${repo.owner}.`}
          </p>
        </div>

        {/* 3. 底栏：Official 徽章 (左) | 包含的 Skill 总数 (右) */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeColor(repo.author_type)}`}>
            {t(`skill.badge.${repo.author_type.toLowerCase()}`, lang)}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            📦 {repo.skills_count} Skills
          </span>
        </div>

      </div>
    </Link>
  );
}