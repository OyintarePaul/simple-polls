import { Button } from '@/components/ui/button';
import { Lock, Globe, Layers3, Plus, } from 'lucide-react';

import CopyButton from '@/components/copy-button';
import { CreatePollModal } from '@/components/create-poll-modal';
import { DeletePoll } from '@/components/delete-poll';
import { TogglePollStatus } from "@/components/toggle-poll-status";
import { LaunchPoll } from '@/components/launch-poll';

interface DashboardPoll {
    id: string;
    question: string;
    isPrivate: boolean;
    isActive: boolean;
    createdAt: string;
    totalVotes: number;
}

interface DashboardListProps {
    initialPolls: DashboardPoll[];
}

export default function DashboardList({ initialPolls }: DashboardListProps) {
    const polls = initialPolls;

    // Graceful blank slate layout check
    if (polls.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-5 my-8 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-slate-800 shadow-inner">
                    <Layers3 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-50">No polls deployed</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                        Create your first public or private poll structure to open data intake links.
                    </p>
                </div>

                <div className="pt-2 flex justify-center">
                    <CreatePollModal
                        trigger={
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-9 px-4 shadow-md shadow-indigo-600/10 gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create Your First Poll</span>
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Active Pipeline Records
                </h2>
                <span className="text-xs font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                    {polls.length} Registered
                </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {polls.map((poll) => {
                    return (
                        <div
                            key={poll.id}
                            className={`group rounded-xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm ${!poll.isActive ? 'opacity-75 bg-slate-50/40 dark:bg-slate-950/20' : ''
                                }`}
                        >
                            {/* Core Info Panel */}
                            <div className="space-y-2 max-w-xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    {poll.isActive ? (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/10">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-0.5" />
    Accepting Responses
  </span>
) : (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-500/10">
    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-0.5" />
    Paused
  </span>
)}
                                    {!poll.isActive && (
                                        <span className="inline-flex items-center text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-rose-500/10">
                                            Closed
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {new Date(poll.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </span>
                                </div>
                                <h3 className={`font-semibold tracking-tight leading-snug ${poll.isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'
                                    }`}>
                                    {poll.question}
                                </h3>
                            </div>

                            {/* Action Interaction Controls */}
                            <div className="flex items-center gap-2 sm:self-center self-end border-t pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-end border-slate-100 dark:border-slate-900">
                                <div className="text-right px-4 hidden md:block">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Responses</p>
                                    <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-50">{poll.totalVotes}</p>
                                </div>

                                {/* Copy Share Trigger Button */}
                                <CopyButton
                                    pollId={poll.id}
                                />

                                {/* View Active Route Target */}
                                <LaunchPoll pollId={poll.id} />

                                {/* 💡 New Toggle Status Button (Pause / Play Icon) */}
                                <TogglePollStatus pollId={poll.id} isActive={poll.isActive} />

                                {/* 💡 New Delete Button */}
                                <DeletePoll pollId={poll.id} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}