import { getSkillsCount, getAuthorsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 10000;

export async function GET() {
  const [totalSkills, totalAuthors] = await Promise.all([
    getSkillsCount(),
    getAuthorsCount(),
  ]);

  const totalSkillChunks = Math.max(1, Math.ceil(totalSkills / SITEMAP_URL_LIMIT));
  const totalAuthorChunks = Math.max(1, Math.ceil(totalAuthors / SITEMAP_URL_LIMIT));

  const now = new Date();
  const FIXED_DATE = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const skillSitemaps = Array.from({ length: totalSkillChunks }, (_, i) => `
  <sitemap><loc>${BASE_URL}/sitemap-index/${i}.xml</loc><lastmod>${FIXED_DATE}</lastmod></sitemap>`).join('');

  // 关键新增：作者分块渲染
  const authorSitemaps = Array.from({ length: totalAuthorChunks }, (_, i) => `
  <sitemap><loc>${BASE_URL}/sitemap-index/authors-${i}.xml</loc><lastmod>${FIXED_DATE}</lastmod></sitemap>`).join('');

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/sitemap-index/static.xml</loc><lastmod>${FIXED_DATE}</lastmod></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-index/repos.xml</loc><lastmod>${FIXED_DATE}</lastmod></sitemap>
  ${authorSitemaps}
  ${skillSitemaps}
</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
