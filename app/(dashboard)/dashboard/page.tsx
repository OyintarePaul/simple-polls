// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardList from './dashboard-list';
import { getDashboardPollsByCreator } from '@/services/poll-service';

export default async function DashboardPage() {
  // 1. Enforce authentication lock at the layout root
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const polls = await getDashboardPollsByCreator(userId);
  const globalMetrics = {
    totalPolls: polls.length,
    activePolls: polls.filter(p => p.isActive).length,
    cumulativeVotes: polls.reduce((acc, p) => acc + p.totalVotes, 0),
  };

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
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Engines', val: globalMetrics.totalPolls },
          { label: 'Active Live Links', val: globalMetrics.activePolls },
          { label: 'Cumulative Data Votes', val: globalMetrics.cumulativeVotes },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold mt-2 font-mono tracking-tight">{m.val}</p>
          </div>
        ))}
      </div>

      {/* Main Interactive Control List */}
      <DashboardList initialPolls={polls} />
    </div>
  );
}