/**
 * Clubs & Events Authorization Policy
 * Scoped club-admin verification middleware
 */

export function requireClubAdmin(req, res, next) {
  const user = req.user;
  const targetClubId = req.params.clubId || req.body.clubId;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' }
    });
  }

  // Global platform owners (Revanth) have override permissions
  if (user.role === 'platform_owner') {
    return next();
  }

  // Scoped check: User must be an active club_admin specifically assigned to this club
  const isAssigned = user.managedClubIds && user.managedClubIds.includes(String(targetClubId));

  if (!isAssigned) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CLUB_PERMISSION_REQUIRED',
        message: 'You are not authorized to manage events or profile for this club.'
      }
    });
  }

  next();
}