export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
                <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
