/**
 * Clubs & Events Controller
 * Standard JSON Envelope & Error Formatter
 */
import { clubsEventsService } from './clubs.service.js';

export const clubsController = {
  // GET /api/v1/clubs
  async getClubs(req, res) {
    try {
      const { category, search, page = 1, limit = 20 } = req.query;
      const result = await clubsEventsService.listVerifiedClubs(
        { category, search },
        { page: Number(page), limit: Number(limit) }
      );
      return res.json({
        success: true,
        data: result.clubs,
        meta: { page: result.page, limit: result.limit, total: result.total }
      });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // GET /api/v1/clubs/:clubId
  async getClubDetails(req, res) {
    try {
      const data = await clubsEventsService.getClubById(req.params.clubId);
      return res.json({ success: true, data });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // POST /api/v1/club-admin-requests
  async applyForClubAdmin(req, res) {
    try {
      const data = await clubsEventsService.submitAdminRequest(req.user._id, req.body);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // GET /api/v1/club-admin-requests/me
  async getMyRequestStatus(req, res) {
    try {
      const data = await clubsEventsService.getMyApplicationStatus(req.user._id);
      return res.json({ success: true, data: data || { status: 'none' } });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // POST /api/v1/club-admin/clubs/:clubId/events
  async createEvent(req, res) {
    try {
      const event = await clubsEventsService.createClubEvent(req.params.clubId, req.user._id, req.body);
      return res.status(201).json({ success: true, data: event });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // POST /api/v1/club-admin/clubs/:clubId/events/:eventId/publish
  async publishEvent(req, res) {
    try {
      const event = await clubsEventsService.publishEvent(req.params.eventId);
      return res.json({ success: true, data: event });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // POST /api/v1/club-admin/clubs/:clubId/events/:eventId/cancel
  async cancelEvent(req, res) {
    try {
      const event = await clubsEventsService.cancelEvent(req.params.eventId, req.body.reason);
      return res.json({ success: true, data: event });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // GET /api/v1/club-admin/clubs/:clubId/events/:eventId/registrations
  async getAttendees(req, res) {
    try {
      const attendees = await clubsEventsService.getEventAttendees(req.params.eventId);
      return res.json({ success: true, data: attendees });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // POST /api/v1/events/:eventId/registrations
  async registerForEvent(req, res) {
    try {
      const result = await clubsEventsService.registerStudentForEvent(req.params.eventId, req.user);
      return res.status(201).json({
        success: true,
        data: result.registration,
        message: 'Registered successfully!'
      });
    } catch (err) {
      return sendError(res, err);
    }
  },

  // DELETE /api/v1/events/:eventId/registrations/me
  async cancelRegistration(req, res) {
    try {
      const result = await clubsEventsService.cancelStudentRegistration(req.params.eventId, req.user._id);
      return res.json({ success: true, message: result.message });
    } catch (err) {
      return sendError(res, err);
    }
  }
};

function sendError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
}