import { Schema, Model, models, model, Types } from "mongoose"

interface IVote {
    userID: string,
    poll: Types.ObjectId,
    option: Types.ObjectId
}

const VoteSchema = new Schema<IVote>({
    userID: { type: String },
    poll: { type: Schema.Types.ObjectId, ref: "poll" },
    option: { type: Schema.Types.ObjectId }
})

const VoteModel: Model<IVote> = models["vote"] || model<IVote>("vote", VoteSchema)

export default VoteModel