'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Skill } from '@/types';
import SkillCard from '@/components/client/SkillCard';
import OpenClawInstallButton from '@/components/client/OpenClawInstallButton';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

const TRUST_ITEMS = [
    { num: '01', border: 'border-orange-500', numClass: 'text-orange-500/20 dark:text-orange-400/20', titleKey: 'openclaw.trust.p1.title', descKey: 'openclaw.trust.p1' },
    { num: '02', border: 'border-emerald-500', numClass: 'text-emerald-500/20 dark:text-emerald-400/20', titleKey: 'openclaw.trust.p2.title', descKey: 'openclaw.trust.p2' },
    { num: '03', border: 'border-blue-500', numClass: 'text-blue-500/20 dark:text-blue-400/20', titleKey: 'openclaw.trust.p3.title', descKey: 'openclaw.trust.p3' },
];

interface Props {
    hotSkills: Skill[];
    totalSkills: number;
}

export default function OpenClawPageContent({ hotSkills, totalSkills }: Props) {
    const { language } = useTheme();
    const trustAnim = useInView();
    const baAnim = useInView();

    const thousands = Math.floor(totalSkills / 1000);
    const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000+` : `${totalSkills}+`;

    const STATS = [
        { value: formattedCount, label: t('openclaw.stats.label.skills', language) },
        { value: t('openclaw.stats.value.trusted', language), label: t('openclaw.stats.label.trusted', language) },
        { value: t('openclaw.stats.value.response', language), label: t('openclaw.stats.label.response', language) },
        { value: t('openclaw.stats.value.reviewed', language), label: t('openclaw.stats.label.reviewed', language) },
    ];

    const STEPS = [
        { n: '1', title: t('openclaw.step1.title', language), desc: t('openclaw.step1.desc', language) },
        { n: '2', title: t('openclaw.step2.title', language), desc: t('openclaw.step2.desc', language) },
        { n: '3', title: t('openclaw.step3.title', language), desc: t('openclaw.step3.desc', language).replace('{count}', formattedCount) },
    ];

    return (
        <main className="min-h-screen pb-20 selection:bg-orange-500/30">

            {/* ── Hero ── */}
            <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-20 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-transparent overflow-hidden">
                <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-100/60 dark:bg-orange-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="hidden md:block absolute top-[20%] right-[8%] w-64 h-64 bg-amber-100/50 dark:bg-amber-900/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative container mx-auto px-4 text-center z-10 flex flex-col items-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200/60 dark:border-orange-500/20 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        {t('openclaw.hero.eyebrow', language)}
                    </div>

                    <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                        OpenClaw <span className="text-orange-500">Skills</span> Library
                    </h1>

                    <p className="mb-12 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        {formattedCount} {t('openclaw.hero.subtitle1', language)}<br className="hidden sm:block" />
                        {t('openclaw.hero.subtitle2', language)}
                    </p>

                    <OpenClawInstallButton />
                </div>
            </section>

            {/* ── Trust Bar ── */}
            <section className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="flex flex-col items-center gap-1">
                                <span className="text-2xl font-bold text-orange-500">{value}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4">

                {/* ── Trust / Safety ── */}
                <section className="py-24 border-b border-slate-200 dark:border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {t('openclaw.trust.title', language)}
                            </h2>
                        </div>
                        <div ref={trustAnim.ref} className="divide-y divide-slate-100 dark:divide-white/5">
                            {TRUST_ITEMS.map(({ num, border, numClass, titleKey, descKey }, i) => (
                                <div
                                    key={num}
                                    className="py-10 flex items-start gap-8"
                                    style={{
                                        opacity: trustAnim.inView ? 1 : 0,
                                        transform: trustAnim.inView ? 'translateY(0)' : 'translateY(40px)',
                                        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                                        transitionDelay: trustAnim.inView ? `${300 + i * 180}ms` : '0ms',
                                    }}
                                >
                                    <span className={`text-5xl font-bold font-mono shrink-0 leading-none select-none ${numClass}`}>{num}</span>
                                    <div className={`border-l-2 ${border} pl-7`}>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t(titleKey, language)}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{t(descKey, language)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Before / After ── */}
                <section className="py-24 border-b border-slate-200 dark:border-white/5">
                    <div ref={baAnim.ref} className="max-w-4xl mx-auto space-y-3">
                        <div
                            className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 px-8 py-10 md:px-12"
                            style={{
                                opacity: baAnim.inView ? 1 : 0,
                                transform: baAnim.inView ? 'translateY(0)' : 'translateY(40px)',
                                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                                transitionDelay: '300ms',
                            }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">{t('openclaw.before_after.before_label', language)}</p>
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t('openclaw.before_after.before_text', language)}</p>
                        </div>
                        <div
                            className="flex justify-center py-1"
                            style={{
                                opacity: baAnim.inView ? 1 : 0,
                                transition: 'opacity 0.4s ease-out',
                                transitionDelay: '700ms',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-300 dark:text-slate-600">
                                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div
                            className="relative rounded-2xl bg-white dark:bg-slate-900/60 border border-orange-200/60 dark:border-orange-500/20 px-8 py-10 md:px-12 overflow-hidden"
                            style={{
                                opacity: baAnim.inView ? 1 : 0,
                                transform: baAnim.inView ? 'translateY(0)' : 'translateY(40px)',
                                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                                transitionDelay: '1000ms',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-transparent dark:from-orange-950/20 dark:to-transparent pointer-events-none" />
                            <p className="relative text-xs font-semibold uppercase tracking-widest text-orange-500 mb-5">{t('openclaw.before_after.after_label', language)}</p>
                            <p className="relative text-xl font-semibold text-slate-900 dark:text-white leading-relaxed">{t('openclaw.before_after.after_text', language)}</p>
                        </div>
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section className="py-16 border-b border-slate-200 dark:border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('openclaw.how.title', language)}</h2>
                        <p className="mt-3 text-slate-500 dark:text-slate-400">{t('openclaw.how.subtitle', language).replace('{count}', formattedCount)}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {STEPS.map(({ n, title, desc }) => (
                            <div key={n} className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                                    {n}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Skills Showcase ── */}
                <section className="py-16 border-b border-slate-200 dark:border-white/5">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('openclaw.showcase.title', language)}</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('openclaw.showcase.subtitle', language)}</p>
                        </div>
                        <Link href="/explore" className="text-sm font-mono text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 shrink-0">
                            {t('openclaw.showcase.browse', language)} {formattedCount} <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hotSkills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </section>

            </div>

            {/* ── Bottom CTA ── */}
            <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 border-t border-orange-100 dark:border-orange-900/20">
                <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                            {t('openclaw.cta.title', language)}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                            {t('openclaw.cta.desc', language)}
                        </p>
                    </div>
                    <OpenClawInstallButton />
                </div>
            </section>

        </main>
    );
}
