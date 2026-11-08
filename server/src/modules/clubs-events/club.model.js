/**
 * Club Model — Vynora Connect
 * Owner: Sindhu (College Clubs & Events Module)
 */
import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    collegeName: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    category: {
      type: String,
      required: true,
      enum: ['Technical', 'Cultural', 'Sports', 'Social & Volunteering', 'Academic', 'Entrepreneurship']
    },
    logoUrl: {
      type: String,
      default: ''
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    officialLinks: {
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

clubSchema.index({ slug: 1, collegeId: 1 }, { unique: true });
clubSchema.index({ verificationStatus: 1, category: 1 });

export default mongoose.models.Club || mongoose.model('Club', clubSchema);