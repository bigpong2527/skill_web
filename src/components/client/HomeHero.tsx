'use client';

import React, { useState, useEffect } from 'react';
import AnimatedCounter from '@/components/client/AnimatedCounter';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

interface HomeHeroProps {
    totalSkills: number;
}

type OSType = 'unix' | 'windows';

const HomeHero: React.FC<HomeHeroProps> = ({ totalSkills }) => {
    const { language } = useTheme();
    const [copied, setCopied] = useState(false);
    const [os, setOs] = useState<OSType>('unix');

    // 1. 自动检测用户操作系统 (无感检测)
    useEffect(() => {
        const detectOS = (): OSType => {
            // 优先使用现代 Client Hints API
            // @ts-ignore
            if (typeof navigator !== 'undefined' && (navigator as any).userAgentData?.platform) {
                // @ts-ignore
                const platform = (navigator as any).userAgentData.platform.toLowerCase();
                if (platform.includes('win')) return 'windows';
                return 'unix';
            }
            // 回退到 User Agent 检测
            if (typeof window !== 'undefined') {
                const userAgent = window.navigator.userAgent.toLowerCase();
                if (userAgent.includes('win')) return 'windows';
            }
            return 'unix';
        };
        setOs(detectOS());
    }, []);

    // ✅ [Bash] 优化版：使用 mktemp 随机目录，增加结构校验
    const installCmdUnix = `TARGET="$HOME/.claude/skills/skill-discovery"; if [ -d "$TARGET" ]; then echo "⚠️ Target exists. Please remove it first."; else T=$(mktemp -d); mkdir -p "$HOME/.claude/skills" && echo "⏳ Downloading..." && git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git "$T" && (cd "$T" && git sparse-checkout set skill-discovery) && if [ -d "$T/skill-discovery" ]; then mv "$T/skill-discovery" "$TARGET" && echo "✅ Installed! Please restart your Agent."; else echo "❌ Error: Repo structure mismatch."; fi; rm -rf "$T"; fi`;

    // ✅ [PowerShell] 优化版：使用 Get-Random 随机目录，Push/Pop-Location 保护上下文，LASTEXITCODE 校验 Git
    const installCmdWin = `$ErrorActionPreference = 'Stop'; $t = "$HOME\\.claude\\skills\\skill-discovery"; if (Test-Path $t) { Write-Host "⚠️ Target exists. Please remove it first." -F Yellow } else { $tmp = "$env:TEMP\\skill_d_$(Get-Random)"; New-Item -Force -Type Directory "$HOME\\.claude\\skills" | Out-Null; Write-Host "⏳ Downloading..." -F Cyan; git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git $tmp; if ($LASTEXITCODE -eq 0) { Push-Location $tmp; git sparse-checkout set skill-discovery; if (Test-Path "skill-discovery") { Pop-Location; Move-Item "$tmp\\skill-discovery" $t -Force; Write-Host "✅ Installed! Please restart your Agent." -F Green } else { Pop-Location; Write-Host "❌ Error: Repo structure mismatch." -F Red } } else { Write-Host "❌ Git clone failed." -F Red }; Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }`;

    const handleCopy = () => {
        const textToCopy = os === 'windows' ? installCmdWin : installCmdUnix;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
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
                <div className="mb-12 flex flex-col items-center gap-5 w-full max-w-2xl">
                    <button
                        onClick={handleCopy}
                        className={`
                            group relative flex items-center justify-center rounded-full font-medium transition-all duration-300 w-auto mx-auto
                            ${copied
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-95 px-10 py-5'
                                : 'bg-white dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-500/30 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 px-10 py-5'
                            }
                        `}
                    >
                        {/* Subtle Glow Effect */}
                        {!copied && (
                            <div className="absolute inset-0 rounded-full bg-blue-400/5 dark:bg-blue-400/10 animate-pulse-slow pointer-events-none"></div>
                        )}

                        {copied ? (
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="font-bold text-xl">
                                    {os === 'windows' 
                                        ? t('home.hero.btn.copied.windows', language) 
                                        : t('home.hero.btn.copied.unix', language)
                                    }
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                {/* Left: Action Text (No Icon) */}
                                <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                                    {t('home.hero.btn.action', language)}
                                </span>

                                {/* Divider */}
                                <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>

                                {/* Right: Value/Count */}
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-2xl group-hover:text-blue-500 transition-colors">
                                        <AnimatedCounter end={totalSkills > 0 ? totalSkills : 500} />
                                    </span>
                                    <span className="text-base font-medium pt-1">
                                        {t('home.hero.btn.value_suffix', language)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </button>

                    {/* 交互式信息栏 */}
                    <div className="relative h-6 w-full">
                        
                        {/* 状态 A: 信任背书 */}
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

                        {/* 状态 B: 粘贴指引 */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse flex items-center gap-2">
                                {os === 'windows' ? (
                                    <>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
                                        {t('home.hero.instruction.paste.windows', language)}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {t('home.hero.instruction.paste.unix', language)}
                                    </>
                                )}
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
