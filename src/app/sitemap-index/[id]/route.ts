import { getAllCategories, getAllSkillsWithTimestamps } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
// ✅ 优化：降低单页条数至 5000，确保 Edge Worker 不会超时
const SITEMAP_URL_LIMIT = 10000;

// ✅ 安全：XML 转义函数，防止特殊字符导致 GSC 解析失败
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // 处理各种后缀情况 (0, 0.xml)
  const cleanId = id.replace('.xml', '').replace('/', '');
  const chunkId = Number.parseInt(cleanId, 10);

  if (isNaN(chunkId) || chunkId < 0) {
    return new Response('Invalid Chunk ID', { status: 400 });
  }

  const offset = chunkId * SITEMAP_URL_LIMIT;
  const includeStaticPages = chunkId === 0;

  // ✅ 优化：直接从数据库分页获取数据 (LIMIT 5000 OFFSET X)
  // 避免了一次性加载所有数据到内存
  const [skills, categories] = await Promise.all([
    getAllSkillsWithTimestamps(SITEMAP_URL_LIMIT, offset),
    includeStaticPages ? getAllCategories() : Promise.resolve([]),
  ]);

  // 如果不是第0页且没有数据，返回 404
  if (skills.length === 0 && !includeStaticPages) {
      return new Response('Not Found', { status: 404 });
  }

  // 构建 XML
  const staticEntries = includeStaticPages
    ? [
        `<url><loc>${BASE_URL}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
        `<url><loc>${BASE_URL}/explore</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
        ...categories.map(cat => `<url><loc>${BASE_URL}/category/${escapeXml(cat.slug)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`)
      ]
    : [];

  const skillEntries = skills.map(skill => `
  <url>
    <loc>${BASE_URL}/skill/${escapeXml(skill.slug)}</loc>
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
      // 缓存 1 天 (86400秒)，CDN 层面缓存，减少数据库压力
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
