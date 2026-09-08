import React from 'react';
import Link from 'next/link';
import { getFeaturedRepoSuites, getAllCategories, getSkillsMaxId, getSkillsByIds } from '@/lib/db';
import SkillCard from '@/components/client/SkillCard';
import RepoCard from '@/components/client/RepoCard';
import HomeHero from '@/components/client/HomeHero';
import { Metadata } from 'next';
import { t } from '@/lib/i18n';

export const runtime = 'edge';
export const revalidate = 604800;

// ============================================================
// 1. 首页 10 大顶级科技大厂背书 (严格 2 排，每排 5 家)
// ============================================================
const TECH_LEADERS = [
  { name: 'Microsoft', login: 'microsoft', skills: 662, icon: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128', website: 'https://opensource.microsoft.com' },
  { name: 'Anthropic', login: 'anthropics', skills: 354, icon: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128', website: 'https://anthropic.com' },
  { name: 'AWS', login: 'aws-samples', skills: 430, icon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128', website: 'https://aws.amazon.com' },
  { name: 'NVIDIA', login: 'nvidia', skills: 253, icon: 'https://www.google.com/s2/favicons?domain=nvidia.com&sz=128', website: 'https://nvidia.com' },
  { name: 'Google', login: 'google', skills: 168, icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=128', website: 'https://google.com' },
  { name: 'OpenAI', login: 'openai', skills: 135, icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', website: 'https://openai.com' },
  { name: 'Vercel', login: 'vercel', skills: 194, icon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128', website: 'https://vercel.com' },
  { name: 'GitHub', login: 'github', skills: 109, icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128', website: 'https://github.com' },
  { name: 'Adobe', login: 'adobe', skills: 61, icon: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128', website: 'https://adobe.com' },
  { name: 'Cloudflare', login: 'cloudflare', skills: 24, icon: 'https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128', website: 'https://cloudflare.com' },
];

// ============================================================
// 2. FAQ 数据从 i18n.ts 动态读取，支持多语言
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const totalSkillsRaw = await getSkillsMaxId();
  const thousands = Math.floor(totalSkillsRaw / 1000);
  const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();

  const mainTitle = `Agent Skills Library — ChatGPT & Claude Skills | skills.rest`;
  const mainDesc = `${formattedCount}+ AI agent skills for ChatGPT, Claude & Gemini. Vetted. One-click install. 100% free. Updated daily.`;

  return {
    title: mainTitle,
    description: mainDesc,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.rest'),
    alternates: { canonical: '/' },
    openGraph: {
      title: mainTitle,
      description: mainDesc,
      url: 'https://skills.rest',
      siteName: 'skills.rest',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Agent Skills Library' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: mainTitle,
      description: mainDesc,
      images: ['/og-image.png'],
    },
  };
}

export default async function HomePage() {
  const language = 'en';
  const faqNumbers = ['01', '02', '03', '04', '05'];
  const homepageFaqs = faqNumbers.map((num, i) => ({
    num,
    question: t(`home.faq.q${i + 1}`, language),
    answer: t(`home.faq.a${i + 1}`, language),
  }));

  const homepageFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homepageFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  // ✅ 并行拉取全站核心数据与 10 大分类
  const [featuredRepos, totalSkills, categories] = await Promise.all([
    getFeaturedRepoSuites(8),
    getSkillsMaxId(),
    getAllCategories(),
  ]);

  // ✅ 并行拉取 10 大分类下的各自 8 个明星技能 (2 排 x 4 个，0 全表扫描)
  const categorySkillsPromises = categories.map((cat) => getSkillsByIds(cat.featured_skill_ids, 8));
  const categorySkillsArray = await Promise.all(categorySkillsPromises);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />

      <main className="min-h-screen pb-20 selection:bg-blue-500/20 text-slate-800 dark:text-slate-200">
        {/* HERO 核心区 */}
        <HomeHero totalSkills={totalSkills} />

        <div className="container mx-auto px-4 sm:px-6 space-y-20 max-w-[1440px]">
          {/* 大厂官方信任墙 (大 LOGO 48px + 黄金比例排版 + 纯净大厂矩阵) */}
          <section className="pt-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <h2 className="text-xs font-mono font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                  {t('home.tech_leaders.title', language)}
                </h2>
              </div>
              <Link
                href="/companies"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 font-semibold group"
              >
                <span>{t('home.tech_leaders.view_all', language)}</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
              </Link>
            </div>

            {/* 10 大科技巨头矩阵 (2排x5列，48px 大 Logo 自由展示，排版紧凑扎实) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {TECH_LEADERS.map((company) => (
                <Link
                  key={company.login}
                  href={`/company/${company.login}`}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B1121] border border-slate-200/80 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5"
                  title={`View all skills by ${company.name}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={company.icon}
                      alt={company.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate tracking-tight">
                      {company.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{company.skills}</span> skills
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 全网 Star 旗舰技能榜单 */}
          <section className="border-t border-slate-200/80 dark:border-white/5 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('home.featured.title', language)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {t('home.featured.subtitle', language)}
                </p>
              </div>
              <Link
                href="/best-skills"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline transition-colors shrink-0 font-semibold"
              >
                {t('home.featured.view_all', language)} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </section>

          {/* 🌟 10 大专业领域"明星技能货架流" (每排 1 个分类，展示 8 个高 Star 技能) */}
          <section className="border-t border-slate-200/80 dark:border-white/5 pt-16 space-y-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('home.domains.title', language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
                {t('home.domains.subtitle', language)}
              </p>
            </div>

            <div className="space-y-16">
              {categories.map((cat, index) => {
                const catSkills = categorySkillsArray[index];
                if (!catSkills || catSkills.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cat.icon}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {t(`category.${cat.slug}`, language)}
                        </h3>
                      </div>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Explore All {t(`category.${cat.slug}`, language)} Skills</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>

                    {/* ✅ 2 排 x 4 个 (共 8 个卡片) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {catSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5 大核心 FAQ 问答库 */}
          <section className="border-t border-slate-200/80 dark:border-white/5 pt-20 pb-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-200/80 dark:border-blue-500/20 shadow-sm">
                  {t('home.faq.badge', language)}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 tracking-tight">
                  {t('home.faq.title', language)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto font-mono">
                  {t('home.faq.subtitle', language)}
                </p>
              </div>

              <div className="space-y-3">
                {homepageFaqs.map((faq, idx) => (
                  <details
                    key={faq.num}
                    className="group rounded-2xl bg-white dark:bg-[#0B1121] border border-slate-200/80 dark:border-white/5 p-5 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30"
                    {...(idx === 0 ? { open: true } : {})}
                  >
                    <summary className="flex items-center justify-between font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer select-none list-none">
                      <div className="flex items-center gap-3.5">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {faq.num}
                        </span>
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <span className="ml-4 text-xs text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3.5 pl-9 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3.5 font-normal">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
