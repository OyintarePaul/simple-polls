import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Users, Calendar } from 'lucide-react';
import { Poll } from '@/models/Poll';
import connectToDb from "@/database/connection"

interface PageProps {
  params: Promise<{ pollId: string }>;
}

export default async function PollAnalyticsPage({ params }: PageProps) {
  const { pollId } = await params;

  await connectToDb();
  const poll = await Poll.findById(pollId).lean();

  // Guard: Ensure the poll exists
  if (!poll) return notFound();

  // 1. Calculate metrics
  const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.voteCount, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6 px-4">
      {/* Header breadcrumb routing */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-slate-200 transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Workspace
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
            Pipeline Insights
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            {poll.question}
          </p>
        </div>

        {/* Live Status Tag */}
        <div className="self-start sm:self-center">
          {poll.isActive ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live & Gathering
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Pipeline Paused
            </span>
          )}
        </div>
      </div>

      <hr className="border-slate-900" />

      {/* Macro Scoreboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Footprint</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-100">{totalVotes}</p>
          <p className="text-[11px] text-slate-400">Unique device-verified responses</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Target Options</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-100">{poll.options.length}</p>
          <p className="text-[11px] text-slate-400">Available selection metrics</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Created</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-slate-200 pt-1.5">
            {new Date(poll.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-[11px] text-slate-400">Intake initialization date</p>
        </div>
      </div>

      {/* Dynamic Data Result Metrics */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-200">Response Distribution</h2>
          <p className="text-xs text-slate-400">Real-time percentage breakdown across options.</p>
        </div>

        <div className="space-y-5">
          {poll.options.map((option: any) => {
            // Compute percentage cleanly, shielding against division by zero
            const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;

            return (
              <div key={option._id.toString()} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-300">{option.text}</span>
                  <span className="text-slate-400 font-mono">
                    {option.voteCount} <span className="text-xs text-muted-foreground">({percentage}%)</span>
                  </span>
                </div>
                {/* Custom responsive metric tracking bar */}
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/20"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}