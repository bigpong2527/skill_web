import { getSkillsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

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
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
