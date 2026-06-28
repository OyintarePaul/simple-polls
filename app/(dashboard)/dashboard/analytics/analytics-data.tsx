import { Activity, AlertCircle, BarChart3, CheckCircle2, History, Users } from 'lucide-react';
import Link from 'next/link';

import { getUserAnalytics } from '@/data/analytics';
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';

export default async function AnalyticsData() {
    const userId = await requireAuth();
    const globalAnalytics = await getUserAnalytics(userId);

    const totalPolls = globalAnalytics.metrics.totalPolls;
    const activePolls = globalAnalytics.metrics.activePolls;
    const pausedPolls = globalAnalytics.metrics.pausedPolls;
    const expiredPolls = globalAnalytics.metrics.expiredPolls;
    const totalVotesAcrossPlatform = globalAnalytics.metrics.totalVotesAcrossPlatform;
    const topPolls = [...globalAnalytics.topPolls];
    return (
        <>
            {/* Overview Metrics Grid - Updated to 5 columns on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Votes Card */}
                <Card className="p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Votes</span>
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono">{totalVotesAcrossPlatform}</p>
                    <p className="text-[11px] text-muted-foreground">Votes from all devices</p>
                </Card>

                {/* Total Polls Card */}
                <Card className="p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Polls</span>
                        <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono">{totalPolls}</p>
                    <p className="text-[11px] text-muted-foreground">Created questions</p>
                </Card>

                {/* Active Polls Card */}
                <Card className="p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{activePolls}</p>
                    <p className="text-[11px] text-muted-foreground">Open for voting</p>
                </Card>

                {/* Paused Polls Card */}
                <Card className="p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Paused</span>
                        <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{pausedPolls}</p>
                    <p className="text-[11px] text-muted-foreground">Manually disabled</p>
                </Card>

                {/* Expired Polls Card - NEW */}
                <Card className="p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
                        <History className="w-4 h-4 text-destructive/90" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-destructive">{expiredPolls}</p>
                    <p className="text-[11px] text-muted-foreground">Reached time limit</p>
                </Card>
            </div>

            {/* Top Performing Polls Section */}
            <Card className="p-6 sm:p-8 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold">Most Popular Polls</h2>
                    <p className="text-xs text-muted-foreground">Your top polls ranked by total number of votes.</p>
                </div>

                {topPolls.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl space-y-2">
                        <Activity className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
                        <p className="text-sm font-medium">No polls found.</p>
                        <p className="text-xs text-muted-foreground">Create a poll from your workspace to see stats here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topPolls.map((poll) => {
                            const platformShare = totalVotesAcrossPlatform > 0
                                ? Math.round((poll.totalVotes / totalVotesAcrossPlatform) * 100)
                                : 0;

                            return (
                                <Link
                                    key={poll._id}
                                    href={`/dashboard/polls/${poll._id}/analytics`}
                                    className="group bg-background hover:bg-muted/50 border border-border hover:border-border/80 p-5 rounded-xl block transition-all duration-200 shadow-sm"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className={`text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 ${poll.isExpired ? 'text-muted-foreground line-through decoration-slate-400/50' : 'text-foreground/90'
                                                }`}>
                                                {poll.question}
                                            </h3>

                                            {/* 3-State Dynamic Status Dot */}
                                            {poll.isExpired ? (
                                                <div className="flex items-center gap-1.5 shrink-0 mt-1">
                                                    <span className="text-[10px] font-bold uppercase text-destructive tracking-tighter">Ended</span>
                                                    <span className="h-2 w-2 rounded-full bg-destructive" />
                                                </div>
                                            ) : poll.isActive ? (
                                                <span className="relative flex h-2 w-2 mt-1 shrink-0">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>

                                            ) : (
                                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                                            )}
                                        </div>

                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                                <span>{poll.totalVotes} votes</span>
                                                <span className="font-mono">{platformShare}% of total</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${poll.isExpired ? 'bg-primary/50' : 'bg-primary group-hover:bg-primary'
                                                        }`}
                                                    style={{ width: `${platformShare}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </Card>
        </>
    )
}