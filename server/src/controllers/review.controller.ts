import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { Place } from '../models/Place.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { calculateAccessibilityScore } from '../utils/score.js';

export async function getPlaceReviews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (isDbConnected()) {
      const skip = (Number(page) - 1) * Number(limit);
      const total = await Review.countDocuments({ place: id });
      const reviews = await Review.find({ place: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name role');

      return res.json({
        success: true,
        total,
        page: Number(page),
        limit: Number(limit),
        reviews,
      });
    } else {
      const allReviews = memoryStore.reviews
        .filter((r) => r.place === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = allReviews.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = allReviews.slice(skip, skip + Number(limit)).map((r) => {
        const user = memoryStore.users.find((u) => u._id === r.user);
        return {
          ...r,
          user: user ? { _id: user._id, name: user.name, role: user.role } : { name: 'Citizen' },
        };
      });

      return res.json({
        success: true,
        total,
        page: Number(page),
        limit: Number(limit),
        reviews: paginated,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createReview(req: AuthenticatedRequest, res: Response) {
  try {
    const { id: placeId } = req.params;
    const { rating, text, photos = [] } = req.body;

    if (!rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Rating (1-5) and review text are required.',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    const trimmedPhotos = Array.isArray(photos) ? photos.slice(0, 2) : [];

    if (isDbConnected()) {
      const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const review = await Review.create({
        place: placeId,
        user: req.user?.id,
        rating: numRating,
        text: text.trim(),
        photos: trimmedPhotos,
      });

      // Recompute averageRating & reviewCount
      const placeReviews = await Review.find({ place: placeId });
      const count = placeReviews.length;
      const avg = placeReviews.reduce((acc, curr) => acc + curr.rating, 0) / count;
      const roundedAvg = Math.round(avg * 10) / 10;

      place.averageRating = roundedAvg;
      place.reviewCount = count;
      place.accessibilityScore = calculateAccessibilityScore(
        place.accessibilityFeatures,
        roundedAvg,
        count
      );
      await place.save();

      const populatedReview = await Review.findById(review._id).populate('user', 'name role');

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        review: populatedReview,
        place: {
          averageRating: place.averageRating,
          reviewCount: place.reviewCount,
          accessibilityScore: place.accessibilityScore,
        },
      });
    } else {
      const placeIndex = memoryStore.places.findIndex((p) => p._id === placeId);
      if (placeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const newReview = {
        _id: 'rev_' + Date.now(),
        place: placeId,
        user: req.user?.id,
        rating: numRating,
        text: text.trim(),
        photos: trimmedPhotos,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryStore.reviews.unshift(newReview);

      const placeReviews = memoryStore.reviews.filter((r) => r.place === placeId);
      const count = placeReviews.length;
      const avg = placeReviews.reduce((acc, curr) => acc + curr.rating, 0) / count;
      const roundedAvg = Math.round(avg * 10) / 10;

      const place = memoryStore.places[placeIndex];
      place.averageRating = roundedAvg;
      place.reviewCount = count;
      place.accessibilityScore = calculateAccessibilityScore(
        place.accessibilityFeatures,
        roundedAvg,
        count
      );
      memoryStore.places[placeIndex] = place;

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        review: {
          ...newReview,
          user: { _id: req.user?.id, name: req.user?.name, role: req.user?.role },
        },
        place: {
          averageRating: place.averageRating,
          reviewCount: place.reviewCount,
          accessibilityScore: place.accessibilityScore,
        },
      });
    }
  } catch (error: any) {
    console.error('createReview error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteReview(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      if (req.user?.role !== 'admin' && review.user.toString() !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      const placeId = review.place;
      await Review.findByIdAndDelete(id);

      // Recompute stats
      const remainingReviews = await Review.find({ place: placeId });
      const count = remainingReviews.length;
      const roundedAvg = count > 0
        ? Math.round((remainingReviews.reduce((acc, curr) => acc + curr.rating, 0) / count) * 10) / 10
        : 0;

      const place = await Place.findById(placeId);
      if (place) {
        place.averageRating = roundedAvg;
        place.reviewCount = count;
        place.accessibilityScore = calculateAccessibilityScore(
          place.accessibilityFeatures,
          roundedAvg,
          count
        );
        await place.save();
      }

      return res.json({ success: true, message: 'Review deleted successfully' });
    } else {
      const revIndex = memoryStore.reviews.findIndex((r) => r._id === id);
      if (revIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      const review = memoryStore.reviews[revIndex];
      if (req.user?.role !== 'admin' && review.user !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      const placeId = review.place;
      memoryStore.reviews.splice(revIndex, 1);

      const remaining = memoryStore.reviews.filter((r) => r.place === placeId);
      const count = remaining.length;
      const roundedAvg = count > 0
        ? Math.round((remaining.reduce((acc, curr) => acc + curr.rating, 0) / count) * 10) / 10
        : 0;

      const place = memoryStore.places.find((p) => p._id === placeId);
      if (place) {
        place.averageRating = roundedAvg;
        place.reviewCount = count;
        place.accessibilityScore = calculateAccessibilityScore(
          place.accessibilityFeatures,
          roundedAvg,
          count
        );
      }

      return res.json({ success: true, message: 'Review deleted successfully' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
