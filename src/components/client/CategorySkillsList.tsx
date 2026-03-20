'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import SkillCard from './SkillCard';
import { Skill } from '@/types';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface CategorySkillsListProps {
    initialSkills: Skill[];
    categorySlug: string;
}

const CategorySkillsList: React.FC<CategorySkillsListProps> = ({ initialSkills, categorySlug }) => {
    const { language } = useTheme();
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialSkills.length >= 12);
    const [offset, setOffset] = useState(12);
    const observerTarget = useRef<HTMLDivElement>(null);

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
            const params = new URLSearchParams();
            params.set('limit', '12');
            params.set('offset', offset.toString());
            if (categorySlug) params.set('categorySlug', categorySlug);

            const response = await fetch(`/api/skills?${params.toString()}`, {
                headers: { 'x-skills-client': 'web-app-v1' }
            });
            if (!response.ok) throw new Error('API Error');
            const newSkills: Skill[] = await response.json();

            if (newSkills && newSkills.length > 0) {
                setSkills((prev) => {
                    const existingIds = new Set(prev.map((s) => s.id));
                    return [...prev, ...newSkills.filter((s) => !existingIds.has(s.id))];
                });
                setOffset((prev) => prev + 12);
                if (newSkills.length < 12) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [categorySlug, offset, isLoading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) loadMore();
            },
            { threshold: 0.1, rootMargin: '200px' }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [hasMore, isLoading, loadMore]);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {skills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
            </div>
            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8 w-full min-h-[60px]">
                    {isLoading ? (
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    ) : <div className="h-10 w-full" />}
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
