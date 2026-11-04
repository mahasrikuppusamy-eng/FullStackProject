export const COIMBATORE_MAP_CONFIG = {
  center: [11.0168, 76.9558] as [number, number], // Gandhipuram
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
] as const;

export const CATEGORIES = [
  'Hospital',
  'College / Education',
  'Shopping Mall',
  'Restaurant / Cafe',
  'Office / Tech Park',
  'Government Office',
  'Other',
] as const;

export interface AccessibilityFeatureMeta {
  key: 'wheelchairRamp' | 'lift' | 'accessibleToilet' | 'parking' | 'braille' | 'audioAssistance';
  label: string;
  points: number;
  description: string;
  iconName: string;
}

export const ACCESSIBILITY_FEATURES_META: AccessibilityFeatureMeta[] = [
  {
    key: 'wheelchairRamp',
    label: 'Wheelchair Ramp',
    points: 18,
    description: 'Sloped, non-slip pathway with handrails at entrance',
    iconName: 'Accessibility',
  },
  {
    key: 'accessibleToilet',
    label: 'Accessible Toilet',
    points: 18,
    description: 'Spacious restroom with grab bars and level threshold',
    iconName: 'Bath',
  },
  {
    key: 'lift',
    label: 'Elevator / Lift',
    points: 12,
    description: 'Wide elevator car reaching all public floors',
    iconName: 'ArrowUpDown',
  },
  {
    key: 'parking',
    label: 'Accessible Parking',
    points: 10,
    description: 'Reserved wide parking spots close to main entrance',
    iconName: 'Car',
  },
  {
    key: 'braille',
    label: 'Braille Signage',
    points: 8,
    description: 'Tactile braille markers on room and elevator doors',
    iconName: 'EyeOff',
  },
  {
    key: 'audioAssistance',
    label: 'Audio Assistance',
    points: 8,
    description: 'Acoustic cues or assistive staff announcements',
    iconName: 'Volume2',
  },
];

export function getScoreDetails(score: number) {
  if (score >= 70) {
    return {
      tier: 'High Accessibility',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      badgeColor: 'bg-emerald-600 text-white',
      markerColor: '#16a34a',
      hex: '#16a34a',
      label: 'Score ≥ 70 (Highly Accessible)',
    };
  } else if (score >= 40) {
    return {
      tier: 'Moderate Accessibility',
      color: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      badgeColor: 'bg-amber-500 text-white',
      markerColor: '#d97706',
      hex: '#d97706',
      label: 'Score 40–69 (Partially Accessible)',
    };
  } else {
    return {
      tier: 'Low Accessibility',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      badgeColor: 'bg-red-600 text-white',
      markerColor: '#dc2626',
      hex: '#dc2626',
      label: 'Score < 40 (Needs Improvement)',
    };
  }
}
