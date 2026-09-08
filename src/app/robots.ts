import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // 🚨 严防 Google 抓取带 "?" 的多维筛选结果页与内部接口
            disallow: ['/api/', '/private/', '/*?*'],
        },
        sitemap: 'https://skills.rest/sitemap.xml',
    };
}
