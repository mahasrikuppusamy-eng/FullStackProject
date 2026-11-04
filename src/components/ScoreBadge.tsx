import React from 'react';
import { getScoreDetails } from '../utils/coimbatore.js';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = false,
}) => {
  const details = getScoreDetails(score);

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${details.bgColor} ${details.color} border ${details.borderColor}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: details.hex }}
        />
        {score}/100
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-2xl border ${details.borderColor} ${details.bgColor} flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm"
            style={{ backgroundColor: details.hex }}
          >
            {score}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">Accessibility Score</div>
            <div className={`font-bold text-lg ${details.color}`}>{details.tier}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-600 block">Out of 100</span>
          <span className="text-xs text-slate-400">Features (74) + Reviews (26)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1.5">
      <span
        className={`inline-flex items-center justify-center font-bold rounded-lg px-2 py-1 text-sm shadow-xs ${details.badgeColor}`}
      >
        {score}
      </span>
      {showLabel && (
        <span className={`text-xs font-medium ${details.color}`}>
          {details.tier}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
