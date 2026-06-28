import { Metadata } from "next";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BarChart3, Calendar, Users } from 'lucide-react';

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getPollDetailsWithVoteCounts, getPollQuestion } from "@/data/poll";
import { requireAuth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ pollId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pollId } = await params;
  const question = await getPollQuestion(pollId)
  const pollTitle = question
    ? `"${question}" Analytics`
    : "Poll Analytics Intelligence";

  return {
    title: pollTitle,
    description: "Review real-time data distribution streams, vote metrics, and network intake parameters.",

    // Crucial: Keeps user-generated database results out of Google public searches
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: "Real-time Poll Analytics | SimplePoll",
      description: "Review real-time data distribution streams and live vote counters.",
      url: `https://yourdomain.com/poll/${pollId}/analytics`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Real-time Poll Analytics | SimplePoll",
      description: "Review real-time data distribution streams and live vote counters.",
    },
  };
}

export default async function PollAnalyticsPage({ params }: PageProps) {
  await requireAuth()

  const { pollId } = await params;
  const poll = await getPollDetailsWithVoteCounts(pollId);
  if (!poll) return notFound();

  const isExpired = poll.expiresAt ? new Date().getTime() > new Date(poll.expiresAt).getTime() : false;
  const isPaused = !poll.isActive && !isExpired;
  const isActiveLive = poll.isActive && !isExpired;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            Return to Workspace
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {poll.question}
            </p>
          </div>
        </div>

        {/* Status Badge (Matching Dashboard Style) */}
        <div className="flex items-center gap-2">
          {isExpired && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              Archive / Ended
            </Badge>
          )}

          {isActiveLive && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Transmission
            </Badge>
          )}

          {isPaused && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Engine Paused
            </Badge>
          )}
        </div>
      </div>

      {/* Metrics Banner (Direct clone of your Dashboard pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Votes', val: poll.totalVotes, icon: Users, sub: "Unique submissions" },
          { label: 'Available Options', val: poll.options.length, icon: BarChart3, sub: "Available segments" },
          { label: 'Date Created', val: new Date(poll.createdAt || "").toLocaleDateString(undefined, { dateStyle: 'medium' }), icon: Calendar, isDate: true },
        ].map((m, i) => (
          <Card key={i} className="rounded-xl p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-[10px] font-bold uppercase tracking-widest">{m.label}</p>
              <m.icon className="w-3.5 h-3.5 text-primary" />
            </div>

            <p className={`font-extrabold tracking-tight ${m.isDate ? 'text-xl' : 'text-3xl font-mono'
              }`}>
              {m.val}
            </p>
          </Card>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Data Distribution
          </h2>

          <Badge variant="secondary" className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5">
            Real-time Sync
          </Badge>
        </div>

        <Card className="p-6 sm:p-8 space-y-8 rounded-2xl">
          <div className="space-y-6">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0;

              return (
                <div key={option._id.toString()} className="relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:border-border/80 group">
                  {/* The Semantic Background Progress Filler Layer */}
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/5 transition-all duration-1000 ease-out group-hover:bg-primary/10"
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Accent indicator line on the left side of the row */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                  />

                  {/* Content Layer sitting safely over the visual progress background */}
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Choice</span>
                      <p className="text-sm font-semibold tracking-tight text-foreground">{option.text}</p>
                    </div>

                    <div className="flex items-baseline gap-2 text-right">
                      <span className="text-lg font-black font-mono tracking-tight text-foreground">{option.voteCount}</span>
                      <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}