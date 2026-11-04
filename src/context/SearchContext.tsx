import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

export interface PlaceItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  area: string;
  city: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  accessibilityFeatures: {
    wheelchairRamp: boolean;
    lift: boolean;
    accessibleToilet: boolean;
    parking: boolean;
    braille: boolean;
    audioAssistance: boolean;
  };
  accessibilityScore: number;
  photos: string[];
  aiAssessment?: {
    hasRamp?: boolean;
    rampWidthAdequate?: boolean;
    hasSteps?: boolean;
    doorWidth?: 'wide' | 'narrow';
    confidence?: number;
    recommendations?: string[];
    assessedAt?: string;
  };
  averageRating: number;
  reviewCount: number;
  status: string;
  distance?: number;
  createdAt: string;
}

export interface FeaturesFilter {
  wheelchairRamp: boolean;
  lift: boolean;
  accessibleToilet: boolean;
  parking: boolean;
  braille: boolean;
  audioAssistance: boolean;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  area: string;
  setArea: (area: string) => void;
  features: FeaturesFilter;
  setFeatures: React.Dispatch<React.SetStateAction<FeaturesFilter>>;
  toggleFeature: (key: keyof FeaturesFilter) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  minScore: number;
  setMinScore: (score: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => void;
  clearUserLocation: () => void;
  places: PlaceItem[];
  loading: boolean;
  fetchPlaces: () => Promise<void>;
  resetFilters: () => void;
}

const defaultFeatures: FeaturesFilter = {
  wheelchairRamp: false,
  lift: false,
  accessibleToilet: false,
  parking: false,
  braille: false,
  audioAssistance: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [area, setArea] = useState('All');
  const [features, setFeatures] = useState<FeaturesFilter>(defaultFeatures);
  const [minRating, setMinRating] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('score_desc');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFeature = (key: keyof FeaturesFilter) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Geolocation warning/denied:', error.message);
        // Default to Coimbatore Gandhipuram if permission denied
        setUserLocation({ lat: 11.0168, lng: 76.9558 });
      }
    );
  };

  const clearUserLocation = () => {
    setUserLocation(null);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setArea('All');
    setFeatures(defaultFeatures);
    setMinRating(0);
    setMinScore(0);
    setSortBy('score_desc');
    setUserLocation(null);
  };

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (category !== 'All') params.category = category;
      if (area !== 'All') params.area = area;
      if (minRating > 0) params.minRating = minRating;
      if (minScore > 0) params.minScore = minScore;
      if (sortBy) params.sort = sortBy;

      if (features.wheelchairRamp) params.wheelchairRamp = 'true';
      if (features.lift) params.lift = 'true';
      if (features.accessibleToilet) params.accessibleToilet = 'true';
      if (features.parking) params.parking = 'true';
      if (features.braille) params.braille = 'true';
      if (features.audioAssistance) params.audioAssistance = 'true';

      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
        params.radiusKm = 15;
      }

      const res = await api.get('/api/places/search', { params });
      if (res.data.success) {
        setPlaces(res.data.places || []);
      }
    } catch (err) {
      console.error('Error fetching places:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, area, features, minRating, minScore, sortBy, userLocation]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        area,
        setArea,
        features,
        setFeatures,
        toggleFeature,
        minRating,
        setMinRating,
        minScore,
        setMinScore,
        sortBy,
        setSortBy,
        userLocation,
        requestUserLocation,
        clearUserLocation,
        places,
        loading,
        fetchPlaces,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
