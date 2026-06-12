import { Users, BarChart3, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import Link from 'next/link';
import { Poll } from '@/models/Poll';
import connectToDb from "@/database/connection";
import { requireAuth } from '@/lib/auth';

export default async function AnalyticsData() {
    const userId = await requireAuth();
    await connectToDb();

    // 1. Fetch all poll data owned by this specific creator
    const polls = await Poll.find({ creatorId: userId }).lean();

    // 2. Perform math transformations on the data stream
    const totalPolls = polls.length;
    const activePolls = polls.filter((p: any) => p.isActive).length;
    const pausedPolls = totalPolls - activePolls;

    const totalVotesAcrossPlatform = polls.reduce((sum: number, poll: any) => {
        const pollVotes = poll.options.reduce((optSum: number, opt: { voteCount: number }) => optSum + opt.voteCount, 0);
        return sum + pollVotes;
    }, 0);

    // 3. Sort to isolate the top-performing polls
    const topPolls = [...polls]
        .map((poll: any) => {
            const votes = poll.options.reduce((sum: number, opt: any) => sum + opt.voteCount, 0);
            return {
                id: poll._id.toString(),
                question: poll.question,
                totalVotes: votes,
                isActive: poll.isActive,
            };
        })
        .sort((a, b) => b.totalVotes - a.totalVotes)
        .slice(0, 4); // Display top 4 standouts
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Votes Card */}
                <div className="bg-card border border-border p-5 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Votes</span>
                        <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-foreground">{totalVotesAcrossPlatform}</p>
                    <p className="text-[11px] text-muted-foreground">Votes from all devices</p>
                </div>

                {/* Total Polls Card */}
                <div className="bg-card border border-border p-5 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Polls</span>
                        <BarChart3 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-foreground">{totalPolls}</p>
                    <p className="text-[11px] text-muted-foreground">Created questions</p>
                </div>

                {/* Active Polls Card */}
                <div className="bg-card border border-border p-5 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Active Polls</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{activePolls}</p>
                    <p className="text-[11px] text-muted-foreground">Open for voting</p>
                </div>

                {/* Paused Polls Card */}
                <div className="bg-card border border-border p-5 rounded-xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Paused Polls</span>
                        <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{pausedPolls}</p>
                    <p className="text-[11px] text-muted-foreground">Closed to the public</p>
                </div>
            </div>

            {/* Top Performing Polls Section */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Most Popular Polls</h2>
                    <p className="text-xs text-muted-foreground">Your top polls ranked by total number of votes.</p>
                </div>

                {totalPolls === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl space-y-2">
                        <Activity className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
                        <p className="text-sm text-foreground font-medium">No polls found.</p>
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
                                    key={poll.id}
                                    href={`/dashboard/polls/${poll.id}/analytics`}
                                    className="group bg-background hover:bg-muted/50 border border-border p-5 rounded-xl block transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-800 shadow-sm"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-sm font-bold text-foreground/90 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {poll.question}
                                            </h3>
                                            {poll.isActive ? (
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-sm shadow-emerald-500" />
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
                                                    className="h-full bg-indigo-500 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-all duration-300"
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
            </div>
        </>
    )
}