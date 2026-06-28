import { Loader2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton'; 

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4">
      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border/60 p-5 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-3 w-32 opacity-60" />
          </div>
        ))}
      </div>

      {/* Main Content Block Skeleton */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72 opacity-60" />
        </div>

        {/* List Rows Skeleton */}
        <div className="space-y-4 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border bg-background/50 p-5 rounded-xl flex items-center justify-between shadow-sm">
              <div className="space-y-2.5 w-2/3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24 opacity-60" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Backup Text Sync Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        <span>Syncing dashboard data...</span>
      </div>
    </div>
  );
}