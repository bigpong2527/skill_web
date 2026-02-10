import { MetadataRoute } from 'next';
import { getAllSkillsWithTimestamps, getAllCategories } from '@/lib/db';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://skills.rest';

    // IMPORTANT: Limit to 10,000 skills to prevent Edge Runtime timeout
    // Google allows up to 50,000 URLs per sitemap, but we stay conservative
    // If skill count exceeds 10,000, implement sitemap index with multiple sitemaps
    const SITEMAP_SKILL_LIMIT = 50000;

    // Fetch all skills with timestamps and categories
    const [skillsData, categories] = await Promise.all([
        getAllSkillsWithTimestamps(SITEMAP_SKILL_LIMIT),
        getAllCategories()
    ]);

    // Homepage - Highest priority
    const homepage = {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    };

    // Explore page - Very high priority
    const explorePage = {
        url: `${baseUrl}/explore`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    };

    // Categories list page
    const categoriesListPage = {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    };

    // Individual category pages
    const categoryPages = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    // Skill detail pages with real timestamps
    // Dynamic change frequency based on actual update time
    const skillPages = skillsData.map((skill) => {
        const daysSinceUpdate = (new Date().getTime() - new Date(skill.updated_at).getTime()) / (24 * 60 * 60 * 1000);

        return {
            url: `${baseUrl}/skill/${skill.slug}`,
            lastModified: new Date(skill.updated_at),
            changeFrequency: daysSinceUpdate < 7 ? ('daily' as const) : ('weekly' as const),
            priority: 0.6,
        };
    });

    return [
        homepage,
        explorePage,
        categoriesListPage,
        ...categoryPages,
        ...skillPages
    ];
}
