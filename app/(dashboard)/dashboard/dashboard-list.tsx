import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, Lock, Globe, Layers3, CheckCircle2, Plus } from 'lucide-react';
import Link from 'next/link';
import CopyButton from '@/components/copy-button';
import { CreatePollModal } from '@/components/create-poll-modal';

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
    const polls = initialPolls

    const copyShareLink = async (pollId: string) => {
        // Generates a fully qualified URL based on current origin domain context
        const shareUrl = `${window.location.origin}/p/${pollId}`;

        try {
            await navigator.clipboard.writeText(shareUrl);

            // Native modern Sonner implementation hook
            toast.success('Share Link Copied', {
                description: 'The poll URL has been copied to your clipboard.',
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            });
        } catch (err) {
            toast.error('Failed to copy', {
                description: 'Could not write to device clipboard buffer.'
            });
        }
    };

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

            {/* 👇 Drop the Modal right here with a custom trigger styled for the center grid CTA */}
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
                    const dynamicShareUrl = typeof window !== 'undefined'
                        ? `${window.location.origin}/p/${poll.id}`
                        : `/p/${poll.id}`;
                    return (
                        <div
                            key={poll.id}
                            className={`group rounded-xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm ${!poll.isActive ? 'opacity-70 bg-slate-50/40 dark:bg-slate-950/20' : ''
                                }`}
                        >
                            {/* Core Info Panel */}
                            <div className="space-y-2 max-w-xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    {poll.isPrivate ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-500/10">
                                            <Lock className="w-2.5 h-2.5" /> Private Gate
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/10">
                                            <Globe className="w-2.5 h-2.5" /> Public Link
                                        </span>
                                    )}
                                    {!poll.isActive && (
                                        <span className="inline-flex items-center text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            Closed
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {new Date(poll.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
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
                                    valueToCopy={dynamicShareUrl}
                                    disabled={!poll.isActive}
                                />

                                {/* View Active Route Target */}
                                <Link href={`/p/${poll.id}`} passHref target="_blank">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 gap-1.5 font-medium border-slate-200 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Launch View</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}