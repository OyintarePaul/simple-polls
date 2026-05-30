import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Layers3, LayoutDashboard, BarChart3, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950/20">
      {/* Universal Desktop/Mobile Workspace Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Layers3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold tracking-tight text-sm sm:text-base">PollGrid</span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              {[
                { label: 'Workspace', href: '/dashboard', icon: LayoutDashboard },
                { label: 'Analytics', href: '/analytics', icon: BarChart3 },
                { label: 'Settings', href: '/settings', icon: Settings },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Clerk User Management Portal */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Inner Content Body Injection Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}