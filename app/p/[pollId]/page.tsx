import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getVoterFingerprint } from "@/lib/fingerprint";
import VotingForm from "./voting-form";
import { getPollById, getPollDetailsWithVoteCounts, getVoteByPollAndFingerprint } from "@/data/poll";
import { Badge } from "@/components/ui/badge"

interface PageProps {
  params: Promise<{ pollId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pollId } = await params;

  // High-performance lean query with targeted field projection
  const poll = await getPollById(pollId)

  if (!poll) return {};

  const isExpired = new Date().getTime() > new Date(poll.expiresAt).getTime();
  const isActiveLive = poll.isActive && !isExpired;

  const title = `${poll.question} | SimplePoll`;
  const description = isActiveLive
    ? "Make your voice heard. Cast an encrypted, anonymous vote on this community poll and see real-time distribution graphs."
    : "Voting has ended for this community question. View the final verified, real-time analytics breakdown."


  return {
    title,
    description,
    // Explicit public crawler visibility overrides dashboard protection
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://simplepoll.com/p/${pollId}`,
      siteName: "SimplePoll",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPollPage({ params }: PageProps) {
  const { pollId } = await params;
  const poll = await getPollDetailsWithVoteCounts(pollId);

  if (!poll) return notFound();

  // 1. Compute state flags
  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);
  const isClosed = !poll.isActive || isExpired;

  // 2. Anti-fraud footprint
  const fingerprint = await getVoterFingerprint(pollId);

  // 3. Determine if this user has already voted
  const userVoteRecord = await getVoteByPollAndFingerprint(poll._id.toString(), fingerprint);

  return (
    <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center gap-8">
      <div className="text-center space-y-3">
        {/* Dynamic Micro status badge */}
        {isClosed ? (
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1 font-semibold border-border/80 text-muted-foreground shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground/50"></span>
            </span>
            Concluded Poll
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-2 font-semibold border-primary/20 bg-primary/5 text-primary shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/70 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Community Poll
          </Badge>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {isClosed ? "Poll Results" : "Cast Your Response"}
        </h1>

        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
          {isClosed
            ? "Voting has ended for this question. Final verified numbers are displayed below."
            : "Make your voice heard. Submissions are anonymous, encrypted, and immediately synced."}
        </p>
      </div>

      <VotingForm
        poll={poll}
        hasVoted={!!userVoteRecord}
        votedOptionId={userVoteRecord?.optionId?.toString() || null}
        totalVotes={poll.totalVotes}
        isClosed={isClosed}
      />
    </main>
  );
}