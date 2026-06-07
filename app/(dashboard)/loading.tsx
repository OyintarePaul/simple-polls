import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-800/60 rounded-md" />
      </div>

      <hr className="border-slate-900" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-900/60 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-800 rounded" />
              <div className="h-4 w-4 bg-slate-800 rounded-full" />
            </div>
            <div className="h-8 w-16 bg-slate-800 rounded-lg" />
            <div className="h-3 w-32 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Block Skeleton */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-800 rounded-md" />
          <div className="h-3 w-72 bg-slate-800/60 rounded" />
        </div>

        {/* List Rows Skeleton */}
        <div className="space-y-4 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-slate-900 bg-slate-950/20 p-5 rounded-xl flex items-center justify-between">
              <div className="space-y-2.5 w-2/3">
                <div className="h-4 w-full bg-slate-800 rounded" />
                <div className="h-3 w-24 bg-slate-800/60 rounded" />
              </div>
              <div className="h-8 w-24 bg-slate-800 rounded-lg hidden sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Small backup text indicator in case the skeleton takes an extra second */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-4">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
        Syncing dashboard data...
      </div>
    </div>
  );
}