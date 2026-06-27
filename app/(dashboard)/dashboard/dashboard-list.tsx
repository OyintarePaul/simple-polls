import { Layers3, Plus } from 'lucide-react';
import Link from 'next/link';

import { TogglePollStatus } from "@/components/toggle-poll-status";
import { CreatePollModal } from '@/components/create-poll-modal';
import CopyButton from '@/components/copy-button';
import { DeletePoll } from '@/components/delete-poll';
import { LaunchPoll } from '@/components/launch-poll';
import { Button } from '@/components/ui/button';
import { getCreatorPollsWithVoteCounts } from '@/data/poll';
import { requireAuth } from '@/lib/auth';

export default async function DashboardList() {
    const userId = await requireAuth() // Ensure the user is authenticated before fetching polls
    const polls = await getCreatorPollsWithVoteCounts(userId);
    const globalMetrics = {
        totalPolls: polls.length,
        activePolls: polls.filter(p => p.isActive).length,
        cumulativeVotes: polls.reduce((acc, p) => acc + p.totalVotes, 0),
    };

    // Graceful blank slate layout check
    if (polls.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-5 my-8 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-muted-foreground border border-slate-100 dark:border-slate-800 shadow-inner">
                    <Layers3 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground ">No polls deployed</h3>
                    <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                        Create your first public or private poll structure to open data intake links.
                    </p>
                </div>

                <div className="pt-2 flex justify-center">
                    <CreatePollModal
                        trigger={
                            <Button className="bg-primary hover:bg-indigo-700 text-white font-medium text-xs h-9 px-4 shadow-md shadow-indigo-600/10 gap-2">
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
        <>
            {/* Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Polls', val: globalMetrics.totalPolls },
                    { label: 'Active Live Polls', val: globalMetrics.activePolls },
                    { label: 'Cumulative Votes', val: globalMetrics.cumulativeVotes },
                ].map((m, i) => (
                    <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
                        <p className="text-2xl font-bold mt-2 font-mono tracking-tight">{m.val}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground ">
                        All Poll Records
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                        {polls.length} Registered
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {polls.map((poll) => {
                        // 1. Precompute semantic status states for cleaner logic down below
                        const isExpired = new Date().getTime() > new Date(poll.expiresAt).getTime();
                        const isPaused = !poll.isActive && !isExpired;
                        const isActiveLive = poll.isActive && !isExpired;

                        return (
                            <div
                                key={poll._id.toString()}
                                className={`group rounded-xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm ${
                                    // If the poll is paused or expired, soften its visual container weight
                                    !isActiveLive ? 'opacity-75 bg-muted/30' : ''
                                    }`}
                            >
                                {/* Core Info Panel */}
                                <div className="space-y-2 max-w-xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Dynamic Status Badges rendering based on state */}
                                        {isExpired && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-500/10 text-muted-foreground px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-500/10">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-0.5" />
                                                Ended
                                            </span>
                                        )}

                                        {isActiveLive && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/10">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-0.5" />
                                                Accepting Responses
                                            </span>
                                        )}

                                        {isPaused && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-500/10">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-0.5" />
                                                Paused
                                            </span>
                                        )}

                                        <span className="text-xs text-muted-foreground font-mono">
                                            {new Date(poll.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </span>
                                    </div>

                                    <h3 className={`font-semibold tracking-tight leading-snug ${isActiveLive ? 'text-foreground dark:text-slate-100' : 'text-slate-500 line-through'
                                        }`}>
                                        {poll.question}
                                    </h3>
                                </div>

                                {/* Action Interaction Controls */}
                                <div className="flex items-center gap-2 sm:self-center self-end border-t pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-end border-slate-100 dark:border-slate-900">

                                    <Link href={`/dashboard/polls/${poll._id.toString()}/analytics`} className="text-right px-4 hidden md:block group hover:opacity-80 transition-opacity">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-indigo-400 transition-colors">Responses</p>
                                        <p className="text-base font-bold font-mono text-foreground ">{poll.totalVotes}</p>
                                    </Link>

                                    {/* Copy Share Trigger Button */}
                                    <CopyButton pollId={poll._id.toString()} />

                                    {/* View Active Route Target */}
                                    <LaunchPoll pollId={poll._id.toString()} />

                                    {/* New Toggle Status Button (Disabled if expired since an ended poll cannot be toggled back active) */}
                                    <TogglePollStatus
                                        pollId={poll._id.toString()}
                                        isActive={poll.isActive}
                                        disabled={isExpired}
                                    />

                                    {/* New Delete Button */}
                                    <DeletePoll pollId={poll._id.toString()} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}