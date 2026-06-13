import connectToDb from "@/database/connection";
import { Poll } from '@/models/poll';
import { Vote } from '@/models/vote';

export interface UserAnalytics {
  metrics: {
    totalPolls: number;
    activePolls: number;
    pausedPolls: number;
    expiredPolls: number; 
    totalVotesAcrossPlatform: number;
  };
  topPolls: Array<{
    _id: string;
    question: string;
    totalVotes: number;
    isActive: boolean;
    isExpired: boolean;
  }>;
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  await connectToDb();

  const [statusCounts, topPolls] = await Promise.all([
    Poll.aggregate([
      {
        $match: { creatorId: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          // A poll is "Active" only if isActive is true AND it hasn't expired
          active: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$isActive', true] }, { $gt: ['$expiresAt', '$$NOW'] }] },
                1, 0
              ]
            }
          },
          // A poll is "Paused" if isActive is false AND it hasn't expired
          paused: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$isActive', false] }, { $gt: ['$expiresAt', '$$NOW'] }] },
                1, 0
              ]
            }
          },
          // A poll is "Expired" simply if the current time is past expiresAt
          expired: {
            $sum: {
              $cond: [{ $lte: ['$expiresAt', '$$NOW'] }, 1, 0]
            }
          }
        }
      }
    ]),

    Vote.aggregate([
      {
        $lookup: {
          from: 'polls',
          localField: 'pollId',
          foreignField: '_id',
          as: 'pollDetails'
        }
      },
      { $unwind: '$pollDetails' },
      {
        $match: { 'pollDetails.creatorId': userId }
      },
      {
        $group: {
          _id: '$pollId',
          voteCount: { $sum: 1 },
          question: { $first: '$pollDetails.question' },
          isActive: { $first: '$pollDetails.isActive' },
          expiresAt: { $first: '$pollDetails.expiresAt' } // Keep this for projection
        }
      },
      { $sort: { voteCount: -1 } },
      { $limit: 4 },
      {
        $project: {
          _id: { $toString: '$_id' },
          question: 1,
          totalVotes: '$voteCount',
          // Derived status for the UI to know if a "Top Poll" is actually still open
          isExpired: { $lte: ['$expiresAt', '$$NOW'] },
          isActive: 1 
        }
      }
    ])
  ]);

  const stats = statusCounts[0] || { total: 0, active: 0, paused: 0, expired: 0 };

  // Note: Total votes logic remains the same as it counts all votes 
  // regardless of whether the poll has since expired.
  const totalVotesResult = await Vote.aggregate([
    {
      $lookup: {
        from: 'polls',
        localField: 'pollId',
        foreignField: '_id',
        as: 'pollDetails'
      }
    },
    { $unwind: '$pollDetails' },
    { $match: { 'pollDetails.creatorId': userId } },
    { $count: 'cumulative' }
  ]);

  const totalVotesAcrossPlatform = totalVotesResult[0]?.cumulative || 0;

  return {
    metrics: {
      totalPolls: stats.total,
      activePolls: stats.active,
      pausedPolls: stats.paused,
      expiredPolls: stats.expired, // Added here
      totalVotesAcrossPlatform
    },
    topPolls: topPolls
  };
}