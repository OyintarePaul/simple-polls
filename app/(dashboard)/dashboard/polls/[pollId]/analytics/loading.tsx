import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
            {/* Header Panel Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
                <div className="space-y-3 w-full max-w-xl">
                    {/* Return to Workspace Link Skeleton */}
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="w-3 h-3" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full opacity-70" />
                    </div>
                </div>

                {/* Status Badge Skeleton */}
                <Skeleton className="h-6 w-28 rounded-md" />
            </div>

            {/* Metrics Banner Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                    </Card>
                ))}
            </div>

            {/* Main Analysis Section Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                </div>

                {/* Option Distribution List Skeleton Container */}
                <Card className="p-6 sm:p-8 space-y-4 !rounded-2xl">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border bg-card p-4 rounded-xl flex items-center justify-between gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-10 opacity-70" />
                                <Skeleton className="h-4 w-40 sm:w-64" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-10 font-mono" />
                                <Skeleton className="h-6 w-12 rounded-md" />
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    )
}