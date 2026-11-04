import { Router } from 'express';
import {
  getAdminStats,
  getPendingPlaces,
  updatePlaceStatus,
  getUsers,
  updateUserRole,
  moderateReview,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/places/pending', getPendingPlaces);
router.patch('/places/:id/status', updatePlaceStatus);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/reviews/:id', moderateReview);

export default router;
