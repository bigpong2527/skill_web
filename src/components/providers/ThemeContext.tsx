'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Language } from '@/lib/i18n';

type Theme = 'dark' | 'light';

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    toggleTheme: () => { },
    language: 'en',
    setLanguage: () => { },
});

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem('skills-theme') as Theme;
        if (storedTheme) setTheme(storedTheme);

        const storedLang = localStorage.getItem('skills-lang') as Language;
        if (storedLang) setLanguageState(storedLang);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('skills-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('skills-lang', lang);
    };

    // Prevent hydration mismatch by not rendering theme-dependent classes until mounted
    // Or just render children, but theme effect is in useEffect
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
