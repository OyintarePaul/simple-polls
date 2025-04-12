import dbConnect from "@/db/connect";
import VoteModel from "@/db/models/vote";

export async function getPollVotes(pollID: string) {
    return VoteModel.find({ poll: pollID }).lean()
}


export async function deletePollVotes(pollID: string) {
    await dbConnect();
    await VoteModel.deleteMany({ poll: pollID })
}