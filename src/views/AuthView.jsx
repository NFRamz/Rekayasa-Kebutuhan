import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, Activity, Loader2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthView({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau Password salah!");
      setLoading(false);
    } else {
      onLoginSuccess(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">AlumniTrack System</h2>
          <p className="text-indigo-100 text-xs mt-1 font-bold uppercase tracking-widest opacity-80">Central Control Access</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <Lock size={14} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Email Administrator</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="admin@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Otorisasi Masuk'}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Internal Access Only &copy; 2026 Universitas Muhammadiyah Malang
          </p>
        </form>
      </div>
    </div>
  );
}