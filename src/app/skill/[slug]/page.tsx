import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSkillBySlug, getSkillCategories, getSkillKeywords, getSkillsMaxId } from '@/lib/db';
import { safeParseJsonArray } from '@/lib/utils';
import { t } from '@/lib/i18n';
import InstallGuide from '@/components/client/InstallGuide';
import MarkdownView from '@/components/server/MarkdownView';
import NavigationBar from '@/components/client/NavigationBar';
import StructuredData from '@/components/StructuredData';
import AgentConnectButton from '@/components/client/AgentConnectButton';

export const runtime = 'edge';
export const revalidate = 31536000;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const skill = await getSkillBySlug(slug);

    if (!skill) {
        return {
            title: '404 - Skill Not Found | skills.rest',
            description: 'The requested skill could not be found.',
            robots: { index: false, follow: false },
        };
    }

    const categories = await getSkillCategories(skill.id);
    const primaryCategory = categories[0];
    const problemSolutionStatement = skill.tagline ? skill.tagline.replace(/\.$/, '') : `A powerful skill for ${skill.name}`;
    
    // ✅ 修复：使用硬编码的生产环境域名，确保 Canonical 绝对准确
    const baseUrl = 'https://skills.rest';

    return {
        title: `${skill.name}: ${problemSolutionStatement} | skills.rest`,
        description: `Use the ${skill.name} skill to effortlessly ${problemSolutionStatement.toLowerCase()}. A reliable, executable skill for Claude, contributed by ${skill.author_name}${primaryCategory ? `, designed for ${primaryCategory.name} workflows` : ''}.`,
        alternates: { 
            canonical: `${baseUrl}/skill/${skill.slug}` 
        },
        openGraph: {
            title: `${skill.name}: ${problemSolutionStatement}`,
            description: skill.tagline || problemSolutionStatement,
            type: 'website',
            url: `${baseUrl}/skill/${skill.slug}`,
            images: [{ url: '/og-image.png', width: 1200, height: 630, alt: skill.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${skill.name}: ${problemSolutionStatement}`,
            description: skill.tagline || problemSolutionStatement,
            images: ['/og-image.png'],
        },
    };
}

export default async function SkillDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const skill = await getSkillBySlug(slug);

    if (!skill) {
        notFound();
    }

    const [categories, keywords, totalSkills] = await Promise.all([
        getSkillCategories(skill.id),
        getSkillKeywords(skill.id),
        getSkillsMaxId()
    ]);

    const dependencies = safeParseJsonArray(skill.dependencies);
    const components = safeParseJsonArray(skill.components);
    const language = 'en';

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Official':
                return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'Partner':
                return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
            <StructuredData skill={skill} categories={categories} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <NavigationBar
                    skillName={skill.name}
                    categoryName={categories[0] ? t(`category.${categories[0].slug} `, language) : undefined}
                    categorySlug={categories[0]?.slug}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 p-8 shadow-sm dark:shadow-none">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{skill.name}</h1>
                                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(skill.author_type)} `}>
                                    {skill.author_type}
                                </span>
                            </div>

                            <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-6">{skill.tagline}</p>

                            {(categories.length > 0 || keywords.length > 0) && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {categories.map((c) => (
                                        <Link key={c.id} href={`/category/${c.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getBadgeColor(c.slug) }} />
                                            <span>{c.name}</span>
                                        </Link>
                                    ))}
                                    {keywords.map((k) => (
                                        <Link key={k.id} href={`/explore?q=${encodeURIComponent(k.name)}`} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-500 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            #{k.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-sm border-t border-slate-100 dark:border-white/5 pt-6 font-mono text-slate-500">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600">{t('skill.author', language)}</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{skill.author_name}</span>
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-white/5"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600">{t('skill.version', language)}</span>
                                    <span className="text-slate-700 dark:text-slate-300">{skill.version}</span>
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-white/5"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600">{t('skill.installs', language)}</span>
                                    <span className="text-slate-700 dark:text-slate-300">{skill.downloads}</span>
                                </div>
                                {skill.ratings_count > 0 && (
                                    <>
                                        <div className="w-px h-8 bg-slate-200 dark:bg-white/5"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600">{t('skill.rating', language)}</span>
                                            <span className="text-yellow-500">{skill.rating.toFixed(1)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 p-8 shadow-sm dark:shadow-none">
                            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {t('skill.system_docs', language)}
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <MarkdownView content={skill.description} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 p-8 shadow-sm dark:shadow-none">
                            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-6">{t('skill.dependency_matrix', language)}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('skill.required_modules', language)}</h3>
                                    {dependencies.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {dependencies.map((dep: string, idx: number) => (
                                                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                                                    {dep}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-600 italic">{t('skill.none_required', language)}</span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('skill.components', language)}</h3>
                                    {components.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {components.map((comp: string, idx: number) => (
                                                <span key={idx} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-900/20 rounded text-xs font-mono">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-600 italic">{t('skill.standard_pkg', language)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <section aria-label="Installation Guide" className="bg-white dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 p-1 shadow-xl dark:shadow-blue-900/5">
                                <InstallGuide skill={skill} />
                            </section>

                            {skill.source_url && (
                                <a
                                    href={skill.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-200 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all text-sm font-medium group"
                                >
                                    <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    <span>{t('skill.view_source', language)}</span>
                                </a>
                            )}
                            <AgentConnectButton totalSkills={totalSkills} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
