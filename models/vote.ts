import { InferSchemaType, model, Model, models, Schema, Types } from 'mongoose';

const VoteSchema = new Schema(
  {
    pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
    optionId: { type: Schema.Types.ObjectId, required: true },
    voterFingerprint: { type: String, required: true }
  },
  { timestamps: true }
);

VoteSchema.index({ pollId: 1, voterFingerprint: 1 }, { unique: true });

export type VoteDocument = InferSchemaType<typeof VoteSchema> & {
  _id: Types.ObjectId;
};

export const Vote: Model<VoteDocument> = models.Vote || model<VoteDocument>('Vote', VoteSchema);