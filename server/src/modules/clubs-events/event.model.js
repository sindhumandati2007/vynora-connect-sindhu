/**
 * Event Model — Vynora Connect
 * Owner: Sindhu (College Clubs & Events)
 */
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true
    },
    clubName: {
      type: String,
      required: true
    },
    collegeName: {
      type: String,
      required: true
    },
    organizerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    summary: {
      type: String,
      required: true,
      maxlength: 300
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['hackathon', 'workshop', 'seminar', 'meetup', 'competition', 'cultural']
    },
    mode: {
      type: String,
      required: true,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline'
    },
    venue: {
      name: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' }
    },
    onlineUrl: {
      type: String, // Access-controlled: shared only upon confirmed registration
      default: ''
    },
    startsAt: {
      type: Date,
      required: true
    },
    endsAt: {
      type: Date,
      required: true
    },
    registrationOpensAt: {
      type: Date,
      default: Date.now
    },
    registrationClosesAt: {
      type: Date,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    eligibility: {
      type: String,
      default: 'Open to all verified college students'
    },
    officialRegistrationUrl: {
      type: String, // If external registration is used (e.g., Unstop, Devfolio)
      default: ''
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed', 'archived'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

// Performance & Filtering indexes
eventSchema.index({ clubId: 1, status: 1, startsAt: 1 });
eventSchema.index({ status: 1, startsAt: 1 });
eventSchema.index({ category: 1, mode: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);