import { getSkillsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
// ✅ 必须与 sitemap-index/[id]/route.ts 保持一致
const SITEMAP_URL_LIMIT = 10000;

export async function GET() {
  const totalSkills = await getSkillsCount();
  const totalChunks = Math.max(1, Math.ceil(totalSkills / SITEMAP_URL_LIMIT));

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from({ length: totalChunks }, (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-index/${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      // 索引文件缓存时间可以稍短，例如 1 小时
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
