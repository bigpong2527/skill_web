import { NextRequest, NextResponse } from 'next/server';
import { filterSkills } from '@/lib/db';
import { AuthorType, Complexity } from '@/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    // 🚨 核心防御：验证接头暗号 (保护数据库不被脚本直刷)
    const clientHeader = request.headers.get('x-skills-client');
    if (clientHeader !== 'web-app-v1') {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const searchParams = request.nextUrl.searchParams;
    const authorName = searchParams.get('authorName')?.slice(0, 50) || undefined;

    const offsetRaw = parseInt(searchParams.get('offset') || '0', 10);
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    // 🛡️ 超过 200 行直接在 Edge 层返回空数据（作者查询放宽至 2000 行）
    const maxOffset = authorName ? 2000 : 200;
    if (offset >= maxOffset) {
        return NextResponse.json([], {
            headers: {
                'Cache-Control': 'public, s-maxage=604800, max-age=86400, stale-while-revalidate=86400',
            }
        });
    }

    const limitRaw = parseInt(searchParams.get('limit') || '12', 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 12;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const authorType = (searchParams.get('authorType') || undefined) as AuthorType | undefined;
    const complexity = (searchParams.get('complexity') || undefined) as Complexity | undefined;
    const keywordsParam = searchParams.get('keywords');
    const keywords = keywordsParam ? keywordsParam.split(',').map(k => k.trim()) : undefined;

    try {
        const skills = await filterSkills({
            limit, offset, categorySlug, searchQuery, authorType, complexity, keywords, authorName
        });
        return NextResponse.json(skills, {
            headers: {
                'Cache-Control': 'public, s-maxage=604800, max-age=86400, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}
