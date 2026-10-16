'use client';

import React, { useState } from 'react';
import { submitSkillUrl } from '@/app/actions';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

export default function ContributeForm() {
  const { language } = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitSkillUrl(formData);

    setLoading(false);
    setStatus(result);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
          {t('contribute.form_title', language)}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('contribute.form_desc', language)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🔒 诱捕机器人的透明蜜罐 (人类不可见，机器人必填) */}
        <div className="hidden opacity-0 pointer-events-none absolute -left-[5000px]" aria-hidden="true">
          <label htmlFor="company_verification_hp">Do not fill this</label>
          <input
            type="text"
            id="company_verification_hp"
            name="company_verification_hp"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* GitHub 链接输入 (必填) */}
        <div>
          <label htmlFor="contrib_repo_url" className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('contribute.repo_label', language)} <span className="text-rose-500">*</span>
          </label>
          <input
            id="contrib_repo_url"
            type="url"
            name="repo_url"
            required
            placeholder="https://github.com/owner/repo/tree/main/skills/my-skill"
            className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 开发者联系方式 (选填) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contrib_email" className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('contribute.contact_label', language)}
            </label>
            <input
              id="contrib_email"
              type="text"
              name="email"
              placeholder="you@domain.com or @handle"
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contrib_notes" className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('contribute.notes_label', language)}
            </label>
            <input
              id="contrib_notes"
              type="text"
              name="notes"
              placeholder="e.g. Software Engineering / Claude Code"
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* 状态提示反馈 (动态无障碍感知) */}
        <div aria-live="polite">
          {status?.error && (
            <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-mono">
              ❌ {status.error}
            </div>
          )}

          {status?.success && (
            <div role="status" className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-mono">
              {status.message}
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white text-xs font-mono font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>⏳ {t('contribute.submitting', language)}</span>
          ) : (
            <>
              <span>{t('contribute.submit_btn', language)}</span>
              <span>&rarr;</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
