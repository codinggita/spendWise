import mongoose, { Document, Schema } from 'mongoose';

export interface IPatternCache extends Document {
  rawPattern: string;
  plainLanguage: string;
  category: string;
  hitCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const patternCacheSchema = new Schema<IPatternCache>(
  {
    rawPattern: { type: String, required: true, unique: true, trim: true },
    plainLanguage: { type: String, required: true },
    category: { type: String, required: true, default: 'Other' },
    hitCount: { type: Number, default: 1, min: 1 },
    createdAt: { type: Date, default: Date.now, expires: 30 * 24 * 60 * 60 },
  },
  { timestamps: true }
);

export const PatternCache = mongoose.model<IPatternCache>('PatternCache', patternCacheSchema);
export default PatternCache;
