import { Loader2 } from 'lucide-react';

export default function AnalyticsSkeleton() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 animate-pulse">
            {/* Core Summary Cards (Across all polls) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card border border-border/60 p-5 rounded-xl space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="h-3 w-28 bg-muted rounded" />
                            <div className="h-4 w-4 bg-muted rounded-full" />
                        </div>
                        <div className="h-8 w-20 bg-muted rounded-lg" />
                        <div className="h-3 w-36 bg-muted/60 rounded" />
                    </div>
                ))}
            </div>

            {/* Main Trends / Chart Area Skeleton */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-5 w-44 bg-muted rounded-md" />
                        <div className="h-3 w-64 bg-muted/60 rounded" />
                    </div>
                    {/* Mock Timeframe Selector Button */}
                    <div className="h-9 w-32 bg-muted/80 rounded-lg self-start sm:self-center" />
                </div>

                {/* Big Performance Chart Area Placeholder */}
                <div className="h-64 w-full bg-background border border-border/80 rounded-xl flex items-end justify-between p-6 gap-2 sm:gap-4 pt-12">
                    {[40, 70, 55, 90, 35, 60, 80, 45, 95, 65, 50, 75].map((height, i) => (
                        <div
                            key={i}
                            className="w-full bg-muted rounded-t-md opacity-60 dark:opacity-40 transition-all"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Top Performing Items Section */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="h-5 w-36 bg-muted rounded-md" />

                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-12 w-full bg-background/50 rounded-xl border border-border flex items-center justify-between px-4 shadow-sm">
                            <div className="h-3 w-1/3 bg-muted rounded" />
                            <div className="h-3 w-16 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Aggregating system analytics...</span>
            </div>
        </div>
    );
}