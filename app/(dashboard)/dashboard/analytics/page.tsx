import { Suspense } from "react";
import AnalyticsData from "./analytics-data";
import AnalyticsSkeleton from "./analytics-skeleton";

export default async function GlobalAnalyticsPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto py-6 px-4">
            {/* Header Text */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overall Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Total stats and performance across all your polls.
                    </p>
                </div>
            </div>

            <Suspense fallback={<AnalyticsSkeleton />}>
                <AnalyticsData />
            </Suspense>
        </div>
    );
}