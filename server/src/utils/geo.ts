/**
 * Coimbatore Geo Utilities
 * Default map center: Gandhipuram area
 * Lat: 11.0168, Lng: 76.9558
 */

export const COIMBATORE_CENTER = {
  lat: 11.0168,
  lng: 76.9558,
};

export const COIMBATORE_AREAS = [
  'Gandhipuram',
  'RS Puram',
  'Peelamedu',
  'Saibaba Colony',
  'Singanallur',
  'Vadavalli',
  'Thudiyalur',
  'Kuniyamuthur',
  'Ramanathapuram',
  'Sulur',
  'Annur',
  'Mettupalayam',
  'Saravanampatti',
  'Race Course',
] as const;

export type CoimbatoreArea = typeof COIMBATORE_AREAS[number];

// Haversine distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
