'use client';

import React, { useState } from 'react';
import { Skill } from '@/types';

interface Props {
  skill: Skill;
}

const PKG_MANAGERS = [
  { id: 'npx', label: 'npx', cmd: 'npx' },
  { id: 'pnpm', label: 'pnpm', cmd: 'pnpm dlx' },
  { id: 'bunx', label: 'bunx', cmd: 'bunx' },
] as const;

export default function SkillInstallBlock({ skill }: Props) {
  const [selectedPkg, setSelectedPkg] = useState<string>('npx');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // 1. 标准化提取 GitHub 仓库根路径
  const getRepoRoot = (url?: string | null): string => {
    if (!url) return `https://github.com/${skill.author_name}/skills`;
    let clean = url.trim().split('?')[0].split('#')[0].replace(/\/$/, '');
    if (clean.endsWith('.git')) clean = clean.slice(0, -4);
    if (clean.includes('/tree/')) return clean.split('/tree/')[0];
    if (clean.includes('/blob/')) return clean.split('/blob/')[0];
    return clean;
  };

  const repoRoot = getRepoRoot(skill.source_url);
  const activePkgCmd = PKG_MANAGERS.find((p) => p.id === selectedPkg)?.cmd || 'npx';
  const installCommand = `${activePkgCmd} skills add ${repoRoot} --skill ${skill.slug}`;

  // 2. 结构化 Prompt
  const promptInstruction = `Please help me install this Agent Skill.
Skill: ${skill.name}
Source: ${skill.source_url || repoRoot}
Command: ${installCommand}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptInstruction);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#080E1E] rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 space-y-4 font-mono text-xs">

      {/* 顶部：包管理器三选一切换 (npx / pnpm / bunx) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
          {PKG_MANAGERS.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedPkg === pkg.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pkg.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400">One-click install</span>
      </div>

      {/* 终端执行代码框 (紧凑收敛，不拉长) */}
      <div className="space-y-2">
        <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
{installCommand}
        </pre>

        {/* 复制按钮 */}
        <button
          onClick={copyCommand}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {copiedCmd ? (
            <span>✓ Copied to Clipboard!</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span>Copy Install Command</span>
            </>
          )}
        </button>
      </div>

      {/* 折叠备用通道：复制结构化 Prompt */}
      <details className="group border-t border-slate-200/60 dark:border-white/5 pt-3 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center justify-between text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
          <span>Or copy as Structured Prompt for Agent</span>
          <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>

        <div className="pt-3 space-y-2">
          <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 max-h-32 overflow-y-auto leading-relaxed shadow-inner">
{promptInstruction}
          </pre>
          <button
            onClick={copyPrompt}
            className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold transition-all"
          >
            {copiedPrompt ? '✓ Copied Prompt!' : 'Copy Prompt'}
          </button>
        </div>
      </details>

    </div>
  );
}
