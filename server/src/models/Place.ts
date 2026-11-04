import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAccessibilityFeatures {
  wheelchairRamp: boolean;
  lift: boolean;
  accessibleToilet: boolean;
  parking: boolean;
  braille: boolean;
  audioAssistance: boolean;
}

export interface IAiAssessment {
  hasRamp?: boolean | null;
  rampWidthAdequate?: boolean | null;
  hasSteps?: boolean | null;
  doorWidth?: 'wide' | 'narrow' | 'unknown';
  confidence?: number;
  recommendations?: string[];
  assessedAt?: Date;
  imageUrl?: string;
}

export interface IPlace extends Document {
  name: string;
  category: 'Hospital' | 'College / Education' | 'Shopping Mall' | 'Restaurant / Cafe' | 'Office / Tech Park' | 'Government Office' | 'Other';
  description: string;
  address: string;
  area: string;
  city: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  accessibilityFeatures: IAccessibilityFeatures;
  accessibilityScore: number;
  photos: string[];
  aiAssessment?: IAiAssessment;
  averageRating: number;
  reviewCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hospital',
        'College / Education',
        'Shopping Mall',
        'Restaurant / Cafe',
        'Office / Tech Park',
        'Government Office',
        'Other',
      ],
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Coimbatore Area is required'],
      trim: true,
    },
    city: {
      type: String,
      default: 'Coimbatore',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        default: [76.9558, 11.0168],
      },
    },
    accessibilityFeatures: {
      wheelchairRamp: { type: Boolean, default: false },
      lift: { type: Boolean, default: false },
      accessibleToilet: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      braille: { type: Boolean, default: false },
      audioAssistance: { type: Boolean, default: false },
    },
    accessibilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    photos: {
      type: [String],
      default: [],
    },
    aiAssessment: {
      hasRamp: Boolean,
      rampWidthAdequate: Boolean,
      hasSteps: Boolean,
      doorWidth: { type: String, enum: ['wide', 'narrow', 'unknown'] },
      confidence: Number,
      recommendations: [String],
      assessedAt: Date,
      imageUrl: String,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PlaceSchema.index({ location: '2dsphere' });
PlaceSchema.index({ name: 'text', address: 'text', area: 'text', category: 'text' });
PlaceSchema.index({ area: 1 });
PlaceSchema.index({ status: 1 });
PlaceSchema.index({ accessibilityScore: -1 });

export const Place = mongoose.models.Place || mongoose.model<IPlace>('Place', PlaceSchema);
export default Place;
