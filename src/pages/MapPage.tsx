import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext.js';
import { MapView } from '../components/MapView.js';
import { COIMBATORE_MAP_CONFIG, COIMBATORE_AREAS, CATEGORIES } from '../utils/coimbatore.js';
import { ScoreBadge } from '../components/ScoreBadge.js';
import { MapPin, Navigation, ArrowRight, Star, SlidersHorizontal, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const {
    places,
    area,
    setArea,
    category,
    setCategory,
    features,
    toggleFeature,
    userLocation,
    requestUserLocation,
    clearUserLocation,
  } = useSearch();

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState<[number, number]>(COIMBATORE_MAP_CONFIG.center);
  const [mapZoom, setMapZoom] = useState<number>(COIMBATORE_MAP_CONFIG.zoom);

  const selectedPlace = places.find((p) => p._id === selectedPlaceId);

  const handleSelectPlace = (place: any) => {
    setSelectedPlaceId(place._id);
    if (place.location?.coordinates) {
      setMapCenter([place.location.coordinates[1], place.location.coordinates[0]]);
      setMapZoom(15);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Bar with Quick Map Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-sm mr-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Coimbatore Live Map</span>
          </div>

          {/* Area Selector */}
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="All">All Neighborhoods</option>
            {COIMBATORE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Category Selector */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Quick Feature Toggles */}
          <button
            type="button"
            onClick={() => toggleFeature('wheelchairRamp')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1 ${
              features.wheelchairRamp
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {features.wheelchairRamp && <Check className="w-3 h-3" />}
            <span>Ramp</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFeature('accessibleToilet')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1 ${
              features.accessibleToilet
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {features.accessibleToilet && <Check className="w-3 h-3" />}
            <span>Toilet</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFeature('lift')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1 ${
              features.lift
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {features.lift && <Check className="w-3 h-3" />}
            <span>Elevator</span>
          </button>
        </div>

        {/* Near Me GPS Button */}
        <div>
          {userLocation ? (
            <button
              type="button"
              onClick={clearUserLocation}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-xl text-xs font-bold"
            >
              <Navigation className="w-3.5 h-3.5 animate-spin" />
              <span>Near Me Active (Clear)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={requestUserLocation}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-indigo-600" />
              <span>Near Me (GPS)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map View + Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Interactive Leaflet Map */}
        <div className="lg:col-span-2">
          <MapView
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={handleSelectPlace}
            center={mapCenter}
            zoom={mapZoom}
            height="640px"
            userLocation={userLocation}
          />
        </div>

        {/* Sidebar Place Preview & List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 max-h-[640px]">
          {selectedPlace ? (
            <div className="bg-white rounded-2xl border-2 border-indigo-500 p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Selected Landmark
                </span>
                <ScoreBadge score={selectedPlace.accessibilityScore} size="sm" />
              </div>

              {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                <img
                  src={selectedPlace.photos[0]}
                  alt={selectedPlace.name}
                  className="w-full h-32 object-cover rounded-xl"
                />
              )}

              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedPlace.name}</h4>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" />
                  <span>{selectedPlace.address}, {selectedPlace.area}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <span className="font-semibold text-amber-600 flex items-center">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {selectedPlace.averageRating > 0 ? selectedPlace.averageRating.toFixed(1) : 'New'}
                </span>
                <span>•</span>
                <span>{selectedPlace.category}</span>
                {selectedPlace.distance !== undefined && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-indigo-600">{selectedPlace.distance} km</span>
                  </>
                )}
              </div>

              <Link
                to={`/places/${selectedPlace._id}`}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>View Full Details & AI Entrance Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900">
              <span className="font-bold block mb-1">Click any pin on the Coimbatore map</span>
              <span>Zoom in to Gandhipuram, Peelamedu, or RS Puram to view full accessibility details.</span>
            </div>
          )}

          {/* Scrollable list of places matching current map view */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Coimbatore Places ({places.length})
            </span>
            {places.map((place) => {
              const isSelected = place._id === selectedPlaceId;
              return (
                <button
                  type="button"
                  key={place._id}
                  onClick={() => handleSelectPlace(place)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">{place.name}</span>
                    <ScoreBadge score={place.accessibilityScore} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{place.area} • {place.category}</span>
                    <span className="text-amber-600 font-semibold">★ {place.averageRating || '—'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
