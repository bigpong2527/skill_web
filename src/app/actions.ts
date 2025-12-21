'use server';

import { filterSkills, SkillFilters } from '@/lib/db';

// ✅ 修复：删除了 'export const runtime'，因为 'use server' 文件不允许导出非函数内容。
// Cloudflare 适配器会自动处理环境上下文。

export async function fetchSkills(filters: SkillFilters) {
    try {
        // 调用数据库逻辑
        const skills = await filterSkills(filters);
        // 确保返回的是数组，防止 undefined 导致前端崩溃
        return skills || [];
    } catch (error) {
        console.error("Server Action Error in fetchSkills:", error);
        // 发生错误时返回空数组，而不是抛出异常，保证前端页面不崩溃
        return [];
    }
}