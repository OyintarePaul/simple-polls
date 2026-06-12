import { Document, Types, InferSchemaType } from 'mongoose';

export interface IOption {
  _id: Types.ObjectId;
  text: string;
  voteCount: number;
}

export interface IPoll extends Document {
  creatorId: string;
  question: string;
  options: IOption[];
  isActive: boolean;
  totalVotes: number;          
  votedFingerprints: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IVote extends Document {
  pollId: Types.ObjectId;
  optionId: Types.ObjectId;
  voterId?: string | null; // Stored if authenticated (Private Poll)
  voterFingerprint: string; // SHA-256 Hash of IP + UserAgent (Public Poll fallback)
  createdAt: Date;
}