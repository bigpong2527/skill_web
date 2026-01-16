import { NextRequest, NextResponse } from 'next/server';
import { filterSkills } from '@/lib/db';
import { AuthorType, Complexity } from '@/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
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
        return NextResponse.json(skills);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}
