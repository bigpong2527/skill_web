import { NextRequest, NextResponse } from 'next/server';
import { getSkillBySlug } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json(
            { error: 'Missing slug parameter' },
            { status: 400 }
        );
    }

    try {
        const skill = await getSkillBySlug(slug);

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        // Provide detailed diagnostic info
        return NextResponse.json({
            slug: skill.slug,
            name: skill.name,
            dependencies: {
                raw: skill.dependencies,
                type: typeof skill.dependencies,
                isNull: skill.dependencies === null,
                isEmpty: skill.dependencies === '',
                length: skill.dependencies?.length || 0,
                firstChars: skill.dependencies?.substring(0, 50),
            },
            components: {
                raw: skill.components,
                type: typeof skill.components,
                isNull: skill.components === null,
                isEmpty: skill.components === '',
                length: skill.components?.length || 0,
                firstChars: skill.components?.substring(0, 50),
            },
            full_record: skill,
            message: 'Diagnostic endpoint for skills.rest',
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to fetch skill data',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
