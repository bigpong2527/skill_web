'use client';

import React, { useState } from 'react';
import AnimatedCounter from '@/components/client/AnimatedCounter';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface HomeHeroProps {
    totalSkills: number;
}

const HomeHero: React.FC<HomeHeroProps> = ({ totalSkills }) => {
    const { language } = useTheme();
    const [copied, setCopied] = useState(false);

    // 带有注释的安全安装指令
    const installCommand = `# Install Skills Discovery (Safe Mode: Anti-overwrite, Sparse Checkout)\nTARGET="$HOME/.claude/skills/skill-discovery"; if [ -d "$TARGET" ]; then echo "⚠️ Target exists. Please remove it first."; else rm -rf /tmp/skill_discovery_tmp && mkdir -p "$HOME/.claude/skills" && git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git /tmp/skill_discovery_tmp && (cd /tmp/skill_discovery_tmp && git sparse-checkout set skill-discovery) && mv /tmp/skill_discovery_tmp/skill-discovery "$TARGET" && rm -rf /tmp/skill_discovery_tmp && echo "✅ Installed! Please restart your Agent."; fi`;

    const handleCopy = () => {
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        // 延长显示时间到 3 秒，确保用户看清指引
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <section className="relative pt-24 pb-8 lg:pt-36 lg:pb-12 border-b border-slate-200 dark:border-white/5 overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
            {/* Background Glows */}
            <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="hidden md:block absolute top-[20%] left-[10%] w-72 h-72 bg-emerald-100/50 dark:bg-emerald-900/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 text-center z-10 flex flex-col items-center">

                <h1 className="mb-10 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                    {t('home.hero.title', language)}
                </h1>

                {/* ✅ The "Magic" Button Area */}
                <div className="mb-12 flex flex-col items-center gap-5 w-full max-w-lg">
                    <button
                        onClick={handleCopy}
                        className={`
                            group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-lg font-medium transition-all duration-300 w-auto mx-auto
                            ${copied
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-95'
                                : 'bg-white dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-500/30 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)] hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {/* Subtle Glow Effect */}
                        {!copied && (
                            <div className="absolute inset-0 rounded-full bg-blue-400/5 dark:bg-blue-400/10 animate-pulse-slow pointer-events-none"></div>
                        )}

                        {copied ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>{t('home.hero.btn.copied', language)}</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                
                                <div className="flex items-center gap-2">
                                    <span className="font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <AnimatedCounter end={totalSkills > 0 ? totalSkills : 500} />
                                    </span>
                                    <span className="group-hover:hidden transition-opacity duration-200">
                                        {t('home.hero.btn.standby', language)}
                                    </span>
                                    <span className="hidden group-hover:inline text-blue-600 dark:text-blue-400 font-semibold animate-in fade-in slide-in-from-bottom-1 duration-200">
                                        {t('home.hero.btn.hover', language)}
                                    </span>
                                </div>

                                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </>
                        )}
                    </button>

                    {/* ✅ 交互式信息栏：在“背书标签”和“操作指引”之间切换 */}
                    <div className="relative h-6 w-full">
                        
                        {/* 状态 A: 默认显示背书标签 (Safe, Light, Free) */}
                        <div className={`absolute inset-0 flex flex-wrap justify-center gap-3 sm:gap-6 transition-all duration-300 ${copied ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                {t('home.hero.trust.safe', language)}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                {t('home.hero.trust.light', language)}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                                {t('home.hero.trust.free', language)}
                            </span>
                        </div>

                        {/* 状态 B: 复制后显示操作指引 */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                                {t('home.hero.instruction.paste', language)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Central Search Bar */}
                <form action="/explore" className="w-full max-w-2xl mx-auto mb-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <svg className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            name="q"
                            className="block w-full h-[60px] pl-16 pr-32 text-lg text-slate-900 dark:text-white bg-white dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/10 rounded-full placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#0F172A] backdrop-blur-xl transition-all shadow-xl dark:shadow-none"
                            placeholder={t('home.hero.search_placeholder', language)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors shadow-lg shadow-blue-900/20"
                        >
                            {t('home.hero.search_btn', language)}
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
};

export default HomeHero;
