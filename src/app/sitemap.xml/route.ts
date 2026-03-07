import { getSkillsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
// ✅ 保持 10000 条，配合极速查询不会超时
const SITEMAP_URL_LIMIT = 10000;

export async function GET() {
  const totalSkills = await getSkillsCount();
  const totalChunks = Math.max(1, Math.ceil(totalSkills / SITEMAP_URL_LIMIT));

  // ✅ 自动生成"本月1号"的时间戳 (例如 2025-02-01T00:00:00.000Z)
  const now = new Date();
  const FIXED_DATE = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from({ length: totalChunks }, (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-index/${i}.xml</loc>
    <lastmod>${FIXED_DATE}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      // 缓存 1 天，极大减轻服务器压力
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
