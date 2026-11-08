/**
 * Clubs & Events API Routes (/api/v1)
 * Enforces authentication and scoped club-admin authorization
 */
import { Router } from 'express';
import { clubsController } from './clubs.controller.js';
import { requireClubAdmin } from './clubs.policy.js';

const router = Router();

// Public Club Discovery
router.get('/clubs', clubsController.getClubs);
router.get('/clubs/:clubId', clubsController.getClubDetails);

// Club Admin Applications
router.post('/club-admin-requests', clubsController.applyForClubAdmin);
router.get('/club-admin-requests/me', clubsController.getMyRequestStatus);

// Club Admin Protected Endpoints (Scoped per clubId)
router.post('/club-admin/clubs/:clubId/events', requireClubAdmin, clubsController.createEvent);
router.post('/club-admin/clubs/:clubId/events/:eventId/publish', requireClubAdmin, clubsController.publishEvent);
router.post('/club-admin/clubs/:clubId/events/:eventId/cancel', requireClubAdmin, clubsController.cancelEvent);
router.get('/club-admin/clubs/:clubId/events/:eventId/registrations', requireClubAdmin, clubsController.getAttendees);

// Student Event Registrations
router.post('/events/:eventId/registrations', clubsController.registerForEvent);
router.delete('/events/:eventId/registrations/me', clubsController.cancelRegistration);

export default router;