export const COIMBATORE_MAP_CONFIG = {
  center: [11.0168, 76.9558],
  zoom: 13,
  defaultRadiusKm: 10,
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
];

export const CATEGORIES = [
  'Hospital',
  'College / Education',
  'Shopping Mall',
  'Restaurant / Cafe',
  'Office / Tech Park',
  'Government Office',
  'Other',
];

export const ACCESSIBILITY_FEATURES_META = [
  { key: 'wheelchairRamp', label: 'Wheelchair Ramp', points: 18 },
  { key: 'accessibleToilet', label: 'Accessible Toilet', points: 18 },
  { key: 'lift', label: 'Elevator / Lift', points: 12 },
  { key: 'parking', label: 'Accessible Parking', points: 10 },
  { key: 'braille', label: 'Braille Signage', points: 8 },
  { key: 'audioAssistance', label: 'Audio Assistance', points: 8 },
];

export function getScoreDetails(score) {
  if (score >= 70) {
    return { tier: 'High Accessibility', markerColor: '#16a34a', hex: '#16a34a' };
  } else if (score >= 40) {
    return { tier: 'Moderate Accessibility', markerColor: '#d97706', hex: '#d97706' };
  } else {
    return { tier: 'Low Accessibility', markerColor: '#dc2626', hex: '#dc2626' };
  }
}
