import { Schema, models, model, Model, Types } from "mongoose";

// type defs
export interface IPoll {
  questionText: string;
  userID: string;
  options: Option[];
}

interface Option {
  _id: Types.ObjectId;
  optionText: string;
}

export interface OptionPOJO {
  _id: string,
  optionText: string,
}

export interface LeanPoll extends IPoll {
  _id: Types.ObjectId;
  __v: number;
}

export interface PollPOJO extends Omit<IPoll, "options"> {
  _id: string;
  __v: number;
  options: OptionPOJO[]
}

// schema defs
const OptionSchema = new Schema<Option>({
  optionText: {
    type: String,
  },
});

const PollSchema = new Schema<IPoll>({
  questionText: {
    type: String,
  },
  userID: {
    type: String,
  },
  options: [OptionSchema],
});

const PollModel: Model<IPoll> =
  models["poll"] || model<IPoll>("poll", PollSchema);

export default PollModel;
