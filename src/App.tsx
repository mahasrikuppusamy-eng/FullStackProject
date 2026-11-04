import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { SearchProvider } from './context/SearchContext.js';
import { Navbar } from './components/Navbar.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

import { Home } from './pages/Home.js';
import { Search } from './pages/Search.js';
import { MapPage } from './pages/MapPage.js';
import { PlaceDetail } from './pages/PlaceDetail.js';
import { NewPlace } from './pages/NewPlace.js';
import { Dashboard } from './pages/Dashboard.js';
import { Admin } from './pages/Admin.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';

import { Accessibility, MapPin, Heart } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/places/:id" element={<PlaceDetail />} />

                {/* Protected Routes */}
                <Route
                  path="/new-place"
                  element={
                    <ProtectedRoute>
                      <NewPlace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-16 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Accessibility className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      AccessAble • Coimbatore
                    </span>
                    <span className="text-slate-400">
                      Open Accessibility Discovery Platform for Tamil Nadu, India
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 font-semibold text-slate-600">
                  <Link to="/search" className="hover:text-indigo-600">
                    Discover Places
                  </Link>
                  <Link to="/map" className="hover:text-indigo-600">
                    Coimbatore Map
                  </Link>
                  <Link to="/new-place" className="hover:text-indigo-600">
                    Register Venue
                  </Link>
                  <Link to="/login" className="hover:text-indigo-600">
                    Sign In
                  </Link>
                </div>

                <div className="flex items-center space-x-1 text-slate-400">
                  <span>Built for Coimbatore with</span>
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>inclusion & dignity</span>
                </div>
              </div>
            </footer>
          </div>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}
