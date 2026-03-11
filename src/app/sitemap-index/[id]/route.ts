import { getAllCategories, getSitemapSlugs } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 10000; // ✅ 必须与主索引一致

// XML 转义辅助函数
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'; case '>': return '&gt;'; case '&': return '&amp;';
      case '\'': return '&apos;'; case '"': return '&quot;'; default: return c;
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 处理 .xml 后缀
  const cleanId = id.replace('.xml', '').replace('/', '');
  const chunkId = Number.parseInt(cleanId, 10);

  if (isNaN(chunkId) || chunkId < 0) {
    return new Response('Invalid Chunk ID', { status: 400 });
  }

  const offset = chunkId * SITEMAP_URL_LIMIT;
  const includeStaticPages = chunkId === 0;

  // ✅ 并行获取数据：只拿 slug 数组，速度极快
  const [slugs, categories] = await Promise.all([
    getSitemapSlugs(SITEMAP_URL_LIMIT, offset),
    includeStaticPages ? getAllCategories() : Promise.resolve([]),
  ]);

  if (slugs.length === 0 && !includeStaticPages) {
    return new Response('Not Found', { status: 404 });
  }

  // ✅ 统一使用"本月1号"时间戳
  const now = new Date();
  const FIXED_DATE = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  // 静态页面条目
  const staticEntries = includeStaticPages
    ? [
        `<url><loc>${BASE_URL}</loc><lastmod>${FIXED_DATE}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
        `<url><loc>${BASE_URL}/explore</loc><lastmod>${FIXED_DATE}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
        ...categories.map(cat => `<url><loc>${BASE_URL}/category/${escapeXml(encodeURI(cat.slug))}</loc><lastmod>${FIXED_DATE}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
      ]
    : [];

  // ✅ 技能页面条目：使用 encodeURI 确保 URL 合法，使用 escapeXml 确保 XML 合法
  const skillEntries = slugs.map(slug => `
  <url>
    <loc>${BASE_URL}/skill/${escapeXml(encodeURI(slug))}</loc>
    <lastmod>${FIXED_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries.join('')}
  ${skillEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
