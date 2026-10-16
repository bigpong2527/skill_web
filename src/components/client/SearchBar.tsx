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
        <form onSubmit={handleSearch} role="search" className="w-full md:w-auto md:min-w-[300px] relative">
            <label htmlFor="global-search-input" className="sr-only">
                {t('explore.search_placeholder', language)}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
                id="global-search-input"
                type="text"
                aria-label={t('explore.search_placeholder', language)}
                placeholder={t('explore.search_placeholder', language)}
                className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 pl-10 pr-9 py-1 text-sm text-slate-900 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:dark:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
                <button
                    type="button"
                    onClick={() => {
                        setLocalSearch('');
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('q');
                        router.push(`/explore?${params.toString()}`);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search query"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </form>
    );
};

export default SearchBar;
