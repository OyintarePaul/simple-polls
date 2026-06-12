import { Suspense } from 'react';
import DashboardList from './dashboard-list';
import { CreatePollModal } from '@/components/create-poll-modal';
import DashboardSkeleton from './dashboard-skeleton';

export default async function DashboardPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 space-y-8 min-h-screen">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Poll Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, distribute, and track user sentiment analytics across the grid.
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <CreatePollModal />
        </div>
      </div>




      {/* Main Interactive Control List */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardList />
      </Suspense>
    </div>
  );
}