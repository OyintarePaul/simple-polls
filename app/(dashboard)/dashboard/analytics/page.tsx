import { Suspense } from "react";

import AnalyticsSkeleton from "./analytics-skeleton";
import AnalyticsData from "./analytics-data";
import { requireAuth } from "@/lib/auth";

export default async function GlobalAnalyticsPage() {
    await requireAuth();
    return (
        <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
            {/* Header Panel */}
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