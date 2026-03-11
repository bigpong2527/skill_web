'use client';

import React, { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { useTheme } from '@/components/providers/ThemeContext';

type OSType = 'unix' | 'windows';

const getInstallCommand = (os: OSType): string => {
    const dir = '.openclaw';
    if (os === 'windows') {
        return `$ErrorActionPreference = 'Stop'; $t = "$HOME\\${dir}\\skills\\skill-discovery"; if (Test-Path $t) { Write-Host "⚠️ Target exists. Please remove it first." -F Yellow } else { $tmp = "$env:TEMP\\skill_d_$(Get-Random)"; New-Item -Force -Type Directory "$HOME\\${dir}\\skills" | Out-Null; Write-Host "⏳ Downloading..." -F Cyan; git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git $tmp; if ($LASTEXITCODE -eq 0) { Push-Location $tmp; git sparse-checkout set skill-discovery; if (Test-Path "skill-discovery") { Pop-Location; Move-Item "$tmp\\skill-discovery" $t -Force; Write-Host "✅ Installed!" -F Green; openclaw skills refresh } else { Pop-Location; Write-Host "❌ Error: Repo structure mismatch." -F Red } } else { Write-Host "❌ Git clone failed." -F Red }; Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }`;
    }
    return `TARGET="$HOME/${dir}/skills/skill-discovery"; if [ -d "$TARGET" ]; then echo "⚠️ Target exists. Please remove it first."; else T=$(mktemp -d); mkdir -p "$HOME/${dir}/skills" && echo "⏳ Downloading..." && git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git "$T" && (cd "$T" && git sparse-checkout set skill-discovery) && if [ -d "$T/skill-discovery" ]; then mv "$T/skill-discovery" "$TARGET" && echo "✅ Installed!" && openclaw skills refresh; else echo "❌ Error: Repo structure mismatch."; fi; rm -rf "$T"; fi`;
};

export default function OpenClawInstallButton() {
    const { language } = useTheme();
    const [copied, setCopied] = useState(false);
    const [os, setOs] = useState<OSType>('unix');

    useEffect(() => {
        const detect = (): OSType => {
            if (typeof navigator !== 'undefined') {
                // @ts-ignore
                const platform = (navigator as any).userAgentData?.platform?.toLowerCase() || navigator.userAgent.toLowerCase();
                if (platform.includes('win')) return 'windows';
            }
            return 'unix';
        };
        setOs(detect());
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(getInstallCommand(os));
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const trustBadges = [
        { color: 'bg-emerald-500', labelKey: 'home.hero.trust.safe' },
        { color: 'bg-orange-500', labelKey: 'home.hero.trust.light' },
        { color: 'bg-amber-500', labelKey: 'home.hero.trust.free' },
    ];

    return (
        <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
            {/* OS Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-xs font-medium">
                <button
                    onClick={() => setOs('unix')}
                    className={`px-4 py-1.5 rounded-full transition-all ${os === 'unix' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    {t('openclaw.btn.os.unix', language)}
                </button>
                <button
                    onClick={() => setOs('windows')}
                    className={`px-4 py-1.5 rounded-full transition-all ${os === 'windows' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    {t('openclaw.btn.os.windows', language)}
                </button>
            </div>

            {/* Main Button */}
            <button
                onClick={handleCopy}
                className={`
                    group relative flex items-center justify-center rounded-full font-medium transition-all duration-300 w-auto mx-auto px-10 py-5
                    ${copied
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-95'
                        : 'bg-white dark:bg-slate-900/80 border border-orange-200/60 dark:border-orange-500/30 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] hover:-translate-y-0.5'
                    }
                `}
            >
                {!copied && (
                    <div className="absolute inset-0 rounded-full bg-orange-400/5 dark:bg-orange-400/10 animate-pulse-slow pointer-events-none"></div>
                )}

                {copied ? (
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold text-xl">{t('openclaw.btn.copied', language)}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                            {t('openclaw.btn.action', language)}
                        </span>
                        <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                        <span className="font-mono font-bold text-orange-500 dark:text-orange-400 text-lg">
                            {t('openclaw.btn.value', language)}
                        </span>
                    </div>
                )}
            </button>

            {/* Status line */}
            <div className="relative h-6 w-full">
                <div className={`absolute inset-0 flex flex-wrap justify-center gap-3 sm:gap-6 transition-all duration-300 ${copied ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                    {trustBadges.map(({ color, labelKey }) => (
                        <span key={labelKey} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_rgba(249,115,22,0.5)]`}></span>
                            {t(labelKey, language)}
                        </span>
                    ))}
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 animate-pulse flex items-center gap-2">
                        {os === 'windows' ? (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" /></svg>
                                {t('openclaw.btn.paste.windows', language)}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {t('openclaw.btn.paste.unix', language)}
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
