'use client';

import React, { useState, useEffect, useRef } from 'react';

const AGENTS = [
    { id: 'openclaw', name: 'OpenClaw', dir: '.openclaw', color: 'bg-orange-500' },
    { id: 'claude', name: 'Claude Code', dir: '.claude', color: 'bg-emerald-500' },
    { id: 'cursor', name: 'Cursor', dir: '.cursor', color: 'bg-blue-500' },
    { id: 'trae', name: 'Trae', dir: '.trae', color: 'bg-indigo-500' },
    { id: 'codex', name: 'Codex', dir: '.codex', color: 'bg-cyan-500' },
    { id: 'gemini', name: 'Antigravity', dir: '.gemini', color: 'bg-purple-500' },
    { id: 'other', name: 'Other', dir: '.agent', color: 'bg-slate-500' },
];

interface AgentConnectButtonProps {
    totalSkills: number;
}

export default function AgentConnectButton({ totalSkills }: AgentConnectButtonProps) {
    const [copiedAgent, setCopiedAgent] = useState<string | null>(null);
    const [os, setOs] = useState<'unix' | 'windows'>('unix');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const thousands = Math.floor(totalSkills / 1000);
    const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkills.toString();

    useEffect(() => {
        setOs(window.navigator.userAgent.toLowerCase().includes('win') ? 'windows' : 'unix');
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsSelectorOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopy = (agent: typeof AGENTS[0]) => {
        const dir = agent.dir;
        const cmd = os === 'windows'
            ? `$ErrorActionPreference = 'Stop'; $t = "$HOME\\${dir}\\skills\\skill-discovery"; if (Test-Path $t) { Write-Host "Already installed" } else { $tmp = "$env:TEMP\\sd_$(Get-Random)"; git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git $tmp; Push-Location $tmp; git sparse-checkout set skill-discovery; Pop-Location; New-Item -Force -Type Directory "$HOME\\${dir}\\skills" | Out-Null; Move-Item "$tmp\\skill-discovery" $t -Force; Remove-Item -Recurse -Force $tmp; Write-Host "✅ Search tool added" -F Green }`
            : `T="$HOME/${dir}/skills/skill-discovery"; if [ ! -d "$T" ]; then D=$(mktemp -d); git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git "$D" && (cd "$D" && git sparse-checkout set skill-discovery) && mkdir -p "$HOME/${dir}/skills" && mv "$D/skill-discovery" "$T"; rm -rf "$D"; echo "✅ Search tool added"; fi`;

        navigator.clipboard.writeText(cmd);
        setCopiedAgent(agent.name);
        setIsSelectorOpen(false);
        setTimeout(() => setCopiedAgent(null), 3000);
    };

    return (
        <div className="mt-6" ref={containerRef}>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Agent Skills Search Helper
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                    Install a tiny helper to your Agent, search and equip skill from {formattedCount}+ vetted skills library on demand.
                </p>

                <div className="relative">
                    <button
                        onClick={() => !copiedAgent && setIsSelectorOpen(!isSelectorOpen)}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${copiedAgent ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400'}`}
                    >
                        {copiedAgent ? "Success! Now Paste it" : "Add Search Tool to Agent"}
                        {!copiedAgent && <svg className={`w-3 h-3 opacity-50 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
                    </button>

                    {isSelectorOpen && (
                        <div className="absolute bottom-[110%] left-0 w-full mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 gap-1">
                                {AGENTS.map((agent) => (
                                    <button key={agent.id} onClick={() => handleCopy(agent)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        <span className={`w-1.5 h-1.5 rounded-full ${agent.color}`}></span>
                                        {agent.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
