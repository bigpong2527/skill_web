'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import SkillCard from './SkillCard';
// ❌ 删除 Server Action 引用，避免在静态页面触发上下文错误
// import { fetchSkills } from '@/app/actions'; 
import { Skill } from '@/types';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface CategorySkillsListProps {
    initialSkills: Skill[];
    categorySlug: string;
}

const CategorySkillsList: React.FC<CategorySkillsListProps> = ({
    initialSkills,
    categorySlug,
}) => {
    const { language } = useTheme();
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [isLoading, setIsLoading] = useState(false);
    // 如果初始数据少于12条，说明没有更多数据了
    const [hasMore, setHasMore] = useState(initialSkills.length >= 12);
    const [offset, setOffset] = useState(12);
    const observerTarget = useRef<HTMLDivElement>(null);

    // 当分类改变时重置状态
    useEffect(() => {
        setSkills(initialSkills);
        setOffset(12);
        setHasMore(initialSkills.length >= 12);
        setIsLoading(false);
    }, [initialSkills, categorySlug]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            // ✅ 修复：构建 API URL 参数
            const params = new URLSearchParams();
            params.set('limit', '12');
            params.set('offset', offset.toString());
            if (categorySlug) params.set('categorySlug', categorySlug);

            // ✅ 修复：使用 fetch 调用 API Route
            const response = await fetch(`/api/skills?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 确保不缓存 API 请求，获取最新数据
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const newSkills: Skill[] = await response.json();

            if (newSkills && newSkills.length > 0) {
                setSkills((prev) => {
                    // 简单的去重逻辑，防止网络抖动导致重复
                    const existingIds = new Set(prev.map((s) => s.id));
                    const uniqueNewSkills = newSkills.filter((s) => !existingIds.has(s.id));
                    return [...prev, ...uniqueNewSkills];
                });
                setOffset((prev) => prev + 12);

                // 如果返回的数据少于请求的数量，说明到底了
                if (newSkills.length < 12) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load category skills:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [categorySlug, offset, isLoading, hasMore]);

    // Intersection Observer 监听滚动
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '200px' } // 提前 200px 预加载
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {skills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
            </div>

            {/* 加载触发器 (Sentinel) */}
            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8 w-full min-h-[60px]">
                    {isLoading ? (
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                        </div>
                    ) : (
                        <div className="h-10 w-full bg-transparent" />
                    )}
                </div>
            )}

            {!hasMore && skills.length > 0 && (
                <div className="text-center text-slate-400 dark:text-slate-600 py-12 text-sm tracking-widest uppercase font-mono border-t border-slate-100 dark:border-white/5 mt-4">
                    {t('grid.end_of_stream', language)}
                </div>
            )}
        </div>
    );
};

export default CategorySkillsList;