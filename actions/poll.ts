"use server";
import dbConnect from "@/db/connect";
import PollModel, { PollPOJO } from "@/db/models/poll";
import VoteModel from "@/db/models/vote";
import { deletePoll } from "@/queries/poll";
import { deletePollVotes } from "@/queries/vote";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export async function createPoll() {
    const { userId } = await auth();
    if (!userId) throw new Error("You are not authenticated");

    await dbConnect();
    let poll = new PollModel({
        userID: userId,
    });
    poll = await poll.save();
    redirect(`/dashboard/polls/${poll._id}/edit`);
}

type UpdatePollDetailsProps = Pick<
    PollPOJO,
    "questionText" | "options" | "_id" | "userID" | "mediaUrl"
>;

export async function updatePollDetails(
    payload: UpdatePollDetailsProps
) {
    const { userId } = await auth();
    if (!userId) throw new Error("You are not authenticated");

    if (userId !== payload.userID)
        throw new Error("You don't have the permission to edit this poll");

    await dbConnect();

    const poll = await PollModel.findById(payload._id);
    if (!poll) return notFound();

    poll.questionText = payload.questionText;
    poll.mediaUrl = payload.mediaUrl;

    // make sure that previous options retain their ids
    // but new options get assigned a new id
    poll.options = payload.options.map((option) => {
        return {
            _id:
                option._id.length > 0
                    ? new Types.ObjectId(option._id)
                    : new Types.ObjectId(),
            optionText: option.optionText,
        };
    });

    console.log(poll.toObject());

    await poll.save();

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function placeVote(_: any, formData: FormData) {
    const payload: {
        poll: string;
        option: string;
    } = {
        poll: formData.get("pollID") as string,
        option: formData.get("optionID") as string,
    };
    await dbConnect();
    const vote = new VoteModel(payload);
    const result = await vote.save();
    return {
        success: true,
        message: "You vote has been recorded successfully.",
    };
}

export async function deletePollAndVotes(formData: FormData) {
    const pollID = formData.get("pollID") as string;

    await dbConnect();
    await Promise.all([deletePoll(pollID), deletePollVotes(pollID)]);

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
