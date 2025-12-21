'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import SkillCard from './SkillCard';
import { fetchSkills } from '@/app/actions';
import { Skill } from '@/types';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface SkillsGridProps {
  initialSkills: Skill[];
  category?: string;
  searchQuery?: string;
  authorType?: string;
  complexity?: string;
}

const SkillsGrid: React.FC<SkillsGridProps> = ({
  initialSkills,
  category,
  searchQuery,
  authorType,
  complexity,
}) => {
  const { language } = useTheme();

  // 状态管理
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isLoading, setIsLoading] = useState(false);
  // 只有当初始数据达到 limit (12) 时，才认为可能有更多数据
  const [hasMore, setHasMore] = useState(initialSkills.length >= 12);
  const [offset, setOffset] = useState(12);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. 滚动位置恢复 (优化体验)
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('skillListScrollPosition');
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      // 延时确保 DOM 渲染完毕
      setTimeout(() => {
        window.scrollTo(0, position);
      }, 100);
      sessionStorage.removeItem('skillListScrollPosition');
    }
  }, []);

  // 2. 筛选条件变化时重置状态 (关键：切换分类时必须重置)
  useEffect(() => {
    setSkills(initialSkills);
    setOffset(12);
    setHasMore(initialSkills.length >= 12);
    setIsLoading(false);
  }, [initialSkills, category, searchQuery, authorType, complexity]);

  // 3. 加载更多逻辑
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // 调用 Server Action 获取数据
      const newSkills = await fetchSkills({
        limit: 12,
        offset: offset,
        categorySlug: category,
        searchQuery: searchQuery,
        authorType: authorType,
        complexity: complexity
      });

      if (newSkills.length > 0) {
        setSkills((prev) => {
          // 数据去重：防止网络延迟导致的重复追加
          const existingIds = new Set(prev.map(s => s.id));
          const uniqueNewSkills = newSkills.filter(s => !existingIds.has(s.id));
          return [...prev, ...uniqueNewSkills];
        });
        setOffset((prev) => prev + 12);

        // 如果返回的数据少于请求的数量，说明已经没有更多数据了
        if (newSkills.length < 12) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more skills:', error);
      setHasMore(false); // 出错时停止尝试，避免死循环
    } finally {
      setIsLoading(false);
    }
  }, [offset, category, searchQuery, authorType, complexity, isLoading, hasMore]);

  // 4. IntersectionObserver 监听逻辑
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // 核心逻辑：当目标可见 + 还有更多数据 + 当前未在加载时 -> 触发加载
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px' // 提前 200px 触发，实现无感加载
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="flex flex-col">
      {/* 技能卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {/* 
          核心修复：加载触发器 (Sentinel)
          只要 hasMore 为 true，这个 div 就必须存在于 DOM 中。
          如果 isLoading 为 false，它就是一个透明的占位符，用于被 Observer 捕获。
      */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8 w-full min-h-[60px]">
          {isLoading ? (
            // 状态 A: 正在加载 -> 显示动画
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
            </div>
          ) : (
            // 状态 B: 等待加载 -> 显示透明占位符 (高度必须 > 0)
            <div className="h-10 w-full bg-transparent" />
          )}
        </div>
      )}

      {/* 到底提示 */}
      {!hasMore && skills.length > 0 && (
        <div className="text-center text-slate-400 dark:text-slate-600 py-12 text-sm tracking-widest uppercase font-mono border-t border-slate-100 dark:border-white/5 mt-4">
          {t('grid.end_of_stream', language)}
        </div>
      )}
    </div>
  );
};

export default SkillsGrid;