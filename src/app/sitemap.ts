import { MetadataRoute } from 'next';
import { getSkillsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

// `sitemap.xml` becomes a sitemap index that points to chunked sitemaps.
// This avoids Google's hard limit of 50,000 URLs per single sitemap file.
export default async function sitemap(): Promise<MetadataRoute.SitemapIndex> {
  // Count skill detail pages; other fixed pages are negligible and will be included in chunk 0.
  const totalSkills = await getSkillsCount();

  // Chunk 0 contains: homepage/explore/categories + all category pages + first chunk of skills.
  const chunksForSkills = Math.ceil(totalSkills / SITEMAP_URL_LIMIT);
  const totalChunks = Math.max(1, chunksForSkills);

  return Array.from({ length: totalChunks }, (_, i) => ({
    url: `${BASE_URL}/sitemap/${i}.xml`,
    lastModified: new Date(),
  }));
}
