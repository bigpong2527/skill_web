import React from 'react';
import Link from 'next/link';
import { getHotSkills, getRecentSkills, getAllCategories, getSkillsMaxId } from '@/lib/db'; 
import SkillCard from '@/components/client/SkillCard';
import HomeHero from '@/components/client/HomeHero';
import HomeCategories from '@/components/client/HomeCategories';
import SectionHeader from '@/components/client/SectionHeader';
import WebSiteStructuredData from '@/components/WebSiteStructuredData';
import { Metadata } from 'next'; 

export const runtime = 'edge';

// 启用 ISR 缓存，降低 D1 读取次数
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    // 使用 getSkillsMaxId 获取历史最大 ID (28810)
    const totalSkills = await getSkillsMaxId();

    return {
        title: 'Agent skills Library | skills.rest',
        description: `Instantly deploy ${totalSkills}+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.rest'),
        alternates: {
            canonical: '/',
        },
        openGraph: {
            title: 'Agent skills Library | skills.rest',
            description: `Instantly deploy ${totalSkills}+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
            url: 'https://skills.rest',
            siteName: 'skills.rest',
            type: 'website',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'Agent skills Library',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Agent skills Library | skills.rest',
            description: `Instantly deploy ${totalSkills}+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.`,
            images: ['/og-image.png'],
        },
    };
}

export default async function HomePage() {
    // 使用 getSkillsMaxId 替代 getSkillsCount 来获取展示总数
    const [hotSkills, recentSkills, totalSkills, categories] = await Promise.all([
        getHotSkills(8),
        getRecentSkills(8),
        getSkillsMaxId(), // <--- 使用历史最大 ID
        getAllCategories()
    ]);

    return (
        <main className="min-h-screen pb-20 selection:bg-blue-500/30">
            <WebSiteStructuredData />

            <HomeHero totalSkills={totalSkills} />

            <div className="container mx-auto px-4">
                <HomeCategories categories={categories} />

                {/* ✅ 添加了 data-nosnippet，阻止谷歌抓取这里的碎片词汇作为搜索摘要 */}
                <section data-nosnippet className="py-12 border-t border-slate-200 dark:border-white/5">
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

                {/* ✅ 添加了 data-nosnippet，阻止谷歌抓取这里的碎片词汇作为搜索摘要 */}
                <section data-nosnippet className="py-12 border-t border-slate-200 dark:border-white/5">
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
