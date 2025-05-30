import { Schema, Model, models, model, Types } from "mongoose"

interface IVote {
    poll: Types.ObjectId,
    option: Types.ObjectId
}

export interface VotePOJO extends Omit<IVote, "poll" | "option"> {
    poll: string, 
    option: string,
    _id: string,
    __v: number
}

const VoteSchema = new Schema<IVote>({
    poll: { type: Schema.Types.ObjectId, ref: "poll" },
    option: { type: Schema.Types.ObjectId }
})

const VoteModel: Model<IVote> = models["vote"] || model<IVote>("vote", VoteSchema)

export default VoteModel