"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Workspace', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="hidden md:flex gap-6">
      {navItems.map((item) => {
        // Match exactly for workspace, or check prefix for sub-routes like /dashboard/analytics
        const isActive = item.href === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-1 relative ${
              isActive 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
            
            {/* Optional: Subtle accent line underneath the active item */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}