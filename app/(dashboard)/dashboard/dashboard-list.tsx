import Link from 'next/link';
import { Layers3, Plus } from 'lucide-react';

import { TogglePollStatus } from "@/components/toggle-poll-status";
import { CreatePollModal } from '@/components/create-poll-modal';
import CopyButton from '@/components/copy-button';
import { DeletePoll } from '@/components/delete-poll';
import { LaunchPoll } from '@/components/launch-poll';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
            <Card className="max-w-md mx-auto my-8 p-12 text-center space-y-5 border-dashed bg-muted/20">
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full border bg-background text-muted-foreground shadow-inner">
                    <Layers3 className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-semibold">No polls deployed</h3>
                    <p className="max-w-70 mx-auto text-xs text-muted-foreground leading-relaxed">
                        Create your first public or private poll structure to open data intake links.
                    </p>
                </div>

                <div className="pt-2 flex justify-center">
                    <CreatePollModal
                        trigger={
                            <Button>
                                <Plus className="w-4 h-4" />
                                <span>Create Your First Poll</span>
                            </Button>
                        }
                    />
                </div>
            </Card>
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
                    <Card key={i} className="rounded-xl p-5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
                        <p className="text-2xl font-bold font-mono tracking-tight">{m.val}</p>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                        All Poll Records
                    </h2>
                    <Badge className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5">
                        {polls.length} Created
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {polls.map((poll) => {
                        // 1. Precompute semantic status states for cleaner logic down below
                        const isExpired = new Date().getTime() > new Date(poll.expiresAt).getTime();
                        const isPaused = !poll.isActive && !isExpired;
                        const isActiveLive = poll.isActive && !isExpired;

                        return (
                            <Card
                                key={poll._id.toString()}
                                className={`group rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-border/80 transition-all shadow-sm ${
                                    // If the poll is paused or expired, soften its visual container weight
                                    !isActiveLive ? 'opacity-75 bg-muted/30' : ''
                                    }`}
                            >
                                {/* Core Info Panel */}
                                <div className="space-y-2 max-w-xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Dynamic Status Badges rendering based on state */}
                                        {isExpired && (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                                Ended
                                            </Badge>
                                        )}

                                        {isActiveLive && (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Accepting Responses
                                            </Badge>
                                        )}

                                        {isPaused && (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                Paused
                                            </Badge>
                                        )}

                                        <span className="text-xs text-muted-foreground font-mono">
                                            {new Date(poll.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </span>
                                    </div>

                                    <h3 className={`font-semibold tracking-tight leading-snug ${isActiveLive ? 'text-foreground' : 'text-muted-foreground line-through'
                                        }`}>
                                        {poll.question}
                                    </h3>
                                </div>

                                {/* Action Interaction Controls */}
                                <div className="flex items-center gap-2 self-end sm:self-center border-t border-border/40 pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto justify-end">
                                    <Link href={`/dashboard/polls/${poll._id.toString()}/analytics`} className="text-right px-4 hidden md:block group hover:opacity-80 transition-opacity">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Responses</p>
                                        <p className="text-base font-bold font-mono">{poll.totalVotes}</p>
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
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}