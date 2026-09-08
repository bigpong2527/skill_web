'use client';

import React, { useState } from 'react';

interface Props {
  formattedCount: string;
}

const AGENT_OPTIONS = [
  { id: 'claude', name: 'Claude Code', dir: '.claude' },
  { id: 'codex', name: 'Codex', dir: '.codex' },
  { id: 'cursor', name: 'Cursor', dir: '.cursor' },
  { id: 'trae', name: 'Trae', dir: '.trae' },
  { id: 'gemini', name: 'Gemini CLI', dir: '.gemini' },
  { id: 'agent', name: 'Other Agent', dir: '.agent' },
];

export default function SkillsSearchCliView({ formattedCount }: Props) {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_OPTIONS[0]);
  const [copiedSkill, setCopiedSkill] = useState(false);
  const [copiedRule, setCopiedRule] = useState(false);

  // 1. 生成准确的 npx 安装指令
  const npxCommand = `npx skills add https://github.com/WupDev/skills_discovery --skill skill-discovery -g -y`;

  // 2. SKILL.md 规范源码
  const skillMdContent = `---
name: skill-discovery
allowed-tools: Bash, Read, Write
description: MANDATORY:Use when lacking domain-specific capabilities in ANY field. Connects to ${formattedCount} vetted skills on skills.rest.
---

# Skill Discovery & Manager

## [STEP 1: QUERY GENERATION]
Construct a strict 3-sentence English declarative query:
1. S1 Problem: Action + Object (What problem does it solve).
2. S2 Context: Technical Scope & Scenario.
3. S3 Requirements: Specific libraries & methods.

## [STEP 2: SEARCH API]
curl -s -X POST https://search.skills.rest \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "<YOUR_GENERATED_QUERY>",
    "top_k": 5
  }'

## [STEP 3: CONFIRM & INSTALL]
1. Read returned JSON results.
2. Present best matches and ask user: "Which skill would you like to install?"
3. Execute chosen skill's install_command VERBATIM in terminal upon user approval.

## [STEP 4: ACTIVATION]
Inform user: "Skill [Name] installed and ready to use."`;

  // 3. 通用 Agent Rule (全 Agent 通用)
  const agentRuleText = `# Skill Discovery Rule (AGENTS.md / CLAUDE.md / .cursorrules)

When lacking domain-specific capabilities, autonomously find and install verified skills from skills.rest:

1. Formulate a strict 3-sentence English declarative query (Problem, Context, Requirements).
2. Query API via terminal:
   curl -s -X POST https://search.skills.rest -H "Content-Type: application/json" -d '{"query": "<YOUR_QUERY>", "top_k": 5}'
3. Present candidate matches to the user and ask: "Which skill would you like to install?"
4. Execute the returned \`install_command\` verbatim in your terminal upon user approval.`;

  const copySkill = () => {
    navigator.clipboard.writeText(npxCommand);
    setCopiedSkill(true);
    setTimeout(() => setCopiedSkill(false), 4000);
  };

  const copyRule = () => {
    navigator.clipboard.writeText(agentRuleText);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 4000);
  };

  return (
    <div className="space-y-10">
      
      {/* 头部标题与强化信任背书 */}
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Skills Search CLI
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Universal on-demand skill discovery for <strong className="text-slate-900 dark:text-slate-100 font-semibold">any AI agent</strong> across {formattedCount} verified skills.
          </p>
        </div>

        {/* 3 大核心安全信任徽章 (严格信用背书) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Security Audited
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 font-medium">
            Market-Validated Only
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-medium">
            Explicit User Confirmation
          </span>
        </div>
      </header>

      {/* 双配置卡片 */}
      <div className="space-y-6">
        
        {/* 卡片 1: Skills 版 (npx 指令 + 选择 Agent) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B1121] border border-slate-200/80 dark:border-white/10 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h2 className="font-bold text-base text-slate-900 dark:text-white">Option 1: Native Skill (npx CLI)</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Install directly into your agent's skill directory with a single terminal command.
              </p>
            </div>

            <button
              onClick={copySkill}
              className={`px-5 py-2.5 font-mono font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 text-white ${
                copiedSkill ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <span>{copiedSkill ? '✓ Copied!' : 'Copy npx Command'}</span>
            </button>
          </div>

          {/* Agent 选择器 */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Select your Agent:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Target: {selectedAgent.dir}/skills</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {AGENT_OPTIONS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    selectedAgent.id === agent.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>

          {/* 🌟 复制后的一句话清晰指引 */}
          {copiedSkill && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs font-mono text-blue-700 dark:text-blue-300 animate-in fade-in">
              👉 <strong>Next Step:</strong> Paste and run in your terminal. Restart your agent to activate.
            </div>
          )}

          {/* 折叠查看指令与 SKILL.md */}
          <details className="group text-xs font-mono border-t border-slate-100 dark:border-white/5 pt-3 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1">
              <span>Inspect generated command &amp; SKILL.md</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            
            <div className="space-y-3 pt-3">
              <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
{npxCommand}
              </pre>

              <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 leading-relaxed shadow-inner">
{skillMdContent}
              </pre>
            </div>
          </details>
        </div>

        {/* 卡片 2: Agent Rule 版 (AGENTS.md / CLAUDE.md / .cursorrules) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B1121] border border-slate-200/80 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <h2 className="font-bold text-base text-slate-900 dark:text-white">Option 2: Universal Agent Rule</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero installation. Universal for <strong className="text-slate-700 dark:text-slate-300">all AI agents</strong> (Cursor, Windsurf, Claude, ChatGPT, Codex).
              </p>
            </div>

            <button
              onClick={copyRule}
              className={`px-5 py-2.5 font-mono font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 text-white ${
                copiedRule ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <span>{copiedRule ? '✓ Copied!' : 'Copy Agent Rule'}</span>
            </button>
          </div>

          {/* 🌟 复制后的一句话清晰指引 */}
          {copiedRule && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs font-mono text-purple-700 dark:text-purple-300 animate-in fade-in">
              👉 <strong>Next Step:</strong> Append to <strong>AGENTS.md</strong>, <strong>CLAUDE.md</strong>, or <strong>.cursorrules</strong> in your project root.
            </div>
          )}

          {/* 折叠查看规则文本 */}
          <details className="group text-xs font-mono border-t border-slate-100 dark:border-white/5 pt-3 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1">
              <span>View rule prompt text</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            
            <pre className="mt-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
{agentRuleText}
            </pre>
          </details>
        </div>

      </div>

      {/* 深度安全评估与信用背书 */}
      <footer className="pt-6 border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-500 leading-relaxed space-y-2.5">
        <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200 font-bold">
          <span>🛡️</span>
          <span>Security Assessment &amp; Quality Guarantee</span>
        </div>
        <p className="font-light leading-relaxed">
          Every skill in the registry undergoes multi-layer automated security screening before ingestion. The discovery tool operates strictly within your local environment, never transmits private code, and mandates explicit user confirmation before executing any installation script.
        </p>
      </footer>

    </div>
  );
}