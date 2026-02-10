import { MetadataRoute } from 'next';
import { getAllCategories, getAllSkillsWithTimestamps } from '@/lib/db';

export const runtime = 'edge';

const BASE_URL = 'https://skills.rest';
const SITEMAP_URL_LIMIT = 50000;

type PageProps = {
  params: Promise<{ id: string }>;
};

// Chunked sitemap: /sitemap/0.xml, /sitemap/1.xml, ...
// Each file contains at most 50,000 URLs.
export default async function sitemap({ params }: PageProps): Promise<MetadataRoute.Sitemap> {
  const { id } = await params;
  const chunkId = Number.parseInt(id, 10);

  // If id is invalid, return empty sitemap (stable behavior; avoids throwing at edge).
  if (!Number.isFinite(chunkId) || chunkId < 0) return [];

  const offset = chunkId * SITEMAP_URL_LIMIT;
  const limit = SITEMAP_URL_LIMIT;

  // Chunk 0 also includes the small set of non-skill pages (constant size).
  const includeStaticPages = chunkId === 0;

  // Fetch enough skills for this chunk.
  // NOTE: Current db helper doesn't support offset for timestamps; minimal-change approach:
  // - We fetch (offset + limit) and slice in memory.
  // - This remains stable and keeps sitemap compliant; if needed later we can add offset support in db.ts.
  const [allSkillsUpToEnd, categories] = await Promise.all([
    getAllSkillsWithTimestamps(offset + limit),
    includeStaticPages ? getAllCategories() : Promise.resolve([]),
  ]);

  const skillsSlice = allSkillsUpToEnd.slice(offset, offset + limit);

  const staticEntries: MetadataRoute.Sitemap = includeStaticPages
    ? [
        {
          url: BASE_URL,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1.0,
        },
        {
          url: `${BASE_URL}/explore`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        },
        {
          url: `${BASE_URL}/categories`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        ...categories.map((cat) => ({
          url: `${BASE_URL}/category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        })),
      ]
    : [];

  const skillEntries: MetadataRoute.Sitemap = skillsSlice.map((skill) => {
    const daysSinceUpdate =
      (Date.now() - new Date(skill.updated_at).getTime()) / (24 * 60 * 60 * 1000);

    return {
      url: `${BASE_URL}/skill/${skill.slug}`,
      lastModified: new Date(skill.updated_at),
      changeFrequency: daysSinceUpdate < 7 ? ('daily' as const) : ('weekly' as const),
      priority: 0.6,
    };
  });

  // Ensure we never exceed the 50k hard limit per sitemap file.
  // Static entries only exist in chunk 0 and are tiny; still keep a hard cap for safety.
  const combined = [...staticEntries, ...skillEntries];
  return combined.slice(0, SITEMAP_URL_LIMIT);
}
