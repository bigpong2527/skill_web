import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeContext';
import { EnvironmentProvider } from '@/components/providers/EnvironmentContext';
import Header from '@/components/client/Header';
import Footer from '@/components/server/Footer';

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

export const metadata: Metadata = {
    title: 'Agent skills Library | skills.rest',
    description: 'Instantly deploy 8,000+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.',
    metadataBase: new URL(siteUrl), // ✅ 强制使用生产域名
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Agent skills Library | skills.rest',
        description: 'Instantly deploy 8,000+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.',
        url: siteUrl,
        siteName: 'skills.rest',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Agent skills Library',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Agent skills Library | skills.rest',
        description: 'Instantly deploy 8,000+ Agent skills with one click. The definitive library for Claude code skills, agent skills, and automation workflows—ready to run in minutes.',
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
