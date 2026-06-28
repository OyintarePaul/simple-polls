import { Suspense } from 'react';
import { Metadata } from "next";

import { CreatePollModal } from '@/components/create-poll-modal';
import DashboardSkeleton from './dashboard-skeleton';
import DashboardList from './dashboard-list';
import { requireAuth } from '@/lib/auth';


export const metadata: Metadata = {
  title: "Dashboard", // Automatically renders as "Dashboard | SimplePoll" thanks to your template
  description: "Manage your active polls, view real-time data intake streams, and explore advanced analytics metrics.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "User Dashboard | SimplePoll",
    description: "Manage your active polls and explore real-time voting data streams.",
    url: "https://yourdomain.com/dashboard",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "User Dashboard | SimplePoll",
    description: "Manage your active polls and explore real-time voting data streams.",
  },
};

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
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