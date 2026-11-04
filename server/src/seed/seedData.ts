import { calculateAccessibilityScore } from '../utils/score.js';

export interface SeedUserData {
  _id: string;
  name: string;
  email: string;
  password: string; // plain for seed, hashed during insertion
  role: 'user' | 'admin';
}

export const SEED_USERS: SeedUserData[] = [
  {
    _id: '65f000000000000000000001',
    name: 'Coimbatore Admin',
    email: 'admin@accessable.cbe',
    password: 'Admin@1234',
    role: 'admin',
  },
  {
    _id: '65f000000000000000000002',
    name: 'Kavitha Ramasamy',
    email: 'kavitha.r@gmail.com',
    password: 'User@1234',
    role: 'user',
  },
  {
    _id: '65f000000000000000000003',
    name: 'Arun Kumar',
    email: 'arun.kumar@gmail.com',
    password: 'User@1234',
    role: 'user',
  },
];

export interface SeedPlaceData {
  _id: string;
  name: string;
  category: 'Hospital' | 'College / Education' | 'Shopping Mall' | 'Restaurant / Cafe' | 'Office / Tech Park' | 'Government Office';
  description: string;
  address: string;
  area: string;
  city: string;
  location: {
    type: 'Point';
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
    hasRamp: boolean;
    rampWidthAdequate: boolean;
    hasSteps: boolean;
    doorWidth: 'wide' | 'narrow';
    confidence: number;
    recommendations: string[];
    assessedAt: string;
    imageUrl?: string;
  };
  averageRating: number;
  reviewCount: number;
  status: 'approved' | 'pending' | 'rejected';
  createdBy: string;
}

export const SEED_PLACES: SeedPlaceData[] = [
  {
    _id: '65f100000000000000000001',
    name: 'Coimbatore Medical College Hospital',
    category: 'Hospital',
    description: 'Premier government tertiary care hospital with wide ground-level ramps, accessible emergency casualty, and dedicated disabled drop-off zone.',
    address: 'Avinashi Road, Peelamedu, Civil Aerodrome Post',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0033, 11.0285], // [lng, lat]
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: false,
    },
    accessibilityScore: 0, // dynamically calculated
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    ],
    aiAssessment: {
      hasRamp: true,
      rampWidthAdequate: true,
      hasSteps: false,
      doorWidth: 'wide',
      confidence: 0.94,
      recommendations: [
        'Add yellow high-contrast paint to ramp boundary edges.',
        'Install audio chimes for floor arrival in elevator shafts.',
      ],
      assessedAt: '2026-02-15T10:00:00.000Z',
    },
    averageRating: 4.8,
    reviewCount: 2,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000002',
    name: 'PSG Hospitals',
    category: 'Hospital',
    description: 'State-of-the-art super-specialty hospital with dual handrail ramps, automatic glass doors, tactile floor pavers, and spacious accessible restrooms.',
    address: 'Avinashi Road, Peelamedu',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0016, 11.0267],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: true,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    ],
    aiAssessment: {
      hasRamp: true,
      rampWidthAdequate: true,
      hasSteps: false,
      doorWidth: 'wide',
      confidence: 0.98,
      recommendations: [
        'Maintain clear signage at the parking level elevator bay.',
      ],
      assessedAt: '2026-03-01T12:00:00.000Z',
    },
    averageRating: 5.0,
    reviewCount: 1,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000003',
    name: 'KG Hospital',
    category: 'Hospital',
    description: 'Multi-speciality medical centre located near Arts College Road. Features ground-floor wheelchair ramp access and medical transport elevators.',
    address: 'Arts College Road, Court Complex Area',
    area: 'Race Course',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9678, 11.0003],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.2,
    reviewCount: 1,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000004',
    name: 'Sri Ramakrishna Hospital',
    category: 'Hospital',
    description: 'Extensive medical campus with dedicated disabled parking slots right in front of reception, wide automatic doors, and wheelchair loan counter.',
    address: '395, Sarojini Naidu Road, Siddhapudur',
    area: 'Gandhipuram',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9744, 11.0189],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.6,
    reviewCount: 1,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000005',
    name: 'PSG College of Technology',
    category: 'College / Education',
    description: 'Historic engineering college campus. Main academic blocks feature ramp access, designated elevators, and accessible seminar halls.',
    address: 'Post Box No. 1611, Peelamedu',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0028, 11.0242],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: true,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    ],
    aiAssessment: {
      hasRamp: true,
      rampWidthAdequate: true,
      hasSteps: false,
      doorWidth: 'wide',
      confidence: 0.92,
      recommendations: [
        'Add tactile pathway from parking zone to main admin block entrance.',
      ],
      assessedAt: '2026-02-20T11:00:00.000Z',
    },
    averageRating: 4.5,
    reviewCount: 1,
    status: 'approved',
    createdBy: '65f000000000000000000002',
  },
  {
    _id: '65f100000000000000000006',
    name: 'Coimbatore Institute of Technology (CIT)',
    category: 'College / Education',
    description: 'Renowned engineering institution with paved ground pathways connecting departments, low slope ramps, and renovated accessible restrooms in library block.',
    address: 'Civil Aerodrome Post, Avinashi Road',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0329, 11.0315],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: false,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 3.8,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000002',
  },
  {
    _id: '65f100000000000000000007',
    name: 'Government Arts College',
    category: 'College / Education',
    description: 'Heritage campus opposite Race Course. Ground floor administrative offices have gentle ramps, while upper floor accessibility is currently being upgraded.',
    address: 'Arts College Road, Near VOC Park, Race Course',
    area: 'Race Course',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9712, 10.9984],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: false,
      accessibleToilet: false,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 3.5,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000003',
  },
  {
    _id: '65f100000000000000000008',
    name: 'Brookefields Mall',
    category: 'Shopping Mall',
    description: 'Multi-level shopping center with subterranean disabled parking bays, high-capacity glass elevators, wide smooth aisles, and companion accessible washrooms on every floor.',
    address: '67-71, Dr Krishnasamy Mudaliar Rd',
    area: 'RS Puram',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9582, 11.0084],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: true,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
    ],
    aiAssessment: {
      hasRamp: true,
      rampWidthAdequate: true,
      hasSteps: false,
      doorWidth: 'wide',
      confidence: 0.96,
      recommendations: [
        'Excellent entrance accessibility with zero step barriers.',
      ],
      assessedAt: '2026-03-02T14:30:00.000Z',
    },
    averageRating: 4.9,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000009',
    name: 'Fun Republic Mall',
    category: 'Shopping Mall',
    description: 'Popular mall on Avinashi Road featuring automatic drop-off zone, escalator with accompanying passenger lift, accessible food court seating, and Cinema hall wheelchair rows.',
    address: 'Avinashi Road, Near CIT, Peelamedu',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0011, 11.0249],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1567449303078-57ad995bd302?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.4,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000010',
    name: 'Annapoorna Hotel (RS Puram)',
    category: 'Restaurant / Cafe',
    description: 'Traditional South Indian culinary icon. The East Arokiasamy Road branch has a smooth ramp entry at the side portico, wide dining table spacing, and valet parking assistance.',
    address: 'East Arokiasamy Road, R.S. Puram',
    area: 'RS Puram',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9482, 11.0081],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: false,
      accessibleToilet: true,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.7,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000002',
  },
  {
    _id: '65f100000000000000000011',
    name: 'Shree Anandhaas',
    category: 'Restaurant / Cafe',
    description: 'Renowned sweet delicacy shop and vegetarian restaurant. Low floor step with detachable aluminum ramp available upon request at the front door.',
    address: 'NSR Road, Saibaba Colony',
    area: 'Saibaba Colony',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9427, 11.0256],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: false,
      accessibleToilet: false,
      parking: true,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.1,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000003',
  },
  {
    _id: '65f100000000000000000012',
    name: 'Café Coffee Day',
    category: 'Restaurant / Cafe',
    description: 'Cosy urban cafe in heart of Gandhipuram. Flush ground entrance with automatic sliding doors, flat tiled flooring, and moveable outdoor chairs for wheelchairs.',
    address: 'Cross Cut Road, Gandhipuram',
    area: 'Gandhipuram',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9634, 11.0175],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: false,
      accessibleToilet: false,
      parking: false,
      braille: false,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 3.9,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000003',
  },
  {
    _id: '65f100000000000000000013',
    name: 'Tidel Park Coimbatore',
    category: 'Office / Tech Park',
    description: 'IT Special Economic Zone campus spanning 9.5 acres. World-class accessibility including tactile paving, step-free access across all towers, 16 automated high-speed elevators with voice annunciators, and ADA toilets.',
    address: 'Civil Aerodrome Post, Peelamedu',
    area: 'Peelamedu',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [77.0142, 11.0261],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: true,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    ],
    aiAssessment: {
      hasRamp: true,
      rampWidthAdequate: true,
      hasSteps: false,
      doorWidth: 'wide',
      confidence: 0.99,
      recommendations: [
        'World class accessible infrastructure throughout complex.',
      ],
      assessedAt: '2026-02-10T09:00:00.000Z',
    },
    averageRating: 4.9,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000014',
    name: 'KGISL Campus',
    category: 'Office / Tech Park',
    description: 'Integrated tech and knowledge park in Saravanampatti. Wide pedestrian avenues, ramps with stainless steel grab rails at all software building entrances, and reserved priority vehicle parking.',
    address: 'KGiSL Campus, Thudiyalur Road, Saravanampatti',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9961, 11.0847],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.3,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
  {
    _id: '65f100000000000000000015',
    name: 'Coimbatore District Collectorate',
    category: 'Government Office',
    description: 'Central administrative headquarters for Coimbatore District. Upgraded Sugamya Bharat Abhiyan accessible wing with hydraulic lift, ground level ramps, and helpdesk for differently-abled citizens.',
    address: 'State Bank Road, Near Coimbatore Junction Railway Station',
    area: 'Race Course',
    city: 'Coimbatore',
    location: {
      type: 'Point',
      coordinates: [76.9633, 10.9996],
    },
    accessibilityFeatures: {
      wheelchairRamp: true,
      lift: true,
      accessibleToilet: true,
      parking: true,
      braille: true,
      audioAssistance: false,
    },
    accessibilityScore: 0,
    photos: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    ],
    averageRating: 4.6,
    reviewCount: 0,
    status: 'approved',
    createdBy: '65f000000000000000000001',
  },
];

// Precompute accessibility scores for seed places
SEED_PLACES.forEach((place) => {
  place.accessibilityScore = calculateAccessibilityScore(
    place.accessibilityFeatures,
    place.averageRating,
    place.reviewCount
  );
});

export interface SeedReviewData {
  _id: string;
  place: string;
  user: string;
  rating: number;
  text: string;
  photos: string[];
  createdAt: string;
}

export const SEED_REVIEWS: SeedReviewData[] = [
  {
    _id: '65f200000000000000000001',
    place: '65f100000000000000000001', // CMCH
    user: '65f000000000000000000002', // Kavitha
    rating: 5,
    text: 'Visited the outpatient wing with my elderly grandfather who uses a wheelchair. The ramp at the main entrance is gentle, wide, and well-lit. Staff were very helpful in directing us to the accessible lifts.',
    photos: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
    ],
    createdAt: '2026-02-18T08:30:00.000Z',
  },
  {
    _id: '65f200000000000000000002',
    place: '65f100000000000000000001', // CMCH
    user: '65f000000000000000000003', // Arun
    rating: 4,
    text: 'Great ramps and clean dedicated washrooms in the new super-specialty block. Braille signage is available on major room doors. Would recommend more wheelchair parking spots during morning peak hours.',
    photos: [],
    createdAt: '2026-02-25T14:15:00.000Z',
  },
  {
    _id: '65f200000000000000000003',
    place: '65f100000000000000000002', // PSG Hospitals
    user: '65f000000000000000000003', // Arun
    rating: 5,
    text: 'Impeccable accessibility standards. Automated wide doors, smooth non-slip floors, voice guidance in lifts, and spotless accessible toilets with grab rails. Coimbatore standard!',
    photos: [],
    createdAt: '2026-03-01T16:00:00.000Z',
  },
  {
    _id: '65f200000000000000000004',
    place: '65f100000000000000000003', // KG Hospital
    user: '65f000000000000000000002', // Kavitha
    rating: 4,
    text: 'Easy ramp access from the main entrance drop-off. Elevator was prompt and accommodated our stretcher wheelchair with plenty of room.',
    photos: [],
    createdAt: '2026-01-29T10:45:00.000Z',
  },
  {
    _id: '65f200000000000000000005',
    place: '65f100000000000000000004', // Sri Ramakrishna Hospital
    user: '65f000000000000000000003', // Arun
    rating: 5,
    text: 'The wheelchair assistance team at the front desk was polite and accompanied us up to the consultation room. Parking for disabled drivers is right near gate 1.',
    photos: [],
    createdAt: '2026-02-12T11:20:00.000Z',
  },
  {
    _id: '65f200000000000000000006',
    place: '65f100000000000000000005', // PSG Tech
    user: '65f000000000000000000002', // Kavitha
    rating: 4,
    text: 'The academic quad has nicely graded ramps and the library elevator has tactile button markings. Very encouraging campus environment.',
    photos: [],
    createdAt: '2026-02-22T09:10:00.000Z',
  },
];
