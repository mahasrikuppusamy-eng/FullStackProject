import React from 'react';
import {
  Check,
  X,
  Accessibility,
  ArrowUpDown,
  Bath,
  Car,
  EyeOff,
  Volume2,
} from 'lucide-react';
import { ACCESSIBILITY_FEATURES_META } from '../utils/coimbatore.js';

interface FeatureChecklistProps {
  features?: {
    wheelchairRamp?: boolean;
    lift?: boolean;
    accessibleToilet?: boolean;
    parking?: boolean;
    braille?: boolean;
    audioAssistance?: boolean;
  };
  compact?: boolean;
}

export const FeatureChecklist: React.FC<FeatureChecklistProps> = ({
  features = {},
  compact = false,
}) => {
  const getIcon = (key: string) => {
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

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {ACCESSIBILITY_FEATURES_META.map((meta) => {
          const isAvailable = Boolean(features[meta.key]);
          return (
            <span
              key={meta.key}
              title={`${meta.label}: ${isAvailable ? 'Available (+ ' + meta.points + ' pts)' : 'Not available'}`}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              {getIcon(meta.key)}
              <span>{meta.label}</span>
              {isAvailable ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <X className="w-3 h-3 text-slate-400" />
              )}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {ACCESSIBILITY_FEATURES_META.map((meta) => {
        const isAvailable = Boolean(features[meta.key]);
        return (
          <div
            key={meta.key}
            className={`flex items-start p-3 rounded-xl border transition-colors ${
              isAvailable
                ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                : 'bg-slate-50/50 border-slate-200 text-slate-500'
            }`}
          >
            <div
              className={`p-2 rounded-lg mr-3 ${
                isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {getIcon(meta.key)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">{meta.label}</span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  +{meta.points} pts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{meta.description}</p>
              <div className="mt-2 flex items-center text-xs font-semibold">
                {isAvailable ? (
                  <span className="text-emerald-700 flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Present
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center">
                    <X className="w-3.5 h-3.5 mr-1" /> Not Present
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureChecklist;
