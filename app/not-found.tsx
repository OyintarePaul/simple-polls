import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Plus } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      {/* Visual Anchor */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="relative w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl">
          <FileQuestion className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-3 max-w-sm">
        <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight sm:text-4xl">
          Poll Unavailable
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          This voting link is inactive. The poll may have concluded, been paused by its creator, or the URL might be incorrect.
        </p>
      </div>

      {/* Action: Turning a 404 into a growth loop */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/" passHref>
          <Button 
            className="h-10 px-5 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            Create Your Own Poll
          </Button>
        </Link>
      </div>

      {/* Subtle Bottom Border Detail */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-900 to-transparent" />
    </main>
  );
}