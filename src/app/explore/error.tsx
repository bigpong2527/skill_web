'use client';

import React from 'react';

export default function ExploreError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="text-center max-w-md">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to load skills</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    {error.message || 'Could not fetch skills. Please try again.'}
                </p>
                <button
                    onClick={reset}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
