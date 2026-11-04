import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge.js';
import { FeatureChecklist } from './FeatureChecklist.js';
import { PlaceItem } from '../context/SearchContext.js';

interface PlaceCardProps {
  place: PlaceItem;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const placeholderPhoto = `${import.meta.env.BASE_URL}place-placeholder.svg`;
  const defaultPhoto =
    place.photos && place.photos.length > 0
      ? place.photos[0]
      : placeholderPhoto;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Photo Header */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={defaultPhoto}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(event) => {
            if (!event.currentTarget.src.endsWith('/place-placeholder.svg')) {
              event.currentTarget.src = placeholderPhoto;
            } else {
              event.currentTarget.hidden = true;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {place.category}
          </span>
          {place.aiAssessment && (
            <span className="bg-indigo-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center shadow-xs">
              <Sparkles className="w-3 h-3 mr-1" /> AI Assessed
            </span>
          )}
        </div>

        {/* Top Right Score */}
        <div className="absolute top-3 right-3">
          <ScoreBadge score={place.accessibilityScore} size="md" />
        </div>

        {/* Bottom Area & Distance info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>{place.area}, Coimbatore</span>
          </div>
          {place.distance !== undefined && (
            <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-semibold">
              {place.distance} km away
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/places/${place._id}`}
              className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {place.name}
            </Link>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center text-amber-500 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
              <span>{place.averageRating > 0 ? place.averageRating.toFixed(1) : 'New'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {place.reviewCount} {place.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> {place.isSample ? 'Sample listing' : 'Verified'}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {place.description || place.address}
          </p>

          {/* Accessibility Features Checklist Chips */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <FeatureChecklist features={place.accessibilityFeatures} compact />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/places/${place._id}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center group-hover:translate-x-0.5 transition-transform"
          >
            Explore Access <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
          <Link
            to={`/places/${place._id}#assess`}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
          >
            Scan Entrance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
