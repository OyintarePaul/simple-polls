import { Schema, models, model, Model } from 'mongoose';
import { IPoll, IOption } from '@/types/poll';



const OptionSchema = new Schema<IOption>({
    text: { type: String, required: true, trim: true },
    voteCount: { type: Number, default: 0, min: 0 }
});

const PollSchema = new Schema<IPoll>(
  {
    creatorId: { type: String, required: true, index: true }, // Kept your index flag
    question: { type: String, required: true, trim: true },
    options: {
      type: [OptionSchema],
      validate: [
        (v: IOption[]) => v.length >= 2,
        'Minimum 2 options required' // Kept your exact validator configuration
      ]
    },
    isActive: { type: Boolean, default: true },
    totalVotes: { type: Number, default: 0 },
    votedFingerprints: { type: [String], default: [] } // Secure signature pipeline storage array
  },
  { timestamps: true }
);

export const Poll: Model<IPoll> = 
  models.Poll || model<IPoll>("Poll", PollSchema);