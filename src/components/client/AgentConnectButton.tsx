'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

// ✅ 严格将 Claude Code 与 Codex 放在最前列
const AGENTS = [
  { id: 'claude', name: 'Claude Code', dir: '.claude', color: 'bg-emerald-500' },
  { id: 'codex', name: 'Codex', dir: '.codex', color: 'bg-cyan-500' },
  { id: 'openclaw', name: 'OpenClaw', dir: '.openclaw', color: 'bg-orange-500' },
  { id: 'cursor', name: 'Cursor', dir: '.cursor', color: 'bg-blue-500' },
  { id: 'trae', name: 'Trae', dir: '.trae', color: 'bg-indigo-500' },
  { id: 'gemini', name: 'Antigravity', dir: '.gemini', color: 'bg-purple-500' },
  { id: 'other', name: 'Other Agent', dir: '.agent', color: 'bg-slate-500' },
];

interface AgentConnectButtonProps {
  totalSkills?: number;
}

type OSType = 'unix' | 'windows';

export default function AgentConnectButton({ totalSkills = 645954 }: AgentConnectButtonProps) {
  const { language } = useTheme();
  const [copiedAgent, setCopiedAgent] = useState<string | null>(null);
  const [os, setOs] = useState<OSType>('unix');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 自动检测用户操作系统
  useEffect(() => {
    const detectOS = (): OSType => {
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.includes('win')) return 'windows';
      }
      return 'unix';
    };
    setOs(detectOS());

    // 点击外部区域自动收起菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. 完整保留源代码中的全套安全命令逻辑 (零删减)
  const getInstallCommand = (dirName: string): string => {
    if (os === 'windows') {
      return `$ErrorActionPreference = 'Stop'; $t = "$HOME\\${dirName}\\skills\\skill-discovery"; if (Test-Path $t) { Write-Host "⚠️ Target exists. Please remove it first." -F Yellow } else { $tmp = "$env:TEMP\\skill_d_$(Get-Random)"; New-Item -Force -Type Directory "$HOME\\${dirName}\\skills" | Out-Null; Write-Host "⏳ Downloading..." -F Cyan; git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git $tmp; if ($LASTEXITCODE -eq 0) { Push-Location $tmp; git sparse-checkout set skill-discovery; if (Test-Path "skill-discovery") { Pop-Location; Move-Item "$tmp\\skill-discovery" $t -Force; Write-Host "✅ Installed! Please restart your Agent." -F Green } else { Pop-Location; Write-Host "❌ Error: Repo structure mismatch." -F Red } } else { Write-Host "❌ Git clone failed." -F Red }; Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }`;
    }
    return `TARGET="$HOME/${dirName}/skills/skill-discovery"; if [ -d "$TARGET" ]; then echo "⚠️ Target exists. Please remove it first."; else T=$(mktemp -d); mkdir -p "$HOME/${dirName}/skills" && echo "⏳ Downloading..." && git clone --depth 1 --filter=blob:none --sparse https://github.com/WupDev/skills_discovery.git "$T" && (cd "$T" && git sparse-checkout set skill-discovery) && if [ -d "$T/skill-discovery" ]; then mv "$T/skill-discovery" "$TARGET" && echo "✅ Installed! Please restart your Agent."; else echo "❌ Error: Repo structure mismatch."; fi; rm -rf "$T"; fi`;
  };

  // 3. 点击选择 Agent 复制命令
  const handleSelectAgent = (agent: typeof AGENTS[0]) => {
    const cmd = getInstallCommand(agent.dir);
    navigator.clipboard.writeText(cmd);
    setCopiedAgent(agent.name);
    setIsSelectorOpen(false);

    // 3 秒后恢复默认状态
    setTimeout(() => {
      setCopiedAgent(null);
    }, 3000);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* 核心胶囊按钮 */}
      <button
        type="button"
        onClick={() => !copiedAgent && setIsSelectorOpen(!isSelectorOpen)}
        className={`group flex items-center justify-between gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm border ${
          copiedAgent
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20 scale-[0.98]'
            : 'bg-white dark:bg-[#0B1121] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
        title="Connect Skills Search Helper to your Agent"
      >
        {copiedAgent ? (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold">{t('agent.copied_prefix', language)} {copiedAgent}!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
            <span className="font-bold tracking-tight">{t('agent.connect_btn', language)}</span>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                isSelectorOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>

      {/* 平滑下拉菜单 (无任何打断注意力的全屏 Modal) */}
      {isSelectorOpen && !copiedAgent && (
        <div className="absolute right-0 top-[115%] w-[260px] bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/50">
            <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
              {t('agent.select_title', language)}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Copy auto-discovery script for {os === 'windows' ? 'PowerShell' : 'Terminal'}.
            </p>
          </div>

          <div className="p-1.5 space-y-0.5">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelectAgent(agent)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${agent.color} shrink-0 group-hover:scale-125 transition-transform`}></span>
                  <span className="font-semibold">{agent.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 group-hover:text-blue-500">
                  {agent.dir}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}