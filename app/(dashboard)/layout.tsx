import { UserButton } from '@clerk/nextjs';
import { Layers3 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { MainNav } from '@/components/main-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950/20">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Layers3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold tracking-tight text-sm sm:text-base">SimplePolls</span>
            </Link>

            <Suspense>
              <MainNav />
            </Suspense>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Suspense fallback={<div className="w-8 h-8 rounded-full bg-muted animate-pulse" />}>
              <UserButton />
            </Suspense>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}