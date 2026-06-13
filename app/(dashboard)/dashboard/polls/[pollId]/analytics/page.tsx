import { notFound } from 'next/navigation';
import { ArrowLeft, BarChart3, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

import { getPollDetailsWithVoteCounts } from "@/data/poll";
import { requireAuth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ pollId: string }>;
}

export default async function PollAnalyticsPage({ params }: PageProps) {
  await requireAuth()

  const { pollId } = await params;
  const poll = await getPollDetailsWithVoteCounts(pollId);
  if (!poll) return notFound();

  // 1. Semantic Status Logic (Matching your Dashboard pattern)
  const isExpired = poll.expiresAt ? new Date().getTime() > new Date(poll.expiresAt).getTime() : false;
  const isPaused = !poll.isActive && !isExpired;
  const isActiveLive = poll.isActive && !isExpired;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-10 space-y-8 min-h-screen bg-black text-slate-200">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-neutral-900 pb-8">
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            Return to Workspace
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">Analytics Intelligence</h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl font-medium">
              {poll.question}
            </p>
          </div>
        </div>

        {/* Status Badge (Matching Dashboard Style) */}
        <div className="flex items-center">
            {isExpired && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-neutral-900 text-neutral-500 px-3 py-1 rounded-md uppercase tracking-wider border border-neutral-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                    Archive / Ended
                </span>
            )}
            {isActiveLive && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md uppercase tracking-wider border border-emerald-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Transmission
                </span>
            )}
            {isPaused && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-md uppercase tracking-wider border border-amber-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Engine Paused
                </span>
            )}
        </div>
      </div>

      {/* Metrics Banner (Direct clone of your Dashboard pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Intake', val: poll.totalVotes, icon: Users, sub: "Unique submissions" },
          { label: 'Choice Nodes', val: poll.options.length, icon: BarChart3, sub: "Available segments" },
          { label: 'Origin Date', val: new Date(poll.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }), icon: Calendar, isDate: true },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{m.label}</p>
              <m.icon className="w-3.5 h-3.5 text-neutral-600" />
            </div>
            <p className={`font-bold tracking-tight text-white ${m.isDate ? 'text-lg' : 'text-3xl font-mono'}`}>
              {m.val}
            </p>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold tracking-tight text-white">
                Data Distribution
            </h2>
            <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-md uppercase">
                Real-time Sync
            </span>
        </div>

        <div className="rounded-2xl border border-neutral-900 bg-neutral-950/30 p-6 sm:p-8 space-y-8">
            <div className="space-y-6">
            {poll.options.map((option: any) => {
                const percentage = poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0;

                return (
                <div key={option._id.toString()} className="space-y-3 group">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Choice</span>
                            <p className="text-sm font-medium text-neutral-200">{option.text}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold font-mono text-white">{option.voteCount}</span>
                            <span className="text-xs font-bold text-neutral-500 ml-2">[{percentage}%]</span>
                        </div>
                    </div>
                    
                    {/* Industrial Progress Bar */}
                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-neutral-900 p-[1px]">
                        <div
                            className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </div>
  );
}