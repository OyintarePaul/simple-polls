import { Loader2 } from 'lucide-react';

export default function GlobalAnalyticsLoading() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 animate-pulse">
            {/* Top Header Skeleton */}
            <div className="space-y-3">
                <div className="h-8 w-56 bg-slate-800 rounded-lg" />
                <div className="h-4 w-80 bg-slate-800/60 rounded-md" />
            </div>

            <hr className="border-slate-900" />

            {/* Core Summary Cards (Across all polls) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-900/60 p-5 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-3 w-28 bg-slate-800 rounded" />
                            <div className="h-4 w-4 bg-slate-800 rounded-full" />
                        </div>
                        <div className="h-8 w-20 bg-slate-800 rounded-lg" />
                        <div className="h-3 w-36 bg-slate-800/60 rounded" />
                    </div>
                ))}
            </div>

            {/* Main Trends / Chart Area Skeleton */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-5 w-44 bg-slate-800 rounded-md" />
                        <div className="h-3 w-64 bg-slate-800/60 rounded" />
                    </div>
                    {/* Mock Timeframe Selector Button */}
                    <div className="h-9 w-32 bg-slate-800/80 rounded-lg self-start sm:self-center" />
                </div>

                {/* Big Performance Chart Area Placeholder */}
                <div className="h-64 w-full bg-slate-950/40 border border-slate-900/80 rounded-xl flex items-end justify-between p-6 gap-2 sm:gap-4 pt-12">
                    {[40, 70, 55, 90, 35, 60, 80, 45, 95, 65, 50, 75].map((height, i) => (
                        <div
                            key={i}
                            className="w-full bg-slate-900 rounded-t-md opacity-40 transition-all"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Top Performing Items Section */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="h-5 w-36 bg-slate-800 rounded-md" />

                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-12 w-full bg-slate-900/30 rounded-xl border border-slate-900 flex items-center justify-between px-4">
                            <div className="h-3 w-1/3 bg-slate-800 rounded" />
                            <div className="h-3 w-16 bg-slate-800 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                Aggregating system analytics...
            </div>
        </div>
    );
}