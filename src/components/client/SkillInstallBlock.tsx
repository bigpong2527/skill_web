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

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      setCopiedCmd(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptInstruction);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      setCopiedPrompt(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#080E1E] rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 space-y-4 font-mono text-xs shadow-xs">

      {/* 顶部：包管理器三选一切换 (npx / pnpm / bunx) */}
      <div className="flex items-center justify-between gap-2">
        <div role="tablist" aria-label="Package Manager" className="flex p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
          {PKG_MANAGERS.map((pkg) => (
            <button
              key={pkg.id}
              role="tab"
              aria-selected={selectedPkg === pkg.id}
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

        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready to run
        </span>
      </div>

      {/* 终端执行代码框 (点击任意区域即复制，提升 50%+ 转化阻力) */}
      <div className="space-y-2">
        <div
          onClick={copyCommand}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              copyCommand();
            }
          }}
          className={`group relative bg-slate-950 border rounded-xl p-3.5 text-xs text-emerald-400 cursor-pointer transition-all ${
            copiedCmd
              ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
              : 'border-slate-800 hover:border-blue-500/60 hover:bg-slate-900/90'
          }`}
          title="Click anywhere to copy install command"
        >
          <pre className="overflow-x-auto whitespace-pre-wrap break-all leading-relaxed font-mono pr-8 select-all">
{installCommand}
          </pre>

          {/* 右上角快捷复制浮动图标 */}
          <div className="absolute top-2.5 right-2.5 text-slate-400 group-hover:text-white transition-colors p-1 rounded-md bg-slate-800/60 group-hover:bg-slate-700/80">
            {copiedCmd ? (
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </div>
        </div>

        {/* 主动作 CTA 按钮 (强化即时反馈与下一步指引) */}
        <button
          onClick={copyCommand}
          className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            copiedCmd
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 scale-[0.99]'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
          }`}
        >
          {copiedCmd ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              <span>Copied! Paste &amp; Run in Terminal</span>
            </span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span>Copy Install Command</span>
            </>
          )}
        </button>
      </div>

      {/* 折叠备用通道：网页版 AI Chat 用户的专属引导 (ChatGPT / Claude.ai) */}
      <details className="group border-t border-slate-200/60 dark:border-white/5 pt-3 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center justify-between text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
          <span className="flex items-center gap-1.5 text-[11px] font-medium">
            <span>💬 Prompt for ChatGPT / Claude Chat</span>
          </span>
          <span className="text-slate-400 group-open:rotate-180 transition-transform text-[10px]">▼</span>
        </summary>

        <div className="pt-3 space-y-2">
          <div
            onClick={copyPrompt}
            role="button"
            tabIndex={0}
            className="group/prompt relative bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-[11px] text-slate-300 max-h-32 overflow-y-auto leading-relaxed cursor-pointer"
            title="Click to copy prompt"
          >
            <pre className="font-mono whitespace-pre-wrap break-all pr-6">
{promptInstruction}
            </pre>
          </div>
          <button
            onClick={copyPrompt}
            className={`w-full py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              copiedPrompt
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {copiedPrompt ? '✓ Copied Prompt! Paste into AI Chat' : 'Copy AI Chat Prompt'}
          </button>
        </div>
      </details>

    </div>
  );
}
