import { Metadata } from 'next';
import { getHotSkills, getSkillsMaxId } from '@/lib/db';
import OpenClawPageContent from '@/components/client/OpenClawPageContent';

export const runtime = 'edge';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
    const totalSkillsRaw = await getSkillsMaxId();
    const thousands = Math.floor(totalSkillsRaw / 1000);
    const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();
    const description = `${formattedCount}+ vetted agent skills for OpenClaw. One command to install. Search, discover, and supercharge your OpenClaw agent.`;

    return {
        title: `OpenClaw Skills — ${formattedCount}+ Agent Skills for OpenClaw | skills.rest`,
        description,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.rest'),
        alternates: { canonical: '/openclaw' },
        keywords: ['openclaw skills', 'openclaw agent skills', 'openclaw skill library', 'skills for openclaw', 'openclaw ai tools'],
        openGraph: {
            title: `OpenClaw Skills — ${formattedCount}+ Agent Skills for OpenClaw | skills.rest`,
            description,
            url: 'https://skills.rest/openclaw',
            siteName: 'skills.rest',
            type: 'website',
            images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'OpenClaw Skills Library' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `OpenClaw Skills — ${formattedCount}+ Agent Skills for OpenClaw | skills.rest`,
            description,
            images: ['/og-image.png'],
        },
    };
}

export default async function OpenClawPage() {
    const [hotSkills, totalSkills] = await Promise.all([
        getHotSkills(6),
        getSkillsMaxId(),
    ]);
    return <OpenClawPageContent hotSkills={hotSkills} totalSkills={totalSkills} />;
}
