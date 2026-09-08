'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // 点击整个卡片时，保存当前滚动位置，优化用户返回体验
  const handleCardClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skillListScrollPosition', window.scrollY.toString());
    }
  };

  // 独立路由跳转（防止 HTML5 <a> 标签嵌套报错，并切断事件冒泡）
  const triggerAuthorNavigation = () => {
    router.push(`/company/${encodeURIComponent(skill.author_name.toLowerCase())}`);
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

  // 官方/社区胶囊徽章颜色
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

  // 三段式复杂度信号条
  const renderComplexityBars = (complexity: string) => {
    switch (complexity) {
      case 'Basic':
        return (
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
            <span className="w-2 h-1.5 rounded-sm bg-slate-200 dark:bg-slate-800"></span>
            <span className="w-2 h-1.5 rounded-sm bg-slate-200 dark:bg-slate-800"></span>
          </div>
        );
      case 'Intermediate':
        return (
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
            <span className="w-2 h-1.5 rounded-sm bg-slate-200 dark:bg-slate-800"></span>
          </div>
        );
      case 'Advanced':
        return (
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
            <span className="w-2 h-1.5 rounded-sm bg-emerald-500"></span>
          </div>
        );
      default:
        return null;
    }
  };

  // 优先使用数据库存储的头像，兜底使用 GitHub 拼接规则
  const authorAvatarUrl =
    skill.author_avatar ||
    `https://avatars.githubusercontent.com/${encodeURIComponent(skill.author_name)}?s=40`;

  // 安全处理 Star 的 K 单位换算
  const formattedStars = skill.stars != null && skill.stars >= 1000 
    ? `${(skill.stars / 1000).toFixed(1)}k` 
    : skill.stars;

  return (
    <Link
      href={`/skill/${encodeURIComponent(skill.slug)}`}
      prefetch={false}
      className="group block h-full select-none"
      onClick={handleCardClick}
    >
      <div className="relative h-full flex flex-col bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 transition-all duration-300 ease-out hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:bg-[#0F172A] hover:-translate-y-1">

        {/* 1. Top Bar: 作者 Avatar + 名字 (左) | Star 或 版本号 (右) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          
          {/* 左侧作者区：阻止冒泡实现独立跳转 (支持鼠标与键盘操作) */}
          <div 
            role="button"
            tabIndex={0}
            onClick={handleAuthorClick}
            onKeyDown={handleAuthorKeyDown}
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            title={`View all skills by ${skill.author_name}`}
          >
            <img
              src={authorAvatarUrl}
              alt={skill.author_name}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
              loading="lazy"
            />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {skill.author_name}
            </span>
          </div>

          {/* 右上角：有 Star 显 Star，无 Star 时纯净留白 */}
          {skill.stars != null && skill.stars > 0 && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/20 text-[11px] font-mono shrink-0" title={`${skill.stars.toLocaleString()} GitHub stars`}>
              <span aria-hidden="true">⭐</span>
              <span>{formattedStars}</span>
            </div>
          )}
        </div>

        {/* 2. Middle Content: 大字号标题 + 优雅描述 */}
        <div className="space-y-1.5 mb-6 flex-grow">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {skill.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed line-clamp-2">
            {skill.tagline}
          </p>
        </div>

        {/* 3. Bottom Bar: 官方/社区胶囊徽章 (左) | 三段式复杂度信号条 (右) */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
          
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border shrink-0 ${getBadgeColor(skill.author_type)}`}>
            {t(`skill.badge.${skill.author_type.toLowerCase()}`, lang)}
          </span>

          <div className="flex items-center gap-2" title={`Complexity: ${skill.complexity}`}>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t(`complexity.${skill.complexity}`, lang)}
            </span>
            {renderComplexityBars(skill.complexity)}
          </div>
          
        </div>

      </div>
    </Link>
  );
};

export default SkillCard;