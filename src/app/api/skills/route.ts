import { NextRequest, NextResponse } from 'next/server';
import { filterSkills } from '@/lib/db';
import { AuthorType, Complexity } from '@/types';

// ✅ 强制使用 Edge Runtime，确保能获取 Cloudflare D1 Binding
export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // 1. 解析基础分页参数
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 2. 解析筛选参数
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    // 类型断言处理 (确保与数据库查询类型匹配)
    const authorType = (searchParams.get('authorType') || undefined) as AuthorType | undefined;
    const complexity = (searchParams.get('complexity') || undefined) as Complexity | undefined;

    // 处理关键词数组 (逗号分隔字符串转数组)
    const keywordsParam = searchParams.get('keywords');
    const keywords = keywordsParam ? keywordsParam.split(',').map(k => k.trim()) : undefined;

    try {
        // 3. 调用现有的数据库逻辑
        const skills = await filterSkills({
            limit,
            offset,
            categorySlug,
            searchQuery,
            authorType,
            complexity,
            keywords
        });

        // 4. 返回 JSON 数据
        return NextResponse.json(skills);
    } catch (error) {
        console.error('API Error in /api/skills:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills data' },
            { status: 500 }
        );
    }
}