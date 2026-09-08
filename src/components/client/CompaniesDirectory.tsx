'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

export interface CompanyOrg {
  login: string;
  name: string | null;
  avatar_url: string | null;
  public_repos: number;
  followers: number;
  website: string | null;
  headline: string | null;
  primary_domain: string | null;
  capability_breakdown: string | Record<string, number> | null;
  skills_count?: number;
}

interface Props {
  organizations: CompanyOrg[];
}

// 8 大 MECE 顶级生态位
const PRIMARY_DOMAINS = [
  { id: 'all', label: 'companies.domain.all', icon: '🌐' },
  { id: 'Cloud & Compute Infrastructure', label: 'companies.domain.cloud', icon: '☁️' },
  { id: 'AI Models & Machine Learning', label: 'companies.domain.ai', icon: '🤖' },
  { id: 'Data Systems & Databases', label: 'companies.domain.data', icon: '📊' },
  { id: 'Cybersecurity & Compliance', label: 'companies.domain.security', icon: '🛡️' },
  { id: 'Developer Tooling & Languages', label: 'companies.domain.devtools', icon: '🛠️' },
  { id: 'UI/UX & Creative Multimedia', label: 'companies.domain.creative', icon: '🎨' },
  { id: 'Growth, Marketing & Content', label: 'companies.domain.growth', icon: '📈' },
  { id: 'Business, Finance & Enterprise', label: 'companies.domain.biz', icon: '💼' },
];

const BAR_COLORS = ['bg-blue-600', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];

function parseBreakdown(raw: string | Record<string, number> | null): Array<{ name: string; pct: number }> {
  if (!raw) return [];
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj)
      .map(([name, pct]) => ({ name, pct: Number(pct) || 0 }))
      .filter((item) => item.pct > 0)
      .sort((a, b) => b.pct - a.pct); // 百分比大者排前面
  } catch {
    return [];
  }
}

export default function CompaniesDirectory({ organizations }: Props) {
  const { language } = useTheme();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 🌟 纯内存分页：每次展示 24 家，0 次网络请求
  const PAGE_SIZE = 24;
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE); // 筛选或搜索时重置回第 1 页
  }, [selectedDomain, searchQuery]);

  // 客户端毫秒级多维过滤
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesDomain = selectedDomain === 'all' || org.primary_domain === selectedDomain;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (org.name && org.name.toLowerCase().includes(q)) ||
        org.login.toLowerCase().includes(q) ||
        (org.headline && org.headline.toLowerCase().includes(q)) ||
        (org.primary_domain && org.primary_domain.toLowerCase().includes(q));

      return matchesDomain && matchesSearch;
    });
  }, [organizations, selectedDomain, searchQuery]);

  // 🌟 切片渲染：只展示前 displayCount 家大厂
  const visibleOrgs = filteredOrgs.slice(0, displayCount);

  return (
    <div className="space-y-8">
      {/* 🎛️ 工具栏：8 大生态位 Tab 胶囊 + 实时搜索框 */}
      <section className="space-y-4 border-y border-slate-200/80 dark:border-white/5 py-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* 8 大生态位滑动切换 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 lg:pb-0 font-mono text-xs no-scrollbar">
            {PRIMARY_DOMAINS.map((domain) => {
              const isActive = selectedDomain === domain.id;
              const count = domain.id === 'all'
                ? organizations.length
                : organizations.filter((o) => o.primary_domain === domain.id).length;

              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`px-3.5 py-1.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 font-medium ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                      : 'bg-white dark:bg-[#0B1121] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <span>{domain.icon}</span>
                  <span>{t(domain.label, language)}</span>
                  <span className={`text-[10px] opacity-70 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* 快速检索框 */}
          <div className="relative w-full lg:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('companies.search_placeholder', language)}
              className="w-full h-10 bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>
      </section>

      {/* 📦 大厂卡片网格 (整卡可点击 + 移除拥挤横条) */}
      {visibleOrgs.length > 0 ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleOrgs.map((org) => (
              <Link
                key={org.login}
                href={`/company/${encodeURIComponent(org.login.toLowerCase())}`}
                className="group bg-white dark:bg-[#0B1121] border border-slate-200/80 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/40 p-6 rounded-3xl flex flex-col justify-between space-y-4 transition-all shadow-sm hover:shadow-md dark:hover:shadow-blue-500/5 hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* 头部：大 Logo + 名字 + 官方徽章 */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={org.avatar_url || `https://avatars.githubusercontent.com/${org.login}?s=100`}
                      alt={org.name || org.login}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-2xl border border-slate-100 dark:border-white/10 object-cover bg-slate-50 dark:bg-slate-800 p-0.5 shrink-0 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {org.name || org.login}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                          Official
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                        @{org.login} {org.followers > 0 && `· ${org.followers.toLocaleString()} followers`}
                      </p>
                    </div>
                  </div>

                  {/* 业务定位简述 Headline */}
                  {org.headline && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-2">
                      {org.headline}
                    </p>
                  )}

                  {/* 主生态位分类 Pill */}
                  {org.primary_domain && (
                    <div className="pt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-300">
                        📁 {org.primary_domain}
                      </span>
                    </div>
                  )}
                </div>

                {/* 卡片底栏：技能与仓库数 */}
                <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">{org.skills_count || 0}</strong> Skills
                  </span>
                  <span>{org.public_repos} Repositories</span>
                </div>
              </Link>
            ))}
          </section>

          {/* 🌟 纯内存加载更多按钮：点击仅展开内存数组，发 0 次网络请求，击穿率绝对为 0 */}
          {displayCount < filteredOrgs.length && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all shadow-xs"
              >
                Load More Organizations ({filteredOrgs.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-[#0B1121] border border-dashed border-slate-200 dark:border-white/10 p-16 rounded-3xl text-center space-y-3 font-mono">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">{t('companies.no_orgs', language)}</p>
          <p className="text-xs text-slate-500">{t('companies.no_orgs_hint', language)}</p>
        </div>
      )}
    </div>
  );
}