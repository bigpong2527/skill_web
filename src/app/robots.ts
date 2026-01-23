import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // 1. 针对所有爬虫的通用规则 (包含 Googlebot)
            {
                userAgent: '*',
                allow: '/',
                // ✅ 核心修复：屏蔽 API 和私有目录
                disallow: ['/api/', '/private/'],
            },
            // 2. (可选) 如果您想屏蔽 AI 训练爬虫，显式添加它们
            // 这替代了 Cloudflare 的自动注入，让您拥有完全控制权
            {
                userAgent: [
                    'Amazonbot',
                    'Applebot-Extended',
                    'Bytespider',
                    'CCBot',
                    'ClaudeBot',
                    'Google-Extended',
                    'GPTBot',
                    'meta-externalagent'
                ],
                disallow: ['/'],
            }
        ],
        sitemap: 'https://skills.rest/sitemap.xml',
    };
}
