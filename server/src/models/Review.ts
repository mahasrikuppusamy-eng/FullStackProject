import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  place: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  text: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    place: {
      type: Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
