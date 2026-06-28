import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PollLoadingSkeleton() {
    return (
        <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center gap-8">
            {/* Header Section Skeleton */}
            <div className="text-center space-y-3 flex flex-col items-center">
                {/* Micro Status Badge Skeleton */}
                <Skeleton className="h-7 w-36 rounded-full bg-muted/80" />

                {/* Question Title Placeholder */}
                <Skeleton className="h-9 w-4/5 sm:w-2/3 bg-muted" />

                {/* Subtext Description Placeholder */}
                <div className="space-y-1.5 w-full max-w-sm pt-1">
                    <Skeleton className="h-4 w-full bg-muted/60" />
                    <Skeleton className="h-4 w-5/6 mx-auto bg-muted/60" />
                </div>
            </div>

            {/* Voting Form / Card Wrapper Skeleton */}
            <Card className="w-full border-border shadow-xl backdrop-blur-md relative overflow-hidden bg-card text-card-foreground">
                {/* Locked Top Accent Bar Position Placeholder */}
                <Skeleton className="absolute top-0 left-0 right-0 h-1.5 rounded-none bg-muted/50" />

                <CardHeader className="space-y-2 pt-8">
                    <CardTitle className="space-y-2">
                        {/* Dynamic Poll Question Line Placeholders */}
                        <Skeleton className="h-7 w-11/12 bg-muted" />
                        <Skeleton className="h-7 w-3/4 bg-muted" />
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 relative">
                    {/* Mimics the Standard 4-Option List Configuration */}
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="w-full p-4 rounded-xl border border-border/40 bg-card flex items-center justify-between"
                        >
                            {/* Option Text Label Placeholder */}
                            <Skeleton className="h-5 w-1/3 bg-muted/60" />

                            {/* Right Side Selection Node Indicator Placeholder */}
                            <Skeleton className="w-4 h-4 rounded-full bg-muted/40 shrink-0" />
                        </div>
                    ))}
                </CardContent>

                {/* Form Action Footer Container Skeleton */}
                <div className="bg-muted/30 border-t border-border/80 px-6 py-4 flex justify-end">
                    {/* Submit Action Button Placeholder */}
                    <Skeleton className="h-10 w-36 rounded-md bg-muted" />
                </div>
            </Card>
        </main>
    );
}