import { Schema, models, model, Model, Types } from "mongoose"

interface IPoll {
    questionText: string,
    userID: string,
    options: Option[]
    votes: Types.ObjectId[]
}

interface Option {
    optionText: string,
}

const OptionSchema = new Schema<Option>({
    optionText: {
        type: String,
    }
})

const PollSchema = new Schema<IPoll>({
    questionText: {
        type: String, 
    },
    userID: {
        type: String,
    },
    options: [OptionSchema],
    votes: [{ type: Schema.Types.ObjectId, ref: "vote"}]
})

const PollModel: Model<IPoll> = models["poll"] || model<IPoll>("poll", PollSchema)

export default PollModel