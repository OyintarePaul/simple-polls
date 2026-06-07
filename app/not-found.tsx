import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      {/* Visual Anchor */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl">
          <FileQuestion className="w-10 h-10 text-indigo-400" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">
          Poll Not Found
        </h1>
        <p className="text-slate-400 leading-relaxed">
          The intake pipeline you are looking for has been <span className="text-slate-200">closed</span>, 
          <span className="text-slate-200"> moved</span>, or never existed in the first place.
        </p>
      </div>

      {/* Action */}
      <div className="mt-10">
        <Link href="/" passHref>
          <Button 
            variant="outline" 
            className="h-11 px-6 gap-2 border-slate-800 bg-slate-900/50 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <MoveLeft className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </Link>
      </div>

      {/* Subtle Background Detail */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50" />
    </main>
  );
}