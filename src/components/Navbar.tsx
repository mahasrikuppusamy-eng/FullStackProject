import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Accessibility,
  MapPin,
  Map,
  PlusCircle,
  Search,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & City Tag */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Accessibility className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center">
                  AccessAble
                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-md">
                    CBE
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1">
                  Coimbatore Accessibility
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/search"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                isActive('/search')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Discover</span>
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                isActive('/map')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Live Map</span>
            </Link>

            <Link
              to="/new-place"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                isActive('/new-place')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Place</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                  isActive('/admin')
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{user?.name}</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Join AccessAble
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2">
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Discover Places</span>
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            <Map className="w-4 h-4 text-indigo-600" />
            <span>Coimbatore Map</span>
          </Link>
          <Link
            to="/new-place"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 p-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Register a Place</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 p-2.5 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>My Profile ({user?.name})</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
