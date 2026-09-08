'use server';

import { query, filterSkills, SkillFilters } from '@/lib/db';

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

// ✅ 防弹加固版：蜜罐诱捕 + 强正则 + 长度限制
export async function submitSkillUrl(formData: FormData) {
    // 🔒 1. 蜜罐检测：机器人自动填入此隐藏字段则直接拦截
    const honeypot = formData.get('company_verification_hp')?.toString().trim();
    if (honeypot) {
        // 伪装成成功，让黑客脚本误以为得逞，避免其换 IP 重新攻击
        return { success: true, message: '✓ Skill submitted successfully!' };
    }

    const rawUrl = formData.get('repo_url')?.toString().trim() || '';
    const rawEmail = formData.get('email')?.toString().trim() || '';
    const rawNotes = formData.get('notes')?.toString().trim() || '';

    // 🔒 2. 强类型长度截断（防超大 Payload 刷库）
    const repoUrl = rawUrl.slice(0, 255);
    const email = rawEmail ? rawEmail.slice(0, 100) : null;
    const notes = rawNotes ? rawNotes.slice(0, 500) : null;

    if (!repoUrl) {
        return { success: false, error: 'Please enter a valid GitHub URL.' };
    }

    // 🔒 3. 严格 GitHub URL 白名单正则 (必须以 https://github.com/ 开头且包含 owner/repo)
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+(\/.*)?$/;
    if (!githubRegex.test(repoUrl)) {
        return {
            success: false,
            error: 'Invalid URL format. Please provide a standard GitHub repository link (e.g. https://github.com/owner/repo).'
        };
    }

    try {
        await query(
            `INSERT INTO skill_submissions (repo_url, email, notes) VALUES (?, ?, ?)`,
            [repoUrl, email, notes]
        );
        return {
            success: true,
            message: '✓ Skill submitted successfully! Our automated scanner will inspect and index your skill within 24 hours.'
        };
    } catch (error) {
        console.error("Failed to insert submission:", error);
        return { success: false, error: 'Submission failed. Please try again later.' };
    }
}