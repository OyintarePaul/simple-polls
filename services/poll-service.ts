import dbConnect from "@/database/connection";
import { Poll } from "@/models/Poll";

export interface DashboardPollDTO {
  id: string;
  question: string;
  isPrivate: boolean;
  isActive: boolean;
  createdAt: string;
  totalVotes: number;
}

export async function getActivePollById(id: string) {
  await dbConnect();
  return Poll.findById(id).lean();
}

export async function getDashboardPollsByCreator(creatorId: string): Promise<DashboardPollDTO[]> {
  await dbConnect();

  const rawPolls = await Poll.find({ creatorId })
    .sort({ createdAt: -1 })
    .lean();

  return rawPolls.map((poll: any) => ({
    id: poll._id.toString(),
    question: poll.question,
    isPrivate: poll.isPrivate,
    isActive: poll.isActive,
    createdAt: poll.createdAt instanceof Date ? poll.createdAt.toISOString() : new Date(poll.createdAt).toISOString(),
    totalVotes: poll.options.reduce((acc: number, opt: any) => acc + (opt.voteCount || 0), 0),
  }));
}