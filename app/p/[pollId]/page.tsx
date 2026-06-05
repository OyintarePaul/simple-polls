import { notFound } from 'next/navigation';
import { Vote } from '@/models/Vote';
import { getVoterFingerprint } from '@/lib/fingerprint';
import { auth } from '@clerk/nextjs/server';
import VotingForm from './voting-form'; // We will build this client component next
import { getActivePollById } from '@/services/poll-service';
import { IVote } from '@/types/poll';

export default async function PublicPollPage(props: PageProps<'/p/[pollId]'>) {
  const { pollId } = await props.params;
  const poll = await getActivePollById(pollId);

  // 1. Fetch Poll

  if (!poll) return notFound();

  // 2. Resolve User Authentication & Anti-fraud footprint
  const { userId } = await auth();
  const fingerprint = await getVoterFingerprint(pollId);

  // 3. Determine if this user has already voted
  const hasVotedQuery = poll.isPrivate
    ? { pollId: poll._id, voterId: userId }
    : { pollId: poll._id, voterFingerprint: fingerprint };

  // If user is not logged in on a private poll, we skip checking the vote count (handled in UI)
  const userVoteRecord = (poll.isPrivate && !userId)
    ? null
    : (await Vote.findOne(hasVotedQuery).lean()) as IVote | null;

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
    <main className="container max-w-xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
      <VotingForm
        poll={sanitizedPoll}
        hasVoted={!!userVoteRecord}
        votedOptionId={userVoteRecord?.optionId?.toString() || null}
        totalVotes={totalVotes}
        isAuthenticated={!!userId}
      />
    </main>
  );
}