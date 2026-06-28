import { Types } from "mongoose";

import connectToDb from "@/database/connection";
import { Poll, PollDocument } from "@/models/poll";
import { Vote, VoteDocument } from "@/models/vote";

export async function getPollQuestion(pollId: string) {
  const poll = await Poll.findById(pollId, "question").lean<Pick<PollDocument, "question">>()
  return poll?.question;
}

export async function getVoteByPollAndFingerprint(pollId: string, fingerprint: string): Promise<VoteDocument | null> {
  await connectToDb();
  return Vote.findOne({ pollId, voterFingerprint: fingerprint })
    .lean<VoteDocument>();
}

export type PollWithStats = PollDocument & {
  totalVotes: number;
};

export async function getCreatorPollsWithVoteCounts(userId: string): Promise<PollWithStats[]> {

  await connectToDb();

  const pollsWithCounts = await Poll.aggregate([
    {
      $match: { creatorId: userId }
    },
    {
      // 1. Sort polls by newest first
      $sort: { createdAt: -1 }
    },
    {
      // 2. Look up the "votes" collection (MongoDB collections are usually lowercase plurals)
      $lookup: {
        from: 'votes',          // Must match the actual name of your collection in MongoDB
        localField: '_id',      // The Poll's ID
        foreignField: 'pollId', // The field inside the Vote document
        as: 'allVotes'          // Temporary array holding the matching votes
      }
    },
    {
      // 3. Project (reshape) the data to include a count and remove the heavy array
      $project: {
        _id: 1,
        creatorId: 1,
        question: 1,
        options: 1,
        isActive: 1,
        expiresAt: 1,
        createdAt: 1,
        updatedAt: 1,
        // Calculate the length of the matched array
        totalVotes: { $size: '$allVotes' }
      }
    }
  ]);

  // Aggregation results are automatically clean vanilla JS objects (equivalent to .lean())
  return pollsWithCounts as PollWithStats[];
}


export type PollWithVoteCounts = Omit<PollDocument, 'options' | '_id' | 'createdAt' | 'updatedAt'> & {
  _id: string; // Serialized string
  createdAt?: string;
  updatedAt?: string;
  totalVotes: number;
  options: Array<{
    _id: string; // Serialized string
    text: string;
    voteCount: number;
  }>;
};

export async function getPollDetailsWithVoteCounts(pollId: string): Promise<PollWithVoteCounts | null> {
  await connectToDb();

  // 1. Run both optimized queries in parallel
  const [poll, votes] = await Promise.all([
    Poll.findById(pollId).lean(),
    Vote.find({ pollId }).select('optionId').lean() // Projections optimize memory overhead
  ]);

  if (!poll) return null;

  // 2. Map option IDs to their total occurrences in the votes array
  const voteCounts = votes.reduce((acc, vote) => {
    const optId = vote.optionId.toString();
    acc[optId] = (acc[optId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    ...poll,
    _id: poll._id.toString(),
    createdAt: poll.createdAt ? poll.createdAt.toISOString() : undefined,
    updatedAt: poll.updatedAt ? poll.updatedAt.toISOString() : undefined,
    totalVotes: votes.length,
    options: poll.options.map(option => ({
      _id: option._id.toString(), // Strict string conversion for Radix UI loops
      text: option.text,
      voteCount: voteCounts[option._id.toString()] || 0
    }))
  };
}