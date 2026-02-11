import { getAllCategories, getAllSkillsWithTimestamps } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // 关键修复：处理各种可能的后缀情况 (0, 0.xml, 0.xml/)
  const cleanId = id.replace('.xml', '').replace('/', '');
  const chunkId = Number.parseInt(cleanId, 10);

  if (isNaN(chunkId) || chunkId < 0) {
    return new Response('Invalid Chunk ID', { status: 400 });
  }

  const offset = chunkId * SITEMAP_URL_LIMIT;
  const includeStaticPages = chunkId === 0;

  // 获取数据
  const [allSkillsUpToEnd, categories] = await Promise.all([
    getAllSkillsWithTimestamps(offset + SITEMAP_URL_LIMIT),
    includeStaticPages ? getAllCategories() : Promise.resolve([]),
  ]);

  const skillsSlice = allSkillsUpToEnd.slice(offset, offset + SITEMAP_URL_LIMIT);

  // 手动构建 XML
  const staticEntries = includeStaticPages
    ? [
        `<url><loc>${BASE_URL}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
        `<url><loc>${BASE_URL}/explore</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
        ...categories.map(cat => `<url><loc>${BASE_URL}/category/${cat.slug}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`)
      ]
    : [];

  const skillEntries = skillsSlice.map(skill => `
  <url>
    <loc>${BASE_URL}/skill/${skill.slug}</loc>
    <lastmod>${new Date(skill.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries.join('')}
  ${skillEntries.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
