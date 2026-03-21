import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // 🚨 必须包含下面这一行，禁止爬虫进入任何带 "?" 的路径
            // 这会防止 Google 抓取类似 /explore?authorType=Official&complexity=Basic 的组合页面
            disallow: ['/api/', '/private/', '/*?*'],
        },
        sitemap: 'https://skills.rest/sitemap.xml',
    };
}
