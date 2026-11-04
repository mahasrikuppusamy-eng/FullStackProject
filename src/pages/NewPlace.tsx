import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Check,
  AlertCircle,
  Plus,
  Accessibility,
  ArrowUpDown,
  Bath,
  Car,
  EyeOff,
  Volume2,
} from 'lucide-react';
import api from '../api/axios.js';
import { COIMBATORE_AREAS, CATEGORIES, ACCESSIBILITY_FEATURES_META } from '../utils/coimbatore.js';
import { calculateAccessibilityScore } from '../../server/src/utils/score.js';
import { ScoreBadge } from '../components/ScoreBadge.js';
import { useSearch } from '../context/SearchContext.js';

export const NewPlace: React.FC = () => {
  const navigate = useNavigate();
  const { fetchPlaces } = useSearch();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState<string>(COIMBATORE_AREAS[0]);
  const [city] = useState('Coimbatore');

  // Coordinates [lng, lat]
  const [lng, setLng] = useState(76.9558);
  const [lat, setLat] = useState(11.0168);

  const [features, setFeatures] = useState({
    wheelchairRamp: true,
    lift: false,
    accessibleToilet: true,
    parking: true,
    braille: false,
    audioAssistance: false,
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute live preview score
  const previewScore = calculateAccessibilityScore(features, 0, 0);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !area) {
      setError('Please fill in place name, address, and area.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const photos = photoUrl.trim()
        ? [photoUrl.trim()]
        : ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'];

      const res = await api.post('/api/places', {
        name: name.trim(),
        category,
        description: description.trim(),
        address: address.trim(),
        area,
        city,
        location: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
        accessibilityFeatures: features,
        photos,
      });

      if (res.data.success) {
        await fetchPlaces();
        navigate(`/places/${res.data.place._id}`);
      } else {
        setError(res.data.message || 'Failed to register place');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error creating place');
    } finally {
      setSubmitting(false);
    }
  };

  const getFeatureIcon = (key: string) => {
    switch (key) {
      case 'wheelchairRamp':
        return <Accessibility className="w-4 h-4" />;
      case 'accessibleToilet':
        return <Bath className="w-4 h-4" />;
      case 'lift':
        return <ArrowUpDown className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'braille':
        return <EyeOff className="w-4 h-4" />;
      case 'audioAssistance':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Accessibility className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Community Contribution
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Register an Accessible Place</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Help Coimbatore citizens discover barrier-free hospitals, educational institutions, stores, and dining.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="place-name" className="text-xs font-bold text-slate-700 block mb-1">
                Place / Landmark Name *
              </label>
              <input
                id="place-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Care Super Speciality Hospital"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="category-select" className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="neighborhood-select" className="text-xs font-bold text-slate-700 block mb-1">
                Coimbatore Neighborhood *
              </label>
              <select
                id="neighborhood-select"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {COIMBATORE_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="full-address" className="text-xs font-bold text-slate-700 block mb-1">
                Full Street Address *
              </label>
              <input
                id="full-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 1/520, L&T Bypass Road, Neelambur"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="place-description" className="text-xs font-bold text-slate-700 block mb-1">
                Description & Access Instructions
              </label>
              <textarea
                id="place-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention entrance specifics, ramp location (front or side), lift location, and any assistance desks."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Coordinates (Coimbatore scope) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>GeoJSON Coordinates (Coimbatore Bounding Box)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="latitude-input" className="text-[11px] font-semibold text-slate-500 block mb-0.5">Latitude</label>
                <input
                  id="latitude-input"
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="longitude-input" className="text-[11px] font-semibold text-slate-500 block mb-0.5">Longitude</label>
                <input
                  id="longitude-input"
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Defaulted to Coimbatore city center (11.0168° N, 76.9558° E).
            </p>
          </div>

          {/* Accessibility Features Toggles with Live Score Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Accessibility Infrastructure Checklist</h3>
                <p className="text-xs text-slate-500">Toggle the verified features currently in place</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">Estimated Score:</span>
                <ScoreBadge score={previewScore} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACCESSIBILITY_FEATURES_META.map((meta) => {
                const active = features[meta.key];
                return (
                  <button
                    type="button"
                    key={meta.key}
                    onClick={() => toggleFeature(meta.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      active
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl ${
                          active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {getFeatureIcon(meta.key)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{meta.label}</div>
                        <div className="text-[11px] text-slate-500">{meta.description}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        active ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      +{meta.points}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Photo URL */}
          <div>
            <label htmlFor="photo-url" className="text-xs font-bold text-slate-700 block mb-1">
              Public Photo URL (Optional)
            </label>
            <input
              id="photo-url"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? 'Registering Place...' : 'Publish to Coimbatore AccessAble'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPlace;
