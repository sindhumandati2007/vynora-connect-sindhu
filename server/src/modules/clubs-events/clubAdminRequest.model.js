/**
 * Club Admin Application Model
 * Owner: Sindhu | Approval authority: Revanth (Platform Admin)
 */
import mongoose from 'mongoose';

const clubAdminRequestSchema = new mongoose.Schema(
  {
    applicantUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicantName: {
      type: String,
      required: true
    },
    applicantEmail: {
      type: String,
      required: true
    },
    collegeName: {
      type: String,
      required: true
    },
    proposedClubName: {
      type: String,
      required: true,
      trim: true
    },
    applicantRole: {
      type: String,
      required: true,
      trim: true // e.g., "President", "Lead Organizer"
    },
    officialContact: {
      type: String,
      required: true
    },
    officialLinks: [{ type: String }],
    justification: {
      type: String,
      required: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_information'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  { timestamps: true }
);

clubAdminRequestSchema.index({ applicantUserId: 1, status: 1 });

export default mongoose.models.ClubAdminRequest || mongoose.model('ClubAdminRequest', clubAdminRequestSchema);