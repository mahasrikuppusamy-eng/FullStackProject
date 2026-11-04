import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Sparkles,
  ArrowRight,
  Accessibility,
} from 'lucide-react';
import { useSearch } from '../context/SearchContext.js';
import { PlaceCard } from '../components/PlaceCard.js';
import { VoiceMicButton } from '../components/VoiceMicButton.js';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, setCategory, places, loading } = useSearch();

  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    navigate('/search');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };

  // Featured top scored places
  const topPlaces = [...places]
    .sort((a, b) => (b.accessibilityScore || 0) - (a.accessibilityScore || 0))
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-[40px] shadow-xl">
        {/* Background glow & accents */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-700/60 text-indigo-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>Dedicated to Coimbatore, Tamil Nadu</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span className="text-emerald-400">15+ Verified Locations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Barrier-Free</span> Places in Coimbatore
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Whether visiting Peelamedu hospitals, shopping at Brookefields, or studying in PSG Tech, know in advance if ramps, accessible toilets, lifts, and braille guidance are truly available.
          </p>

          {/* Search Bar + Voice Navigation */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-white/20 text-slate-800"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hospitals, colleges, malls in Gandhipuram, Peelamedu..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-hidden text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <VoiceMicButton />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Categories Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { label: 'Hospitals', icon: HeartPulse, cat: 'Hospital' },
              { label: 'Colleges', icon: GraduationCap, cat: 'College / Education' },
              { label: 'Malls', icon: ShoppingBag, cat: 'Shopping Mall' },
              { label: 'Restaurants', icon: Coffee, cat: 'Restaurant / Cafe' },
              { label: 'Tech Parks', icon: Building2, cat: 'Office / Tech Park' },
            ].map((c) => (
              <button
                type="button"
                key={c.label}
                onClick={() => handleCategoryClick(c.cat)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-xs transition-colors border border-white/10"
              >
                <c.icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Verified CBE Places', val: '15+', sub: 'Peelamedu, RS Puram, Saibaba Col.' },
            { label: 'Accessibility Score', val: '0–100', sub: 'Calculated across 6 criteria' },
            { label: 'AI Entrance Scan', val: 'Gemini', sub: 'Multimodal ramp & door verification' },
            { label: 'Voice Assisted', val: 'Web Speech', sub: 'Hands-free voice discovery' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md flex flex-col justify-center text-center"
            >
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">{item.val}</div>
              <div className="font-bold text-slate-800 text-xs sm:text-sm mt-1">{item.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Accessible Places in Coimbatore */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Highest Rated Barrier-Free Landmarks</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Top Accessible Places in Coimbatore
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
          >
            <span>View All Places</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPlaces.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Coimbatore Inclusion Initiative
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight">
              A Unified Accessibility Index For Our City
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              AccessAble combines citizen ground-truth reviews with objective physical criteria. Every place is rated up to 100 points: Ramp (+18), Accessible Toilet (+18), Elevator (+12), Reserved Parking (+10), Braille (+8), and Audio Assistance (+8), enhanced by community reviews (+26).
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/map"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Open Coimbatore Live Map
              </Link>
              <Link
                to="/new-place"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors border border-white/20"
              >
                Register Your Venue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
