import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // ✅ 必须包含 /api/，否则 GSC 会一直报 403 错误
            disallow: ['/api/', '/private/'],
        },
        sitemap: 'https://skills.rest/sitemap.xml',
    };
}
