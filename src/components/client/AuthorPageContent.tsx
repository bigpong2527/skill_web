'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Skill, RepositoryGroup, Author } from '@/types';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';
import SkillCard from '@/components/client/SkillCard';

interface Props {
  author: Author;
  initialSkills: Skill[];
  repositories: RepositoryGroup[];
  totalSkillsCount: number;
}

export default function AuthorPageContent({
  author,
  initialSkills,
  repositories,
  totalSkillsCount,
}: Props) {
  const { language } = useTheme();
  const [viewMode, setViewMode] = useState<'skills' | 'repos'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string>('all');

  // 🌟 分页状态管理
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalSkillsCount > initialSkills.length);
  const [offset, setOffset] = useState(initialSkills.length);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ✅ 直接读取独立列中的 faqs 数组（100% 数组类型保护）
  const faqs = Array.isArray(author.faqs) ? author.faqs : [];

  // 🌟 安全加载函数：带安全暗号 + CDN 7天强缓存
  const loadMoreSkills = useCallback(async () => {
    if (isLoading || !hasMore || searchQuery.trim() !== '' || selectedRepo !== 'all') return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '24');
      params.set('offset', offset.toString());
      params.set('authorName', author.login);

      const res = await fetch(`/api/skills?${params.toString()}`, {
        headers: { 'x-skills-client': 'web-app-v1' }
      });
      if (!res.ok) throw new Error('Failed');
      const newSkills: Skill[] = await res.json();

      if (newSkills && newSkills.length > 0) {
        setSkills(prev => {
          const ids = new Set(prev.map(s => s.id));
          return [...prev, ...newSkills.filter(s => !ids.has(s.id))];
        });
        setOffset(prev => prev + 24);
        if (newSkills.length < 24 || offset + newSkills.length >= totalSkillsCount) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset, author.login, totalSkillsCount, searchQuery, selectedRepo]);

  // 触底监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreSkills();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMoreSkills]);

  // 客户端即时过滤技能
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesRepo =
        selectedRepo === 'all' ||
        (skill.source_url && skill.source_url.toLowerCase().includes(selectedRepo.toLowerCase()));

      return matchesSearch && matchesRepo;
    });
  }, [skills, searchQuery, selectedRepo]);

  const authorDisplayName = author.name || author.login;

  return (
    <div className="space-y-8">
      
      {/* 2. 工具栏：视图切换 (Skills / Repositories) + 搜索与筛选 */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('author.artifacts_by', language)} {authorDisplayName}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            {t('author.indexed_desc', language)
              .replace('{skillsCount}', totalSkillsCount.toLocaleString('en-US'))
              .replace('{reposCount}', repositories.length.toString())}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* 双视图切换器 */}
          <div className="flex p-1 bg-slate-100 dark:bg-[#0B1121] rounded-xl border border-slate-200 dark:border-white/5 text-xs font-medium">
            <button
              onClick={() => setViewMode('skills')}
              className={`px-3.5 py-1.5 rounded-lg font-bold shadow-sm transition-all flex items-center gap-1.5 ${
                viewMode === 'skills'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>⚡ {t('author.skills_view', language)}</span>
              <span className="text-[10px] opacity-75 font-mono">({totalSkillsCount})</span>
            </button>
            <button
              onClick={() => setViewMode('repos')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'repos'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>📦 {t('author.repos_view', language)}</span>
              <span className="text-[10px] opacity-75 font-mono">({repositories.length})</span>
            </button>
          </div>

          {/* 仓库下拉过滤 */}
          {viewMode === 'skills' && repositories.length > 1 && (
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="h-9 bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-xl px-3 text-xs text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">{t('author.all_repos', language)} ({repositories.length})</option>
              {repositories.map((repo) => (
                <option key={repo.repo_url} value={repo.repo_name}>
                  {repo.repo_name} ({repo.skill_count})
                </option>
              ))}
            </select>
          )}

          {/* 站内作者技能过滤框 */}
          {viewMode === 'skills' && (
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('author.search_placeholder', language).replace('{author}', author.login)}
                className="w-full h-9 bg-white dark:bg-[#0B1121] border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </section>

      {/* 3. 【视图 A】：Skills 卡片网格 */}
      {viewMode === 'skills' && (
        <section className="space-y-6">
          {filteredSkills.length > 0 ? (
            <>
              {/* ✅ 100% 复用全站统一公共 SkillCard (带大头像、Star 勋章、绿条等级) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {/* 触底加载哨兵 */}
              {hasMore && searchQuery.trim() === '' && selectedRepo === 'all' && (
                <div ref={observerTarget} className="flex justify-center py-8 w-full min-h-[50px]">
                  {isLoading && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                      <span>Loading more skills...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-12 text-center text-sm text-slate-500 font-mono">
              {t('author.no_skills', language)}
            </div>
          )}
        </section>
      )}

      {/* 4. 【视图 B】：Repositories 仓库汇总网格 */}
      {/* 4. 【视图 B】：Repositories 仓库网格 (自适应智能分流 + 纯正行业用词) */}
      {viewMode === 'repos' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.map((repo) => {
            const avatar = author.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(author.login)}?s=40`;
            const formattedStars = repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars;

            const cleanSegments = repo.repo_name.split('/').filter(Boolean);
            const owner = cleanSegments[0] || author.login;
            const repoName = cleanSegments.slice(1).join('/') || 'skills';
            const displayTagline = repo.tagline || `Open-source Agent Skills repository by ${author.login}.`;

            const CardContent = (
              <div className="relative h-full flex flex-col justify-between bg-white dark:bg-[#0B1121] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 transition-all duration-300 ease-out hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:bg-[#0F172A] hover:-translate-y-1">
                <div>
                  {/* 顶部：28px 放大头像 + 所有者名 | 右上角金色 Star 勋章 */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={avatar}
                        alt={author.login}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                        loading="lazy"
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {author.login}
                      </span>
                    </div>

                    {repo.stars > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-500/20 text-[11px] font-mono shrink-0">
                        <span>⭐</span>
                        <span>{formattedStars}</span>
                      </div>
                    )}
                  </div>

                  {/* 中部：仓库名称 + 永远饱满的 Slogan */}
                  <div className="space-y-1.5 mb-5 flex-grow">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {repoName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-light">
                      {displayTagline}
                    </p>
                  </div>
                </div>

                {/* 底栏：收录技能数 | 纯正行业用词指示跳转 */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                    📦 {repo.skill_count} Skills
                  </span>

                  <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                    {repo.has_internal_page ? 'View Repository →' : 'View Source ↗'}
                  </span>
                </div>
              </div>
            );

            return repo.has_internal_page ? (
              <Link
                key={repo.repo_url}
                href={`/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`}
                prefetch={false}
                className="group block h-full select-none"
              >
                {CardContent}
              </Link>
            ) : (
              <a
                key={repo.repo_url}
                href={repo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full select-none"
              >
                {CardContent}
              </a>
            );
          })}
        </section>
      )}

      {/* 🌟 5. 底部专属 FAQ 手风琴 (仅当该作者拥有真实 FAQ 时渲染，消灭薄内容) */}
      {faqs.length > 0 && (
        <section className="bg-white dark:bg-[#0B1121] rounded-3xl border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
              Frequently Asked Questions About {authorDisplayName}
            </h3>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20 font-semibold">
              FAQPage Schema
            </span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border-b border-slate-100 dark:border-white/5 pb-3.5 last:border-none [&_summary::-webkit-details-marker]:hidden"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer list-none">
                  <span className="group-hover:text-blue-600 transition-colors">{faq.question}</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-600 font-light">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}