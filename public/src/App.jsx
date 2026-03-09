import React, { useState } from 'react';
import { Search, MapPin, FileText, ShieldCheck } from 'lucide-react';

// Import Model
import { useAppModel } from './models/useAppModel';

// Import Views
import PencarianView from './views/PencarianView';
import PetaView from './views/PetaView';
import PendataanView from './views/PendataanView';
import AdminView from './views/AdminView';

export default function App() {
  const [activeTab, setActiveTab] = useState('pencarian');
  
  // Inisialisasi Model / Database
  const { alumniDB, setAlumniDB } = useAppModel();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      <nav className="bg-blue-900 text-white w-full md:w-64 flex-shrink-0 shadow-lg md:min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">Alumni<span className="text-blue-400">Track</span></h1>
        </div>
        <div className="flex flex-row md:flex-col px-4 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('pencarian')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'pencarian' ? 'bg-blue-800' : 'hover:bg-blue-800/50'}`}><Search size={18}/> Pencarian</button>
          <button onClick={() => setActiveTab('peta')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'peta' ? 'bg-blue-800' : 'hover:bg-blue-800/50'}`}><MapPin size={18}/> Peta Sebaran</button>
          <button onClick={() => setActiveTab('pendataan')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'pendataan' ? 'bg-blue-800' : 'hover:bg-blue-800/50'}`}><FileText size={18}/> Pendataan</button>
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'admin' ? 'bg-blue-800' : 'hover:bg-blue-800/50'}`}><ShieldCheck size={18}/> Verifikasi</button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Router Sederhana: Me-render View berdasarkan Tab aktif */}
        {activeTab === 'pencarian' && <PencarianView alumniDB={alumniDB} />}
        {activeTab === 'peta' && <PetaView alumniDB={alumniDB} />}
        {activeTab === 'pendataan' && <PendataanView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
        {activeTab === 'admin' && <AdminView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
      </main>
    </div>
  );
}
