import React from 'react';
import Link from 'next/link';
import { getHotSkills, getRecentSkills, getSkillsCount, getAllCategories } from '@/lib/db';
import SkillCard from '@/components/client/SkillCard';
import HomeHero from '@/components/client/HomeHero';
import HomeCategories from '@/components/client/HomeCategories';
import SectionHeader from '@/components/client/SectionHeader';
import WebSiteStructuredData from '@/components/WebSiteStructuredData';

export const runtime = 'edge';

export const revalidate = 3600;

export async function generateMetadata() {
    const totalSkills = await getSkillsCount();

    return {
        title: 'Claude Skills Library | skills.rest',
        // ✅ 更新 Description，使用动态数字
        description: `Instantly deploy ${totalSkills}+ Claude skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
        alternates: {
            canonical: '/',
        },
        openGraph: {
            title: 'Claude Skills Library | skills.rest',
            // ✅ 更新 OG Description
            description: `Instantly deploy ${totalSkills}+ Claude skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Claude Skills Library | skills.rest',
            // ✅ 更新 Twitter Description
            description: `Instantly deploy ${totalSkills}+ Claude skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
        },
    };
}

export default async function HomePage() {
    const [hotSkills, recentSkills, totalSkills, categories] = await Promise.all([
        getHotSkills(8),
        getRecentSkills(8),
        getSkillsCount(),
        getAllCategories()
    ]);

    return (
        <main className="min-h-screen pb-20 selection:bg-blue-500/30">
            <WebSiteStructuredData />

            <HomeHero totalSkills={totalSkills} />

            <div className="container mx-auto px-4">
                <HomeCategories categories={categories} />

                <section className="py-12 border-t border-slate-200 dark:border-white/5">
                    <SectionHeader
                        titleKey="home.trending.title"
                        linkTextKey="home.trending.view_all"
                        href="/explore?filter=hot"
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {hotSkills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </section>

                <section className="py-12 border-t border-slate-200 dark:border-white/5">
                    <SectionHeader
                        titleKey="home.fresh.title"
                        linkTextKey="home.trending.view_all"
                        href="/explore?filter=recent"
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {recentSkills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}