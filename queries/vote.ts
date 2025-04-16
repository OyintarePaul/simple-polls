import dbConnect from "@/db/connect";
import VoteModel, { VotePOJO } from "@/db/models/vote";
import { serializeLeanDoc } from "@/lib/utils";

export async function getPollVotes(pollID: string) {
    const votes = VoteModel.find({ poll: pollID }).lean()
    return serializeLeanDoc<VotePOJO[]>(votes)
}

export async function deletePollVotes(pollID: string) {
    await dbConnect();
    await VoteModel.deleteMany({ poll: pollID })
}