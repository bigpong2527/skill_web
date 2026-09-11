import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeContext';
import { EnvironmentProvider } from '@/components/providers/EnvironmentContext';
import Header from '@/components/client/Header';
import Footer from '@/components/server/Footer';
import WebSiteStructuredData from '@/components/WebSiteStructuredData';
import { getSkillsMaxId } from '@/lib/db';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

// ✅ 确保这里是绝对路径，这对于 SEO 至关重要
const siteUrl = 'https://skills.rest';

// ✅ 动态读取数据库实时总数（0 硬编码）
export async function generateMetadata(): Promise<Metadata> {
    const totalSkillsRaw = await getSkillsMaxId();
    const thousands = Math.floor(totalSkillsRaw / 1000);
    const formattedCount = thousands > 0 ? `${thousands.toLocaleString('en-US')},000` : totalSkillsRaw.toString();

    const mainTitle = 'Agent Skills Library — ChatGPT & Claude Skills | skills.rest';
    const mainDesc = `${formattedCount}+ AI agent skills for ChatGPT, Claude & Gemini. Vetted. One-click install. 100% free. Updated daily.`;

    return {
        title: mainTitle,
        description: mainDesc,
        metadataBase: new URL(siteUrl),
        icons: {
            icon: '/icon.png',
            apple: '/apple-touch-icon.png',
        },
        alternates: {
            canonical: '/',
        },
        openGraph: {
            title: mainTitle,
            description: mainDesc,
            url: siteUrl,
            siteName: 'skills.rest',
            type: 'website',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'Agent Skills Library',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: mainTitle,
            description: mainDesc,
            images: ['/og-image.png'],
        },
    };
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const totalSkills = await getSkillsMaxId();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
            </head>
            <body className={`${inter.variable} ${jetbrainsMono.variable} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 min-h-screen flex flex-col`}>
                <div className="noise-overlay"></div>

                <ThemeProvider>
                    <EnvironmentProvider>
                        <WebSiteStructuredData totalSkills={totalSkills} />
                        <Header totalSkills={totalSkills} />
                        <main className="flex-grow relative z-10">
                            {children}
                        </main>
                        <Footer totalSkills={totalSkills} />
                    </EnvironmentProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
