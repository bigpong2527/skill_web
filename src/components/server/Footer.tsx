import React from 'react';

import { t } from '@/lib/i18n';

const Footer: React.FC = () => {
    const language = 'en';
    return (
        <footer className="mt-auto border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 py-12 relative transition-colors duration-300">
            {/* Footer Glow */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-20"></div>

            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p>© 2026 skills.rest <span className="mx-2">|</span> {t('footer.operational', language)}</p>
                </div>
                <div className="flex gap-8 font-mono text-xs tracking-wider uppercase">
                    <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.privacy', language)}</a>
                    <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.terms', language)}</a>
                    <a href="/contribute" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.contribute', language)}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
