import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeContext';
import { EnvironmentProvider } from '@/components/providers/EnvironmentContext';
import Header from '@/components/client/Header';
import Footer from '@/components/server/Footer';
import WebSiteStructuredData from '@/components/WebSiteStructuredData';

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

// ✅ 更新全局兜底文案 (写死一个安全的千位数作为默认值)
const defaultDescription = '113,000+ vetted agent skills for OpenClaw, Claude & Codex. One click to connect the library to your agent. Use on demand.';

export const metadata: Metadata = {
    title: 'Agent Skills Library | skills.rest',
    description: defaultDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Agent Skills Library | skills.rest',
        description: defaultDescription,
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
        title: 'Agent Skills Library | skills.rest',
        description: defaultDescription,
        images: ['/og-image.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 min-h-screen flex flex-col`}>
                <div className="noise-overlay"></div>

                <ThemeProvider>
                    <EnvironmentProvider>
                        <WebSiteStructuredData />
                        <Header />
                        <main className="flex-grow relative z-10">
                            {children}
                        </main>
                        <Footer />
                    </EnvironmentProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
