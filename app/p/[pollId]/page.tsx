import { notFound } from 'next/navigation';
import { Vote } from '@/models/Vote';
import { getVoterFingerprint } from '@/lib/fingerprint';
import { auth } from '@clerk/nextjs/server';
import VotingForm from './voting-form';
import { getActivePollById } from '@/services/poll-service';
import { IVote } from '@/types/poll';

export default async function PublicPollPage(props: PageProps<'/p/[pollId]'>) {
  const { pollId } = await props.params;
  const poll = await getActivePollById(pollId);

  // 1. Fetch Poll
  if (!poll) return notFound();

  // 2. Anti-fraud footprint
  const fingerprint = await getVoterFingerprint(pollId);

  // 3. Determine if this user has already voted
  const userVoteRecord =
    await Vote.findOne({
      pollId: poll._id,
      voterFingerprint: fingerprint
    }).lean() as IVote | null;

  // 4. Clean up MongoDB object formatting for client component consumption
  const sanitizedPoll = {
    id: poll._id.toString(),
    question: poll.question,
    isPrivate: poll.isPrivate,
    options: poll.options.map((opt: any) => ({
      id: opt._id.toString(),
      text: opt.text,
      voteCount: opt.voteCount,
    })),
  };

  const totalVotes = sanitizedPoll.options.reduce((acc, opt) => acc + opt.voteCount, 0);

  return (
    <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center gap-8">
      <div className="text-center space-y-3">
        {/* Micro status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Community Poll
        </div>

        {/* Main contextual title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          Cast Your Response
        </h1>

        {/* UX security reassurance text */}
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Make your voice heard. Submissions are anonymous, encrypted, and immediately synced.
        </p>
      </div>
      <VotingForm
        poll={sanitizedPoll}
        hasVoted={!!userVoteRecord}
        votedOptionId={userVoteRecord?.optionId?.toString() || null}
        totalVotes={totalVotes}
      />
    </main>
  );
}