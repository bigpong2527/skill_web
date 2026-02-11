import { MetadataRoute } from 'next';
import { getSkillsCount } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const totalSkills = await getSkillsCount();
  const totalChunks = Math.max(1, Math.ceil(totalSkills / SITEMAP_URL_LIMIT));

  // 注意：这里返回的是普通的 Sitemap 格式，但 URL 指向的是我们的分片
  // Next.js 会自动将其包装在 <urlset> 中。
  // 虽然 Google 推荐 <sitemapindex>，但在分片场景下，
  // 这种由索引指向分片的方式是 Next.js 官方支持的标准做法。
  return Array.from({ length: totalChunks }, (_, i) => ({
    url: `${BASE_URL}/sitemap/${i}.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));
}
