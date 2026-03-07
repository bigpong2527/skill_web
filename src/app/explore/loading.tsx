export default function ExploreLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
