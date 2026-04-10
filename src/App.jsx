import React, { useState, useEffect } from 'react';
import { Search, MapPin, FileText, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAppModel } from './models/useAppModel';
import PencarianView from './views/PencarianView';
import PetaView from './views/PetaView';
import PendataanView from './views/PendataanView';
import AdminView from './views/AdminView';
import AuthView from './views/AuthView'; // Pastikan Anda sudah membuat file ini

// Inisialisasi Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('pencarian');
  const { alumniDB, setAlumniDB } = useAppModel();

  // Handle Cek Sesi Login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Tampilkan Login Screen jika belum ada sesi
  if (!session) {
    return <AuthView onLoginSuccess={(user) => setSession(user)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">

      {/* Sidebar Navigasi */}
      <nav className="bg-indigo-900 text-white w-full md:w-64 flex-shrink-0 shadow-lg md:min-h-screen flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-widest uppercase italic">Alumni<span className="text-indigo-400">Track</span></h1>
          
          {/* Info Admin Login */}
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 rounded-lg"><UserIcon size={14}/></div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-indigo-300 uppercase leading-none tracking-tighter">Administrator</p>
              <p className="text-[11px] font-bold truncate opacity-70 mt-1">{session?.user?.email ? session.user.email : (session?.email ? session.email : "naufal@gmail.com")}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-row md:flex-col px-4 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('pencarian')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'pencarian' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}><Search size={18}/> Pelacakan</button>
          <button onClick={() => setActiveTab('peta')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'peta' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}><MapPin size={18}/> Sebaran</button>
          <button onClick={() => setActiveTab('pendataan')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'pendataan' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}><FileText size={18}/> Pendataan</button>
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}><ShieldCheck size={18}/> Verifikasi</button>
        </div>

        {/* Tombol Logout */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18}/> Keluar Sistem
          </button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'pencarian' && <PencarianView alumniDB={alumniDB} setAlumniDB={setAlumniDB} setActiveTab={setActiveTab} />}
        {activeTab === 'peta' && <PetaView alumniDB={alumniDB} />}
        {activeTab === 'pendataan' && <PendataanView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
        {activeTab === 'admin' && <AdminView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
      </main>

    </div>
  );
}
