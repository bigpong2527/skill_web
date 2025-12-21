'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeContext';
import { t } from '@/lib/i18n';

const SearchBar: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useTheme();

    const initialQuery = searchParams.get('q') || '';
    const [localSearch, setLocalSearch] = useState(initialQuery);

    useEffect(() => {
        setLocalSearch(initialQuery);
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (localSearch.trim()) {
            params.set('q', localSearch.trim());
        } else {
            params.delete('q');
        }
        router.push(`/explore?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full md:w-auto md:min-w-[300px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
                type="text"
                placeholder={t('explore.search_placeholder', language)}
                className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 pl-10 pr-4 py-1 text-sm text-slate-900 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:dark:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
        </form>
    );
};

export default SearchBar;
