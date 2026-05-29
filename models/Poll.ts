import { Schema, models, model } from 'mongoose';
import { IPoll, IOption } from '@/types/poll';

const OptionSchema = new Schema<IOption>({
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    voteCount: { type: Number, default: 0, min: 0 }
});

const PollSchema = new Schema<IPoll>(
    {
        creatorId: { type: String, required: true, index: true }, // Index for fast user dashboard reads
        question: { type: String, required: true, trim: true },
        imageUrl: { type: String, default: '' },
        options: {
            type: [OptionSchema],
            validate: [
                (v: IOption[]) => v.length >= 2,
                'Minimum 2 options required'
            ]
        },
        isPrivate: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const Poll = models.Poll || model<IPoll>('Poll', PollSchema);