/**
 * Clubs & Events Service Layer
 * Owner: Sindhu (College Clubs & Events Module)
 */
import Club from './club.model.js';
import ClubAdminRequest from './clubAdminRequest.model.js';
import Event from './event.model.js';
import EventRegistration from './eventRegistration.model.js';

export const clubsEventsService = {
  // 1. List verified clubs with optional search & filter
  async listVerifiedClubs(filters = {}, pagination = { page: 1, limit: 20 }) {
    const query = { verificationStatus: 'verified', status: 'active' };

    if (filters.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { collegeName: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [clubs, total] = await Promise.all([
      Club.find(query).skip(skip).limit(pagination.limit).sort({ name: 1 }),
      Club.countDocuments(query)
    ]);

    return { clubs, total, page: pagination.page, limit: pagination.limit };
  },

  // 2. Get public club details + its published events
  async getClubById(clubId) {
    const club = await Club.findById(clubId);
    if (!club || club.status !== 'active') {
      throw { status: 404, code: 'CLUB_NOT_FOUND', message: 'Club not found or inactive.' };
    }

    const events = await Event.find({ clubId, status: 'published' }).sort({ startsAt: 1 });
    return { club, events };
  },

  // 3. Submit Club-Admin application (reviewed by Revanth / platform owner)
  async submitAdminRequest(userId, applicantData) {
    const existing = await ClubAdminRequest.findOne({
      applicantUserId: userId,
      status: 'pending'
    });

    if (existing) {
      throw {
        status: 409,
        code: 'DUPLICATE_APPLICATION',
        message: 'You already have a pending club-admin application under review.'
      };
    }

    return await ClubAdminRequest.create({
      applicantUserId: userId,
      ...applicantData,
      status: 'pending'
    });
  },

  // 4. Get current applicant's own status
  async getMyApplicationStatus(userId) {
    return await ClubAdminRequest.findOne({ applicantUserId: userId }).sort({ createdAt: -1 });
  },

  // 5. Create draft event for assigned club
  async createClubEvent(clubId, organizerUserId, eventData) {
    const club = await Club.findById(clubId);
    if (!club) {
      throw { status: 404, code: 'CLUB_NOT_FOUND', message: 'Assigned club not found.' };
    }

    if (new Date(eventData.startsAt) >= new Date(eventData.endsAt)) {
      throw { status: 400, code: 'INVALID_DATES', message: 'Event start date must be before end date.' };
    }

    return await Event.create({
      clubId,
      clubName: club.name,
      collegeName: club.collegeName,
      organizerUserId,
      ...eventData,
      status: 'draft'
    });
  },

  // 6. Publish event (making it public on /events)
  async publishEvent(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw { status: 404, code: 'EVENT_NOT_FOUND', message: 'Event not found.' };

    event.status = 'published';
    await event.save();
    return event;
  },

  // 7. Cancel event
  async cancelEvent(eventId, reason = '') {
    const event = await Event.findById(eventId);
    if (!event) throw { status: 404, code: 'EVENT_NOT_FOUND', message: 'Event not found.' };

    event.status = 'cancelled';
    await event.save();
    return event;
  },

  // 8. Atomic, duplicate-safe student event registration
  async registerStudentForEvent(eventId, studentUser) {
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'published') {
      throw { status: 400, code: 'REGISTRATION_UNAVAILABLE', message: 'Event is not open for registration.' };
    }

    if (new Date(event.registrationClosesAt) < new Date()) {
      throw { status: 403, code: 'REGISTRATION_CLOSED', message: 'Registration deadline has passed.' };
    }

    // Atomic increment check: only increment if registeredCount < capacity
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, registeredCount: { $lt: event.capacity } },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      throw { status: 409, code: 'CAPACITY_REACHED', message: 'This event has reached maximum capacity.' };
    }

    try {
      const refCode = `VYN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const registration = await EventRegistration.create({
        eventId,
        studentUserId: studentUser._id,
        studentName: studentUser.name,
        studentEmail: studentUser.email,
        collegeName: studentUser.collegeName || '',
        referenceCode: refCode,
        status: 'registered'
      });

      return { registration, event: updatedEvent };
    } catch (err) {
      // Rollback increment if duplicate registration index violates
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
      if (err.code === 11000) {
        throw { status: 409, code: 'ALREADY_REGISTERED', message: 'You are already registered for this event.' };
      }
      throw err;
    }
  },

  // 9. Cancel registration by student
  async cancelStudentRegistration(eventId, studentUserId) {
    const registration = await EventRegistration.findOne({
      eventId,
      studentUserId,
      status: 'registered'
    });

    if (!registration) {
      throw { status: 404, code: 'REGISTRATION_NOT_FOUND', message: 'No active registration found to cancel.' };
    }

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    return { success: true, message: 'Registration cancelled.' };
  },

  // 10. Organizer view: Get attendee list (privacy safe)
  async getEventAttendees(eventId) {
    return await EventRegistration.find({ eventId, status: 'registered' })
      .select('studentName collegeName referenceCode registeredAt')
      .sort({ registeredAt: -1 });
  }
};