import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  PlusCircle,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useSearch } from '../context/SearchContext.js';
import { ScoreBadge } from '../components/ScoreBadge.js';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { places } = useSearch();

  // Filter places registered by the current user
  const userPlaces = places.filter((p: any) => {
    if (!user) return false;
    if (typeof p.createdBy === 'object' && p.createdBy?._id) {
      return p.createdBy._id === user.id;
    }
    return p.createdBy === user.id;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.name}</h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center mt-1">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Coimbatore Access Contributor
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/new-place"
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Place</span>
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>

      {/* Contributed Places Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Submitted Landmarks</h2>
            <p className="text-xs text-slate-500">Places registered under your citizen profile</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {userPlaces.length} registered
          </span>
        </div>

        {userPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">You haven't registered any places yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Know an accessible clinic, college wing, cafe, or office in Coimbatore? Add it to help the community!
            </p>
            <Link
              to="/new-place"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register First Place</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlaces.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <ScoreBadge score={p.accessibilityScore} size="sm" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" />
                    <span>{p.area}, Coimbatore</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-semibold flex items-center">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    {p.averageRating > 0 ? p.averageRating.toFixed(1) : 'No reviews'}
                  </span>
                  <Link
                    to={`/places/${p._id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <span>View Place</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
