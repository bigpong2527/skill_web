import { NextRequest, NextResponse } from 'next/server';
import { filterSkills } from '@/lib/db';
import { AuthorType, Complexity } from '@/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const limitRaw = parseInt(searchParams.get('limit') || '12', 10);
    const offsetRaw = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 12;
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const authorType = (searchParams.get('authorType') || undefined) as AuthorType | undefined;
    const complexity = (searchParams.get('complexity') || undefined) as Complexity | undefined;
    const keywordsParam = searchParams.get('keywords');
    const keywords = keywordsParam ? keywordsParam.split(',').map(k => k.trim()) : undefined;

    try {
        const skills = await filterSkills({
            limit, offset, categorySlug, searchQuery, authorType, complexity, keywords
        });
        return NextResponse.json(skills, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}
