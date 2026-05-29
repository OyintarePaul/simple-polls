// types/poll.ts
import { Document, Types } from 'mongoose';

export interface IOption {
  _id: Types.ObjectId;
  text: string;
  imageUrl?: string;
  voteCount: number;
}

export interface IPoll extends Document {
  creatorId: string; // Links to Clerk User ID (string)
  question: string;
  imageUrl?: string;
  options: IOption[];
  isPrivate: boolean; // True = Requires Clerk Auth to vote
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVote extends Document {
  pollId: Types.ObjectId;
  optionId: Types.ObjectId;
  voterId?: string; // Stored if authenticated (Private Poll)
  voterFingerprint: string; // SHA-256 Hash of IP + UserAgent (Public Poll fallback)
  createdAt: Date;
}