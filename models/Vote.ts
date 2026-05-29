import { Schema, models, model } from 'mongoose';
import { IVote } from '@/types/poll';

const VoteSchema = new Schema<IVote>(
  {
    pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
    optionId: { type: Schema.Types.ObjectId, required: true },
    voterId: { type: String, default: null },
    voterFingerprint: { type: String, required: true }
  },
  { timestamps: true }
);

// CRITICAL PORTFOLIO FIX: Compound unique index prevents double voting at the DB level
VoteSchema.index({ pollId: 1, voterFingerprint: 1 }, { unique: true });
VoteSchema.index({ pollId: 1, voterId: 1 }, { unique: true, sparse: true });

export const Vote = models.Vote || model<IVote>('Vote', VoteSchema);