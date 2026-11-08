/**
 * Event Registration Model
 * Enforces atomic duplicate prevention and registration state
 */
import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    studentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      required: true
    },
    collegeName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'waitlisted'],
      default: 'registered'
    },
    referenceCode: {
      type: String,
      required: true,
      unique: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    cancelledAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// CRUCIAL: Compound unique index prevents duplicate registration for the same event and student
eventRegistrationSchema.index({ eventId: 1, studentUserId: 1 }, { unique: true });

export default mongoose.models.EventRegistration || mongoose.model('EventRegistration', eventRegistrationSchema);