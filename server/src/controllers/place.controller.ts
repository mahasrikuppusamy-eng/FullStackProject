import { Request, Response } from 'express';
import { Place } from '../models/Place.js';
import { Review } from '../models/Review.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { calculateAccessibilityScore } from '../utils/score.js';
import { calculateDistanceKm, COIMBATORE_CENTER } from '../utils/geo.js';

export async function getPlaces(req: Request, res: Response) {
  try {
    const {
      category,
      area,
      status = 'approved',
      minRating,
      minScore,
      wheelchairRamp,
      lift,
      accessibleToilet,
      parking,
      braille,
      audioAssistance,
      sort = 'score_desc',
      limit = 50,
      page = 1,
    } = req.query;

    if (isDbConnected()) {
      const query: any = {};
      if (status !== 'all') query.status = status;
      if (category && category !== 'All') query.category = category;
      if (area && area !== 'All') query.area = area;
      if (minRating) query.averageRating = { $gte: Number(minRating) };
      if (minScore) query.accessibilityScore = { $gte: Number(minScore) };

      if (wheelchairRamp === 'true') query['accessibilityFeatures.wheelchairRamp'] = true;
      if (lift === 'true') query['accessibilityFeatures.lift'] = true;
      if (accessibleToilet === 'true') query['accessibilityFeatures.accessibleToilet'] = true;
      if (parking === 'true') query['accessibilityFeatures.parking'] = true;
      if (braille === 'true') query['accessibilityFeatures.braille'] = true;
      if (audioAssistance === 'true') query['accessibilityFeatures.audioAssistance'] = true;

      let sortOption: any = { accessibilityScore: -1 };
      if (sort === 'rating_desc') sortOption = { averageRating: -1 };
      if (sort === 'newest') sortOption = { createdAt: -1 };
      if (sort === 'name_asc') sortOption = { name: 1 };

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Place.countDocuments(query);
      const places = await Place.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name email role');

      return res.json({
        success: true,
        total,
        page: Number(page),
        limit: Number(limit),
        places,
      });
    } else {
      // Memory store fallback
      let results = [...memoryStore.places];

      if (status !== 'all') {
        results = results.filter((p) => p.status === status);
      }
      if (category && category !== 'All') {
        results = results.filter((p) => p.category === category);
      }
      if (area && area !== 'All') {
        results = results.filter((p) => p.area === area);
      }
      if (minRating) {
        results = results.filter((p) => p.averageRating >= Number(minRating));
      }
      if (minScore) {
        results = results.filter((p) => p.accessibilityScore >= Number(minScore));
      }

      if (wheelchairRamp === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.wheelchairRamp);
      }
      if (lift === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.lift);
      }
      if (accessibleToilet === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.accessibleToilet);
      }
      if (parking === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.parking);
      }
      if (braille === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.braille);
      }
      if (audioAssistance === 'true') {
        results = results.filter((p) => p.accessibilityFeatures?.audioAssistance);
      }

      // Sort
      if (sort === 'rating_desc') {
        results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      } else if (sort === 'newest') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sort === 'name_asc') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // default score_desc
        results.sort((a, b) => (b.accessibilityScore || 0) - (a.accessibilityScore || 0));
      }

      const total = results.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = results.slice(skip, skip + Number(limit));

      return res.json({
        success: true,
        total,
        page: Number(page),
        limit: Number(limit),
        places: paginated,
      });
    }
  } catch (error: any) {
    console.error('getPlaces error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function searchPlaces(req: Request, res: Response) {
  try {
    const {
      q,
      category,
      area,
      feature,
      wheelchairRamp,
      lift,
      accessibleToilet,
      parking,
      braille,
      audioAssistance,
      minRating,
      lat,
      lng,
      radiusKm = 10,
    } = req.query;

    const queryText = (typeof q === 'string' ? q.trim().toLowerCase() : '');
    const userLat = lat ? parseFloat(lat as string) : undefined;
    const userLng = lng ? parseFloat(lng as string) : undefined;
    const maxDistance = parseFloat(radiusKm as string) || 10;

    let placesList: any[] = [];

    if (isDbConnected()) {
      const filter: any = { status: 'approved' };

      if (queryText) {
        filter.$or = [
          { name: { $regex: queryText, $options: 'i' } },
          { address: { $regex: queryText, $options: 'i' } },
          { area: { $regex: queryText, $options: 'i' } },
          { description: { $regex: queryText, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') filter.category = category;
      if (area && area !== 'All') filter.area = area;
      if (minRating) filter.averageRating = { $gte: Number(minRating) };

      // Feature filters
      if (feature === 'wheelchairRamp' || wheelchairRamp === 'true') {
        filter['accessibilityFeatures.wheelchairRamp'] = true;
      }
      if (feature === 'lift' || lift === 'true') {
        filter['accessibilityFeatures.lift'] = true;
      }
      if (feature === 'accessibleToilet' || accessibleToilet === 'true') {
        filter['accessibilityFeatures.accessibleToilet'] = true;
      }
      if (feature === 'parking' || parking === 'true') {
        filter['accessibilityFeatures.parking'] = true;
      }
      if (feature === 'braille' || braille === 'true') {
        filter['accessibilityFeatures.braille'] = true;
      }
      if (feature === 'audioAssistance' || audioAssistance === 'true') {
        filter['accessibilityFeatures.audioAssistance'] = true;
      }

      placesList = await Place.find(filter).lean();
    } else {
      placesList = memoryStore.places.filter((p) => p.status === 'approved');

      if (queryText) {
        placesList = placesList.filter(
          (p) =>
            p.name.toLowerCase().includes(queryText) ||
            p.address.toLowerCase().includes(queryText) ||
            p.area.toLowerCase().includes(queryText) ||
            (p.description && p.description.toLowerCase().includes(queryText))
        );
      }

      if (category && category !== 'All') {
        placesList = placesList.filter((p) => p.category === category);
      }
      if (area && area !== 'All') {
        placesList = placesList.filter((p) => p.area === area);
      }
      if (minRating) {
        placesList = placesList.filter((p) => p.averageRating >= Number(minRating));
      }

      if (feature === 'wheelchairRamp' || wheelchairRamp === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.wheelchairRamp);
      }
      if (feature === 'lift' || lift === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.lift);
      }
      if (feature === 'accessibleToilet' || accessibleToilet === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.accessibleToilet);
      }
      if (feature === 'parking' || parking === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.parking);
      }
      if (feature === 'braille' || braille === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.braille);
      }
      if (feature === 'audioAssistance' || audioAssistance === 'true') {
        placesList = placesList.filter((p) => p.accessibilityFeatures?.audioAssistance);
      }
    }

    // Attach distance from reference point (user geolocation or Coimbatore center)
    const refLat = userLat !== undefined ? userLat : COIMBATORE_CENTER.lat;
    const refLng = userLng !== undefined ? userLng : COIMBATORE_CENTER.lng;

    const placesWithDistance = placesList.map((p) => {
      const [placeLng, placeLat] = p.location?.coordinates || [COIMBATORE_CENTER.lng, COIMBATORE_CENTER.lat];
      const distance = calculateDistanceKm(refLat, refLng, placeLat, placeLng);
      return {
        ...p,
        distance,
      };
    });

    // If near me was requested (user coordinates passed), filter by radius and sort by distance
    let results = placesWithDistance;
    if (userLat !== undefined && userLng !== undefined) {
      results = results.filter((p) => p.distance <= maxDistance);
      results.sort((a, b) => a.distance - b.distance);
    } else {
      // By default sort by accessibilityScore descending
      results.sort((a, b) => (b.accessibilityScore || 0) - (a.accessibilityScore || 0));
    }

    return res.json({
      success: true,
      total: results.length,
      places: results,
    });
  } catch (error: any) {
    console.error('searchPlaces error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPlaceById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const place = await Place.findById(id).populate('createdBy', 'name email role');
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const reviews = await Review.find({ place: id })
        .sort({ createdAt: -1 })
        .populate('user', 'name role');

      return res.json({
        success: true,
        place,
        reviews,
      });
    } else {
      const place = memoryStore.places.find((p) => p._id === id);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const reviews = memoryStore.reviews
        .filter((r) => r.place === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((r) => {
          const user = memoryStore.users.find((u) => u._id === r.user);
          return {
            ...r,
            user: user ? { _id: user._id, name: user.name, role: user.role } : { name: 'Verified Citizen' },
          };
        });

      return res.json({
        success: true,
        place,
        reviews,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createPlace(req: AuthenticatedRequest, res: Response) {
  try {
    const {
      name,
      category,
      description,
      address,
      area,
      city = 'Coimbatore',
      location,
      accessibilityFeatures = {},
      photos = [],
    } = req.body;

    if (!name || !category || !address || !area) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, address, and area are required fields.',
      });
    }

    const coordinates = location?.coordinates || [COIMBATORE_CENTER.lng, COIMBATORE_CENTER.lat];
    const score = calculateAccessibilityScore(accessibilityFeatures, 0, 0);
    const status = req.user?.role === 'admin' ? 'approved' : 'approved'; // auto-approved for instant discovery, moderatable by admin

    if (isDbConnected()) {
      const place = await Place.create({
        name: name.trim(),
        category,
        description: description || '',
        address: address.trim(),
        area: area.trim(),
        city,
        location: {
          type: 'Point',
          coordinates,
        },
        accessibilityFeatures: {
          wheelchairRamp: Boolean(accessibilityFeatures.wheelchairRamp),
          lift: Boolean(accessibilityFeatures.lift),
          accessibleToilet: Boolean(accessibilityFeatures.accessibleToilet),
          parking: Boolean(accessibilityFeatures.parking),
          braille: Boolean(accessibilityFeatures.braille),
          audioAssistance: Boolean(accessibilityFeatures.audioAssistance),
        },
        accessibilityScore: score,
        photos,
        averageRating: 0,
        reviewCount: 0,
        status,
        createdBy: req.user?.id,
      });

      return res.status(201).json({
        success: true,
        message: 'Place registered successfully.',
        place,
      });
    } else {
      const newPlace = {
        _id: 'place_' + Date.now(),
        name: name.trim(),
        category,
        description: description || '',
        address: address.trim(),
        area: area.trim(),
        city,
        location: {
          type: 'Point' as const,
          coordinates,
        },
        accessibilityFeatures: {
          wheelchairRamp: Boolean(accessibilityFeatures.wheelchairRamp),
          lift: Boolean(accessibilityFeatures.lift),
          accessibleToilet: Boolean(accessibilityFeatures.accessibleToilet),
          parking: Boolean(accessibilityFeatures.parking),
          braille: Boolean(accessibilityFeatures.braille),
          audioAssistance: Boolean(accessibilityFeatures.audioAssistance),
        },
        accessibilityScore: score,
        photos,
        averageRating: 0,
        reviewCount: 0,
        status,
        createdBy: req.user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryStore.places.unshift(newPlace);

      return res.status(201).json({
        success: true,
        message: 'Place registered successfully.',
        place: newPlace,
      });
    }
  } catch (error: any) {
    console.error('createPlace error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePlace(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected()) {
      const place = await Place.findById(id);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      // Check permissions: owner or admin
      if (req.user?.role !== 'admin' && place.createdBy?.toString() !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this place' });
      }

      if (updates.accessibilityFeatures || updates.averageRating !== undefined) {
        const features = updates.accessibilityFeatures || place.accessibilityFeatures;
        const rating = updates.averageRating !== undefined ? updates.averageRating : place.averageRating;
        const reviewCount = updates.reviewCount !== undefined ? updates.reviewCount : place.reviewCount;
        updates.accessibilityScore = calculateAccessibilityScore(features, rating, reviewCount);
      }

      Object.assign(place, updates);
      await place.save();

      return res.json({ success: true, place });
    } else {
      const index = memoryStore.places.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const current = memoryStore.places[index];
      if (req.user?.role !== 'admin' && current.createdBy !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this place' });
      }

      const features = updates.accessibilityFeatures || current.accessibilityFeatures;
      const rating = updates.averageRating !== undefined ? updates.averageRating : current.averageRating;
      const reviewCount = updates.reviewCount !== undefined ? updates.reviewCount : current.reviewCount;
      const score = calculateAccessibilityScore(features, rating, reviewCount);

      const updatedPlace = {
        ...current,
        ...updates,
        accessibilityScore: score,
        updatedAt: new Date(),
      };
      memoryStore.places[index] = updatedPlace;

      return res.json({ success: true, place: updatedPlace });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deletePlace(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const place = await Place.findById(id);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      if (req.user?.role !== 'admin' && place.createdBy?.toString() !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this place' });
      }

      await Place.findByIdAndDelete(id);
      await Review.deleteMany({ place: id });

      return res.json({ success: true, message: 'Place deleted successfully' });
    } else {
      const index = memoryStore.places.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }

      const place = memoryStore.places[index];
      if (req.user?.role !== 'admin' && place.createdBy !== req.user?.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this place' });
      }

      memoryStore.places.splice(index, 1);
      memoryStore.reviews = memoryStore.reviews.filter((r) => r.place !== id);

      return res.json({ success: true, message: 'Place deleted successfully' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function uploadPlacePhotos(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ success: false, message: 'Photo URL is required' });
    }

    if (isDbConnected()) {
      const place = await Place.findById(id);
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

      if (place.photos.length >= 5) {
        return res.status(400).json({ success: false, message: 'Maximum 5 photos allowed per place' });
      }

      place.photos.push(photoUrl);
      await place.save();
      return res.json({ success: true, photos: place.photos });
    } else {
      const place = memoryStore.places.find((p) => p._id === id);
      if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

      if (!place.photos) place.photos = [];
      if (place.photos.length >= 5) {
        return res.status(400).json({ success: false, message: 'Maximum 5 photos allowed per place' });
      }

      place.photos.push(photoUrl);
      return res.json({ success: true, photos: place.photos });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
