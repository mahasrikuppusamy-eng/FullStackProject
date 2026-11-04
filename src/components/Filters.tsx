import React from 'react';
import {
  RotateCcw,
  Navigation,
  Check,
  Star,
  SlidersHorizontal,
  Accessibility,
  ArrowUpDown,
  Bath,
  Car,
  EyeOff,
  Volume2,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext.js';
import { COIMBATORE_AREAS, CATEGORIES, ACCESSIBILITY_FEATURES_META } from '../utils/coimbatore.js';

export const Filters: React.FC = () => {
  const {
    category,
    setCategory,
    area,
    setArea,
    features,
    toggleFeature,
    minRating,
    setMinRating,
    minScore,
    setMinScore,
    userLocation,
    requestUserLocation,
    clearUserLocation,
    resetFilters,
  } = useSearch();

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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters & Constraints</h3>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Reset All
        </button>
      </div>

      {/* Near Me Geolocation Toggle */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Location Filter
        </label>
        {userLocation ? (
          <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2 text-xs font-medium text-blue-800">
              <Navigation className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Filtering within 15 km of you</span>
            </div>
            <button
              type="button"
              onClick={clearUserLocation}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={requestUserLocation}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Find Places Near Me (Coimbatore GPS)</span>
          </button>
        )}
      </div>

      {/* Coimbatore Area Dropdown */}
      <div>
        <label htmlFor="area-select" className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Coimbatore Neighborhood
        </label>
        <select
          id="area-select"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Coimbatore Areas</option>
          {COIMBATORE_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="cat-select" className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Category
        </label>
        <select
          id="cat-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Mandatory Accessibility Features Checklist */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Accessibility Features
        </label>
        <div className="space-y-2">
          {ACCESSIBILITY_FEATURES_META.map((meta) => {
            const active = features[meta.key];
            return (
              <button
                type="button"
                key={meta.key}
                onClick={() => toggleFeature(meta.key)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {getFeatureIcon(meta.key)}
                  </span>
                  <span>{meta.label}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="rating-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Minimum Rating
          </label>
          <span className="text-xs font-bold text-amber-600 flex items-center">
            <Star className="w-3.5 h-3.5 fill-current mr-1" />
            {minRating > 0 ? `${minRating}+ Stars` : 'Any'}
          </span>
        </div>
        <input
          id="rating-slider"
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>0★</span>
          <span>2.5★</span>
          <span>5★</span>
        </div>
      </div>

      {/* Minimum Score Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="score-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Minimum Score
          </label>
          <span className="text-xs font-bold text-indigo-600">
            {minScore > 0 ? `${minScore}+ / 100` : 'Any'}
          </span>
        </div>
        <input
          id="score-slider"
          type="range"
          min="0"
          max="90"
          step="10"
          value={minScore}
          onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
          className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>0</span>
          <span>Green (70+)</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
