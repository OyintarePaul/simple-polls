import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (



    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Visual Anchor Container */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full transition-all duration-500 group-hover:bg-primary/20" />

        {/* Flat native primitive shell replacing the custom slate box */}
        <div className="relative w-20 h-20 bg-card border border-border/80 rounded-2xl flex items-center justify-center shadow-xl">
          <FileQuestion className="w-10 h-10 text-primary" />
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          The page you are looking for might have been{" "}
          <span className="text-foreground font-semibold">removed</span>,{" "}
          <span className="text-foreground font-semibold">renamed</span>, or is
          temporarily unavailable.
        </p>
      </div>

      {/* Action Workspace */}
      <div className="mt-10">
        <Button
          asChild
          variant="outline"
          className="h-11 px-6 gap-2 border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm transition-all"
        >
          <Link href="/">
            <MoveLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}