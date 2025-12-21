'use client';

import React, { useState } from 'react';
import { useEnvironment } from '@/components/providers/EnvironmentContext';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';
import { Skill, EnvironmentType } from '@/types';

interface InstallGuideProps {
  skill: Skill;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ skill }) => {
  const { environment, setEnvironment } = useEnvironment();
  const { language } = useTheme();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Construct download URL
  const r2Base = "https://pub-cd65669746d54319c4e830260a1c3864.r2.dev/";
  const downloadUrl = skill.r2_zip_key
    ? (skill.r2_zip_key.startsWith('http') ? skill.r2_zip_key : `${r2Base}${skill.r2_zip_key}`)
    : `https://skills.rest/download/${skill.slug}.zip`;

  // 1. Claude Code Content
  const installCommand = `Please help me install this Skill:
Name: ${skill.name}
Download link: ${downloadUrl}

Please download this .zip file, extract it, and install it in the .claude/skills/ directory.`;

  // 3. API Content
  const pythonCode = `from anthropic import Anthropic

client = Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Your task here"
    }],
    # Reference Skill
    system=[{
        "type": "text",
        "text": "Load skill: ${skill.name}"
    }]
)`;

  const tsCode = `import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: "your-api-key",
});

const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: "Your task here"
  }],
  // Reference Skill
  system: [{
    type: "text",
    text: "Load skill: ${skill.name}"
  }]
});`;

  return (
    <div className="space-y-6">
      {/* Environment Switcher */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
        {(['Claude Code', 'Claude.ai', 'API'] as EnvironmentType[]).map((env) => (
          <button
            key={env}
            onClick={() => setEnvironment(env)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${environment === env
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
          >
            <span className={`w-2 h-2 rounded-full ${env === 'Claude Code' ? 'bg-emerald-500' :
              env === 'Claude.ai' ? 'bg-violet-500' :
                'bg-amber-500'
              }`}></span>
            {env}
          </button>
        ))}
      </div>

      {/* Content based on environment */}
      {environment === 'Claude Code' && (
        <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              {t('install.claude_code.title', language)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {t('install.claude_code.desc', language)}
            </p>
          </div>

          <div className="relative group">
            <pre className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs sm:text-sm overflow-x-auto font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
              {installCommand}
            </pre>
            <button
              onClick={() => handleCopy(installCommand, 'claude-code')}
              className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
            >
              {copied === 'claude-code' ? t('install.copied', language) : t('install.copy', language)}
            </button>
          </div>
        </div>
      )}

      {environment === 'Claude.ai' && (
        <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              {t('install.manual.title', language)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {t('install.manual.desc', language)}
            </p>
          </div>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-blue-500/20">
                1
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{t('install.step1.title', language)}</p>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors shadow-sm group"
                >
                  <svg className="w-4 h-4 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {t('install.step1.btn', language)}
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-blue-500/20">
                2
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{t('install.step2.title', language)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('install.step2.desc', language)}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-blue-500/20">
                3
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{t('install.step3.title', language)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('install.step3.desc', language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {environment === 'API' && (
        <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              {t('install.api.title', language)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {t('install.api.desc', language)}
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Python Example</h4>
                <button
                  onClick={() => handleCopy(pythonCode, 'python')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                >
                  {copied === 'python' ? t('install.copied', language) : t('install.copy', language)}
                </button>
              </div>
              <pre className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs overflow-x-auto font-mono text-slate-700 dark:text-slate-300">
                {pythonCode}
              </pre>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TypeScript Example</h4>
                <button
                  onClick={() => handleCopy(tsCode, 'ts')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                >
                  {copied === 'ts' ? t('install.copied', language) : t('install.copy', language)}
                </button>
              </div>
              <pre className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs overflow-x-auto font-mono text-slate-700 dark:text-slate-300">
                {tsCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallGuide;