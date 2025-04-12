import dbConnect from "@/db/connect";
import PollModel, { LeanPoll, PollPOJO } from "@/db/models/poll";

function serializeLeanDoc<T>(doc: any) {
  return JSON.parse(JSON.stringify(doc)) as T
}

export async function getUserPolls(userID: string): Promise<PollPOJO[]> {
  await dbConnect();
  const polls = await PollModel.find({ userID }).lean();
  const serializedPolls = polls.map((poll) =>
    serializeLeanDoc<PollPOJO>(poll)
  );
  return serializedPolls
}

export async function getPollById(pollID: string): Promise<PollPOJO | null> {
  await dbConnect();
  const poll = await PollModel.findById(pollID).lean();
  if (!poll) return null
  
  const serializablePoll: PollPOJO = {
    ...poll,
    options: poll.options.map((option) => ({ _id: option._id.toString(), optionText: option.optionText})),
    _id: poll._id.toString(),
  }
  return serializablePoll;
}

export async function deletePoll(pollID: string) {
  await dbConnect();
  await PollModel.findByIdAndDelete(pollID);
}
