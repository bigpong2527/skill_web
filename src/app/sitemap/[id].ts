import { MetadataRoute } from 'next';
import { getAllCategories, getAllSkillsWithTimestamps } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

// 修正 Props 定义
type Props = {
  params: Promise<{ id: string }>;
};

export default async function sitemap({ params }: Props): Promise<MetadataRoute.Sitemap> {
  const { id } = await params;
  // 移除文件名后缀 .xml (如果是从 /sitemap/0.xml 访问，id 会是 "0.xml")
  const cleanId = id.replace('.xml', '');
  const chunkId = Number.parseInt(cleanId, 10);

  if (isNaN(chunkId) || chunkId < 0) return [];

  const offset = chunkId * SITEMAP_URL_LIMIT;
  const limit = SITEMAP_URL_LIMIT;
  const includeStaticPages = chunkId === 0;

  // 这里的逻辑保持高效
  const [allSkillsUpToEnd, categories] = await Promise.all([
    getAllSkillsWithTimestamps(offset + limit),
    includeStaticPages ? getAllCategories() : Promise.resolve([]),
  ]);

  const skillsSlice = allSkillsUpToEnd.slice(offset, offset + limit);

  const staticEntries: MetadataRoute.Sitemap = includeStaticPages
    ? [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        ...categories.map((cat) => ({
          url: `${BASE_URL}/category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        })),
      ]
    : [];

  const skillEntries: MetadataRoute.Sitemap = skillsSlice.map((skill) => ({
    url: `${BASE_URL}/skill/${skill.slug}`,
    lastModified: new Date(skill.updated_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...skillEntries].slice(0, SITEMAP_URL_LIMIT);
}
