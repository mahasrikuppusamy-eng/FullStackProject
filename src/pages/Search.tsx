import React, { useState } from 'react';
import {
  Search as SearchIcon,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext.js';
import { Filters } from '../components/Filters.js';
import { PlaceCard } from '../components/PlaceCard.js';
import { VoiceMicButton } from '../components/VoiceMicButton.js';

export const Search: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    places,
    loading,
    category,
    area,
    features,
    toggleFeature,
    setCategory,
    setArea,
    resetFilters,
  } = useSearch();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFeatures = Object.entries(features).filter(([_, val]) => val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Coimbatore City Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Discover Accessible Places</h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1">
              Search by name, address, or neighborhood in Coimbatore with precise accessibility filters.
            </p>
          </div>
        </div>

        {/* Search Bar + Voice */}
        <div className="bg-white p-2 rounded-2xl shadow-md flex items-center space-x-2 text-slate-800">
          <div className="pl-3 text-slate-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type place name, hospital, college, or street (e.g. Avinashi Road, Peelamedu)..."
            className="w-full text-xs sm:text-sm bg-transparent focus:outline-hidden text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <VoiceMicButton />
        </div>
      </div>

      {/* Active Filter Chips */}
      {(category !== 'All' || area !== 'All' || activeFeatures.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active:</span>

          {category !== 'All' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
              <span>{category}</span>
              <button onClick={() => setCategory('All')} className="hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {area !== 'All' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>{area}</span>
              <button onClick={() => setArea('All')} className="hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFeatures.map(([key]) => (
            <span
              key={key}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
            >
              <span>{key}</span>
              <button onClick={() => toggleFeature(key as any)} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={resetFilters}
            className="text-xs text-red-600 hover:text-red-800 font-bold ml-2 underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <Filters />
          </div>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden flex items-center justify-between pb-2">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center space-x-2 py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Criteria ({activeFeatures.length + (category !== 'All' ? 1 : 0) + (area !== 'All' ? 1 : 0)})</span>
          </button>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl max-h-[90vh] overflow-y-auto p-4 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-bold text-slate-900">Accessibility Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <Filters />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                Apply Filters & Close
              </button>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-600">
              Found <span className="font-black text-indigo-600 text-sm">{places.length}</span> verified places in Coimbatore
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-hidden"
                >
                  <option value="score_desc">Accessibility Score (High to Low)</option>
                  <option value="rating_desc">User Rating (High to Low)</option>
                  <option value="newest">Recently Added</option>
                  <option value="name_asc">Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Place Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : places.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No places found matching your filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your search radius, resetting specific accessibility criteria, or selecting "All Coimbatore Areas".
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
