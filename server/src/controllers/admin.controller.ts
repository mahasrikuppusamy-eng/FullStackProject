import { Request, Response } from 'express';
import { Place } from '../models/Place.js';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { calculateAccessibilityScore } from '../utils/score.js';

export async function getAdminStats(_req: Request, res: Response) {
  try {
    if (isDbConnected()) {
      const [totalPlaces, approvedPlaces, pendingPlaces, totalReviews, totalUsers] = await Promise.all([
        Place.countDocuments(),
        Place.countDocuments({ status: 'approved' }),
        Place.countDocuments({ status: 'pending' }),
        Review.countDocuments(),
        User.countDocuments(),
      ]);

      const places = await Place.find({}, 'accessibilityScore category area');
      const avgScore =
        places.length > 0
          ? Math.round(places.reduce((acc, p) => acc + (p.accessibilityScore || 0), 0) / places.length)
          : 0;

      // Group by category
      const categories: Record<string, number> = {};
      const areas: Record<string, number> = {};

      places.forEach((p) => {
        categories[p.category] = (categories[p.category] || 0) + 1;
        areas[p.area] = (areas[p.area] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalPlaces,
          approvedPlaces,
          pendingPlaces,
          totalReviews,
          totalUsers,
          avgScore,
          categories,
          areas,
        },
      });
    } else {
      const totalPlaces = memoryStore.places.length;
      const approvedPlaces = memoryStore.places.filter((p) => p.status === 'approved').length;
      const pendingPlaces = memoryStore.places.filter((p) => p.status === 'pending').length;
      const totalReviews = memoryStore.reviews.length;
      const totalUsers = memoryStore.users.length;

      const avgScore =
        totalPlaces > 0
          ? Math.round(
              memoryStore.places.reduce((acc, p) => acc + (p.accessibilityScore || 0), 0) / totalPlaces
            )
          : 0;

      const categories: Record<string, number> = {};
      const areas: Record<string, number> = {};

      memoryStore.places.forEach((p) => {
        categories[p.category] = (categories[p.category] || 0) + 1;
        areas[p.area] = (areas[p.area] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalPlaces,
          approvedPlaces,
          pendingPlaces,
          totalReviews,
          totalUsers,
          avgScore,
          categories,
          areas,
        },
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPendingPlaces(_req: Request, res: Response) {
  try {
    if (isDbConnected()) {
      const places = await Place.find({ status: 'pending' }).populate('createdBy', 'name email');
      return res.json({ success: true, places });
    } else {
      const places = memoryStore.places.filter((p) => p.status === 'pending');
      return res.json({ success: true, places });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePlaceStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (isDbConnected()) {
      const place = await Place.findByIdAndUpdate(id, { status }, { new: true });
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
      return res.json({ success: true, place });
    } else {
      const place = memoryStore.places.find((p) => p._id === id);
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
      place.status = status;
      return res.json({ success: true, place });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUsers(_req: Request, res: Response) {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ success: true, users });
    } else {
      const users = memoryStore.users.map((u) => ({
        id: u._id,
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      }));
      return res.json({ success: true, users });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (isDbConnected()) {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    } else {
      const user = memoryStore.users.find((u) => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.role = role;
      return res.json({
        success: true,
        user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function moderateReview(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

      const placeId = review.place;
      await Review.findByIdAndDelete(id);

      // Recompute stats
      const remaining = await Review.find({ place: placeId });
      const count = remaining.length;
      const roundedAvg = count > 0
        ? Math.round((remaining.reduce((acc, curr) => acc + curr.rating, 0) / count) * 10) / 10
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

      return res.json({ success: true, message: 'Review moderated successfully' });
    } else {
      const revIndex = memoryStore.reviews.findIndex((r) => r._id === id);
      if (revIndex === -1) return res.status(404).json({ success: false, message: 'Review not found' });

      const review = memoryStore.reviews[revIndex];
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

      return res.json({ success: true, message: 'Review moderated successfully' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
