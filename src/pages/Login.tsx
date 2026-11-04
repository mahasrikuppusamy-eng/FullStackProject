import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Accessibility, Lock, Mail, AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    setError(null);
    const res = await login(demoEmail, demoPass);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Accessibility className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign in to AccessAble</h1>
          <p className="text-xs text-slate-500">
            Coimbatore Accessibility Platform for Barrier-Free Discovery
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@accessable.cbe"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Evaluation */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@accessable.cbe', 'Admin@1234')}
              className="flex items-center justify-between p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-purple-700" />
                <span>Coimbatore Admin</span>
              </div>
              <span className="text-[10px] text-purple-600">admin@accessable.cbe</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('kavitha.r@gmail.com', 'User@1234')}
              className="flex items-center justify-between p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-indigo-700" />
                <span>Citizen (Kavitha R)</span>
              </div>
              <span className="text-[10px] text-indigo-600">kavitha.r@gmail.com</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">Don't have an account yet? </span>
          <Link to="/register" className="text-xs font-bold text-indigo-600 hover:underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
