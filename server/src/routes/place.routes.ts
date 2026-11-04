import { Router } from 'express';
import {
  getPlaces,
  searchPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPlacePhotos,
} from '../controllers/place.controller.js';
import { assessPlace } from '../controllers/ai.controller.js';
import { getPlaceReviews, createReview } from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMemory } from '../middleware/upload.js';

const router = Router();

// Specific routes first
router.get('/search', searchPlaces);

// Place CRUD
router.get('/', getPlaces);
router.post('/', authenticate, createPlace);
router.get('/:id', getPlaceById);
router.put('/:id', authenticate, updatePlace);
router.delete('/:id', authenticate, deletePlace);

// Place Photos
router.post('/:id/photos', authenticate, uploadPlacePhotos);

// AI multimodal entrance assessment
router.post('/:id/assess', uploadMemory.single('image'), assessPlace);

// Sub-resource: Place Reviews
router.get('/:id/reviews', getPlaceReviews);
router.post('/:id/reviews', authenticate, createReview);

export default router;
