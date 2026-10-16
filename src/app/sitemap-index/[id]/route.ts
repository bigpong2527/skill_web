import { getAllCategories, getSitemapSkillsWithDates, getSitemapAuthorsWithDates, getAllRepoSuitesForSitemap } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 10000;

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

// ✅ 改造后：只有真实、合法的时间戳才输出 <lastmod> 标签，空值直接返回空字符串，绝不产生 <lastmod>null</lastmod>
function renderLastmod(dateStr?: string | null): string {
  if (!dateStr || dateStr === 'NULL') return '';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime()) || d.getFullYear() < 2015) return '';
    const dateFormatted = d.toISOString().split('T')[0];
    return `<lastmod>${dateFormatted}</lastmod>`;
  } catch {
    return '';
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cleanId = id.replace('.xml', '').replace('/', '');

  const todayDate = new Date().toISOString().split('T')[0];
  let xmlContent = '';

  // 🌟 1. static.xml：全站核心单页 + 10 大垂直分类落地页
  if (cleanId === 'static') {
    const categories = await getAllCategories();

    const staticEntries = [
      `<url><loc>${BASE_URL}</loc><lastmod>${todayDate}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${BASE_URL}/best-skills</loc><lastmod>${todayDate}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${BASE_URL}/explore</loc><lastmod>${todayDate}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${BASE_URL}/companies</loc><lastmod>${todayDate}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`,
      `<url><loc>${BASE_URL}/skills-search-cli</loc><lastmod>${todayDate}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${BASE_URL}/contribute</loc><lastmod>${todayDate}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
      `<url><loc>${BASE_URL}/privacy</loc><lastmod>2025-11-20</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
      `<url><loc>${BASE_URL}/terms</loc><lastmod>2025-11-20</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
    ].join('');

    const categoryEntries = categories.map(cat =>
      `<url><loc>${BASE_URL}/category/${escapeXml(encodeURI(cat.slug))}</loc><lastmod>${todayDate}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>`
    ).join('');

    xmlContent = staticEntries + categoryEntries;
  }
  // 🌟 2. authors-0.xml, authors-1.xml...：3.5 万作者分块真实画像更新时间
  else if (cleanId.startsWith('authors-')) {
    const chunkId = Number.parseInt(cleanId.replace('authors-', ''), 10);
    if (isNaN(chunkId) || chunkId < 0) {
      return new Response('Invalid Author Chunk ID', { status: 400 });
    }

    const offset = chunkId * SITEMAP_URL_LIMIT;
    const authorItems = await getSitemapAuthorsWithDates(SITEMAP_URL_LIMIT, offset);

    if (authorItems.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    xmlContent = authorItems.map(item => `
  <url>
    <loc>${BASE_URL}/company/${escapeXml(encodeURI(item.login.toLowerCase()))}</loc>
    ${renderLastmod(item.updated_at)}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
  }
  // 🌟 3. repos.xml：首批 300 个及未来所有高质量仓库套件页
  else if (cleanId === 'repos') {
    const repoItems = await getAllRepoSuitesForSitemap();

    xmlContent = repoItems.map(item => `
  <url>
    <loc>${BASE_URL}/repo/${escapeXml(encodeURI(item.owner))}/${escapeXml(encodeURI(item.name))}</loc>
    ${renderLastmod(item.updated_at)}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
  }
  // 🌟 4. 0.xml, 1.xml...：64.5 万技能真实发布与更新时间
  else {
    const chunkId = Number.parseInt(cleanId, 10);
    if (isNaN(chunkId) || chunkId < 0) {
      return new Response('Invalid Chunk ID', { status: 400 });
    }

    const offset = chunkId * SITEMAP_URL_LIMIT;
    const skillItems = await getSitemapSkillsWithDates(SITEMAP_URL_LIMIT, offset);

    if (skillItems.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    xmlContent = skillItems.map(item => `
  <url>
    <loc>${BASE_URL}/skill/${escapeXml(encodeURI(item.slug))}</loc>
    ${renderLastmod(item.updated_at)}
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlContent}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
