import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { PlaceItem } from '../context/SearchContext.js';
import { COIMBATORE_MAP_CONFIG, getScoreDetails } from '../utils/coimbatore.js';
import { ScoreBadge } from './ScoreBadge.js';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';

interface MapViewProps {
  places: PlaceItem[];
  selectedPlaceId?: string;
  onSelectPlace?: (place: PlaceItem) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  userLocation?: { lat: number; lng: number } | null;
}

// Helper component to recenter map when center or selection changes
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Create custom colored marker pin
function createScoreMarkerIcon(score: number, isSelected: boolean = false): L.DivIcon {
  const details = getScoreDetails(score);
  const size = isSelected ? 42 : 36;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <div style="
        background-color: ${details.hex};
        color: white;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        ${isSelected ? 'outline: 3px solid #4f46e5;' : ''}
      ">
        <span style="
          transform: rotate(45deg);
          font-weight: 800;
          font-size: ${isSelected ? '14px' : '12px'};
          font-family: sans-serif;
        ">${score}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-score-pin',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// User location pulse pin
function createUserLocationIcon(): L.DivIcon {
  const html = `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #2563eb; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
    </div>
  `;
  return L.divIcon({
    className: 'user-pin',
    html,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  center = COIMBATORE_MAP_CONFIG.center,
  zoom = COIMBATORE_MAP_CONFIG.zoom,
  height = '600px',
  userLocation,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} zoom={zoom} />

        {/* User Geolocation Marker if available */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup>
              <div className="p-1 text-xs">
                <span className="font-bold text-blue-600 block">Your Location</span>
                <span>Coimbatore, Tamil Nadu</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Place Markers */}
        {places.map((place) => {
          const coords = place.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          // Coordinates in GeoJSON are [longitude, latitude]
          const lat = coords[1];
          const lng = coords[0];
          const isSelected = place._id === selectedPlaceId;

          return (
            <Marker
              key={place._id}
              position={[lat, lng]}
              icon={createScoreMarkerIcon(place.accessibilityScore, isSelected)}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place),
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-1">
                  {place.photos && place.photos.length > 0 && (
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {place.category}
                    </span>
                    <ScoreBadge score={place.accessibilityScore} size="sm" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{place.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 text-red-500 mr-1 shrink-0" />
                    <span className="truncate">{place.area}, Coimbatore</span>
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-600">
                      ★ {place.averageRating > 0 ? place.averageRating.toFixed(1) : 'New'} ({place.reviewCount})
                    </span>
                    <Link
                      to={`/places/${place._id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      View Details <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs">
        <span className="font-bold text-slate-800 block mb-1.5">Accessibility Pin Legend</span>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shadow-xs" />
            <span className="text-slate-600 font-medium">Score ≥ 70 (High Barrier-Free)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-xs" />
            <span className="text-slate-600 font-medium">Score 40–69 (Partially Accessible)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shadow-xs" />
            <span className="text-slate-600 font-medium">Score &lt; 40 (Low Accessibility)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
