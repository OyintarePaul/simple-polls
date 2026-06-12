import { Schema, models, model, InferSchemaType, Types } from 'mongoose';

const OptionSchema = new Schema({
  text: { type: String, required: true, trim: true }
});

type OptionType = InferSchemaType<typeof OptionSchema>;

const PollSchema = new Schema(
  {

    creatorId: { type: String, required: true, index: true },
    question: { type: String, required: true, trim: true },
    options: {
      type: [OptionSchema],
      validate: [
        (v: OptionType[]) => v.length >= 2,
        'Minimum 2 options required'
      ]
    },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type PollDocument = InferSchemaType<typeof PollSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Poll = models.Poll || model("Poll", PollSchema);