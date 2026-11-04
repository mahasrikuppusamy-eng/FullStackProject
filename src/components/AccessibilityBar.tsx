import React from 'react';
import { getScoreDetails } from '../utils/coimbatore.js';

interface AccessibilityBarProps {
  score: number;
  featuresScore?: number;
  reviewsScore?: number;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  score,
}) => {
  const details = getScoreDetails(score);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Barrier-Free Index</span>
        <span className="font-bold text-slate-900">{score}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, Math.max(5, score))}%`,
            backgroundColor: details.hex,
          }}
        />
      </div>
    </div>
  );
};

export default AccessibilityBar;
