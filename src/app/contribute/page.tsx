import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import ContributeForm from '@/components/client/ContributeForm';
import { t } from '@/lib/i18n';
import { getSkillsMaxId } from '@/lib/db';

export const runtime = 'edge';
export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'Contribute a Skill — Publish to Agent Skills Library | skills.rest',
  description: 'Submit your open-source Agent Skills to skills.rest. Index your tools across Claude Code, OpenClaw, Cursor, and Codex.',
  alternates: { canonical: 'https://skills.rest/contribute' },
};

export default async function ContributePage() {
  const language = 'en'; // Server component, default to English
  const totalSkills = await getSkillsMaxId();

  // 格式化技能数为千位整值 (如 665,000)
  const formattedCount = Math.floor(totalSkills / 1000) > 0
    ? `${Math.floor(totalSkills / 1000).toLocaleString('en-US')},000`
    : totalSkills.toString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] py-12 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

        {/* 顶部面包屑与标题 */}
        <div>
          <nav className="flex items-center text-xs text-slate-500 font-mono mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Contribute</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('contribute.title', language)}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-normal leading-relaxed">
            {t('contribute.subtitle', language).replace('{count}', formattedCount)}
          </p>
        </div>

        {/* 🌟 核心：直接可提交的输入表单 */}
        <ContributeForm />

        {/* 收录标准与规范说明 (大白话) */}
        <section className="bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
            {t('contribute.guidelines_title', language)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 dark:text-slate-400">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
              <div className="font-bold text-slate-900 dark:text-white text-sm">{t('contribute.guide_1_title', language)}</div>
              <p>{t('contribute.guide_1_desc', language)}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
              <div className="font-bold text-slate-900 dark:text-white text-sm">{t('contribute.guide_2_title', language)}</div>
              <p>{t('contribute.guide_2_desc', language)}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
              <div className="font-bold text-slate-900 dark:text-white text-sm">{t('contribute.guide_3_title', language)}</div>
              <p>{t('contribute.guide_3_desc', language)}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
