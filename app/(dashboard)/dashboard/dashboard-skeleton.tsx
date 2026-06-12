import { Loader2 } from 'lucide-react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 animate-pulse">
      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border/60 p-5 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded-full" />
            </div>
            <div className="h-8 w-16 bg-muted rounded-lg" />
            <div className="h-3 w-32 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Block Skeleton */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted rounded-md" />
          <div className="h-3 w-72 bg-muted/60 rounded" />
        </div>

        {/* List Rows Skeleton */}
        <div className="space-y-4 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border bg-background/50 p-5 rounded-xl flex items-center justify-between shadow-sm">
              <div className="space-y-2.5 w-2/3">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-3 w-24 bg-muted/60 rounded" />
              </div>
              <div className="h-8 w-24 bg-muted rounded-lg hidden sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Small backup text indicator in case the skeleton takes an extra second */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
        <span>Syncing dashboard data...</span>
      </div>
    </div>
  );
}