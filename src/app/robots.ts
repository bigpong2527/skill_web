import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // ✅ 核心修复：
            // 1. /api/ -> 解决 GSC 403 报错（API 返回 JSON，不应被当做网页爬取）
            // 2. /private/ -> 您的私有页面
            // 3. 移除了对 /_next/ 的屏蔽，确保 Google 能加载图片和样式，提高页面评分
            disallow: ['/api/', '/private/'],
        },
        sitemap: 'https://skills.rest/sitemap.xml',
    };
}
