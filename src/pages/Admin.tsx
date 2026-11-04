import React, { useEffect, useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  MessageSquare,
  Sparkles,
  BarChart3,
  RotateCcw,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import api from '../api/axios.js';
import { ScoreBadge } from '../components/ScoreBadge.js';
import { useSearch } from '../context/SearchContext.js';

export const Admin: React.FC = () => {
  const { fetchPlaces } = useSearch();

  const [stats, setStats] = useState<any>(null);
  const [pendingPlaces, setPendingPlaces] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'users'>('overview');
  const [reseedLoading, setReseedLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/places/pending'),
        api.get('/api/admin/users'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingPlaces(pendingRes.data.places);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdatePlaceStatus = async (placeId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await api.patch(`/api/admin/places/${placeId}/status`, { status: newStatus });
      if (res.data.success) {
        setActionMessage(`Place status updated to "${newStatus}"`);
        setPendingPlaces((prev) => prev.filter((p) => p._id !== placeId));
        await fetchPlaces();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update status');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const res = await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setActionMessage(`User role updated to "${newRole}"`);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId || u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update user role');
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reseed database? This will reset the database with the 15 Coimbatore places and reviews.')) return;
    setReseedLoading(true);
    try {
      const res = await api.post('/api/seed');
      if (res.data.success) {
        setActionMessage('Database reseeded successfully with 15 Coimbatore places.');
        await loadAdminData();
        await fetchPlaces();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Reseed failed');
    } finally {
      setReseedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>AccessAble Coimbatore Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Platform Moderation & Analytics</h1>
          <p className="text-xs text-purple-100/80 mt-1">
            Oversee registered public locations, review verifications, and user credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReseed}
          disabled={reseedLoading}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 disabled:opacity-50"
          title="Reset database to initial 15 Coimbatore places"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{reseedLoading ? 'Reseeding...' : 'Reseed 15 Coimbatore Places'}</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        {[
          { key: 'overview', label: 'Analytics & Overview', icon: BarChart3 },
          { key: 'pending', label: `Pending Approvals (${pendingPlaces.length})`, icon: ClockIcon },
          { key: 'users', label: `Citizens & Admins (${usersList.length})`, icon: Users },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-2 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Places
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.totalPlaces}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {stats.approvedPlaces} Approved Active
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Average Access Score
              </span>
              <div className="text-3xl font-black text-indigo-600 mt-1">{stats.avgScore}/100</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Across Coimbatore</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Reviews
              </span>
              <div className="text-3xl font-black text-amber-600 mt-1">{stats.totalReviews}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Citizen Feedback</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Registered Users
              </span>
              <div className="text-3xl font-black text-purple-600 mt-1">{stats.totalUsers}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Admins & Citizens</span>
            </div>
          </div>

          {/* Distribution Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Places by Category</h3>
              <div className="space-y-2">
                {Object.entries(stats.categories || {}).map(([cat, count]: any) => (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{cat}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Places by Coimbatore Area</h3>
              <div className="space-y-2">
                {Object.entries(stats.areas || {}).map(([area, count]: any) => (
                  <div key={area} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{area}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingPlaces.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-800">All submissions are moderated!</p>
              <p className="text-xs text-slate-400 mt-0.5">No pending places awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPlaces.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <ScoreBadge score={p.accessibilityScore} size="sm" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-500">{p.address}, {p.area}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaceStatus(p._id, 'approved')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaceStatus(p._id, 'rejected')}
                      className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Users List */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => {
                const uid = u._id || u.id;
                return (
                  <tr key={uid} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-600">{u.email}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserRole(uid, 'user')}
                          className="text-[11px] font-bold text-slate-600 hover:text-red-600"
                        >
                          Demote to User
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserRole(uid, 'admin')}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Promote to Admin
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Mini Clock Icon helper
function ClockIcon(props: any) {
  return <AlertTriangle {...props} />;
}

export default Admin;
