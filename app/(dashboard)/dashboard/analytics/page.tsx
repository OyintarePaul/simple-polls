import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BarChart3, Users, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Poll } from '@/models/Poll';
import connectToDb from "@/database/connection";
import Link from 'next/link';

export default async function GlobalAnalyticsPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    await connectToDb();

    // 1. Fetch all raw poll data owned by this specific creator
    const polls = await Poll.find({ creatorId: userId }).lean();

    // 2. Perform aggregate math transformations on the data stream
    const totalPolls = polls.length;
    const activePolls = polls.filter((p: any) => p.isActive).length;
    const pausedPolls = totalPolls - activePolls;

    const totalVotesAcrossPlatform = polls.reduce((sum: number, poll: any) => {
        const pollVotes = poll.options.reduce((optSum: number, opt: any) => optSum + opt.voteCount, 0);
        return sum + pollVotes;
    }, 0);

    // 3. Sort to isolate the top-performing intake funnels
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
        <div className="space-y-8 max-w-5xl mx-auto py-6 px-4">
            {/* Structural Header Context */}
            <div className="space-y-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                    Global Performance Overview
                </h1>
                <p className="text-sm text-slate-400 font-medium">
                    Aggregated collection health metrics across your entire voting network.
                </p>
            </div>

            <hr className="border-slate-900" />

            {/* Aggregate Scoreboards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Captured Data Card */}
                <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Gross Responses</span>
                        <Users className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-slate-100">{totalVotesAcrossPlatform}</p>
                    <p className="text-[11px] text-slate-400">Aggregated device footprint</p>
                </div>

                {/* Total Tunnels Active Card */}
                <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Pipelines</span>
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-slate-100">{totalPolls}</p>
                    <p className="text-[11px] text-slate-400">Initialized question paths</p>
                </div>

                {/* Active Intake Card */}
                <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Live Intake</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-emerald-400">{activePolls}</p>
                    <p className="text-[11px] text-slate-400">Open to public collection</p>
                </div>

                {/* Closed/Paused Tunnels Card */}
                <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-wider">Paused Intake</span>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold font-mono text-amber-400">{pausedPolls}</p>
                    <p className="text-[11px] text-slate-400">Temporarily blocking routes</p>
                </div>
            </div>

            {/* Top Performing Volume Highlights Section */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-200">Highest Volume Channels</h2>
                    <p className="text-xs text-slate-400">Your top performing pipelines ranked by total vote footprint.</p>
                </div>

                {totalPolls === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-900 rounded-xl space-y-2">
                        <Activity className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
                        <p className="text-sm text-slate-300 font-medium">No active streaming pipelines detected.</p>
                        <p className="text-xs text-slate-500">Create a poll from your workspace to initialize global monitoring trackers.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topPolls.map((poll) => {
                            // Calculate proportion against the total platform scale for a cool inner chart visual
                            const platformShare = totalVotesAcrossPlatform > 0
                                ? Math.round((poll.totalVotes / totalVotesAcrossPlatform) * 100)
                                : 0;

                            return (
                                <Link
                                    key={poll.id}
                                    href={`/dashboard/polls/${poll.id}/analytics`}
                                    className="group bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 p-5 rounded-xl block transition-all duration-200 hover:border-slate-800"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-sm font-bold text-slate-300 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {poll.question}
                                            </h3>
                                            {poll.isActive ? (
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-sm shadow-emerald-500" />
                                            ) : (
                                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                                            )}
                                        </div>

                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex justify-between text-xs text-slate-400 font-medium">
                                                <span>{poll.totalVotes} responses logged</span>
                                                <span className="font-mono text-muted-foreground">{platformShare}% share</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-all duration-300"
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
        </div>
    );
}