import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Loader, MapPin, Search } from 'lucide-react';

// --- LOGIC CONTROLLER ---
// Digabungkan langsung ke dalam file View agar terhindar dari error "Could not resolve" di lingkungan kompilasi.
const getEnvVar = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || '';
    }
  } catch (error) {
    return '';
  }
  return '';
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

const usePendataanController = (alumniDB, setAlumniDB) => {
  const [formData, setFormData] = useState({ 
    nama: '', nim: '', prodi: '', kampus: '', tahun: '', pekerjaan: '', instansi: '', alamat: '', 
    lat: null, lng: null
  });
  
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locQuery, setLocQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (locQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingLoc(true);
      try {
        const query = encodeURIComponent(locQuery);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=id&limit=5`);
        const data = await response.json();
        setSuggestions(data || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Gagal mengambil saran lokasi", error);
      } finally {
        setIsSearchingLoc(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [locQuery]);

  const handleSelectLocation = (loc) => {
    setFormData({
      ...formData,
      alamat: loc.display_name,
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon)
    });
    setLocQuery(loc.display_name);
    setShowDropdown(false);
  };

  const submitData = async (e) => {
    e.preventDefault();
    
    if (!formData.lat || !formData.lng) {
      alert("Mohon ketik nama kecamatan/kota dan PILIH dari daftar saran yang muncul!");
      return;
    }

    setIsSubmitting(true);

    const newAlumni = { 
      ...formData, 
      id: Date.now(), 
      status: 'Menunggu Verifikasi'
    };
    
    if (setAlumniDB) setAlumniDB([...(alumniDB || []), newAlumni]);

    if (USE_SUPABASE) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/alumni`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify(newAlumni)
        });
      } catch (err) { console.error("Gagal simpan ke DB", err); }
    }
    
    setIsSubmitting(false);
    setSuccess(true);
    
    setFormData({ nama: '', nim: '', prodi: '', kampus: '', tahun: '', pekerjaan: '', instansi: '', alamat: '', lat: null, lng: null });
    setLocQuery('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return { 
    formData, setFormData, submitData, success, isSubmitting,
    locQuery, setLocQuery, suggestions, isSearchingLoc, showDropdown, setShowDropdown, handleSelectLocation
  };
};

// --- VIEW COMPONENT ---
export default function PendataanView({ alumniDB, setAlumniDB }) {
  const { 
    formData, setFormData, submitData, success, isSubmitting,
    locQuery, setLocQuery, suggestions, isSearchingLoc, showDropdown, setShowDropdown, handleSelectLocation
  } = usePendataanController(alumniDB, setAlumniDB);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"><FileText className="text-blue-600" /> Form Pendataan Alumni</h2>
      <p className="text-sm text-gray-500 mb-6">Fase A: Sistem dilengkapi validasi lokasi untuk akurasi peta sebaran.</p>
      
      {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2"><CheckCircle size={20} /> Data dan Koordinat berhasil disimpan ke antrean verifikasi!</div>}
      
      <form onSubmit={submitData} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} disabled={isSubmitting} /></div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">NIM / KTP</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} disabled={isSubmitting} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun Lulus</label><input required type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} disabled={isSubmitting} /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.prodi} onChange={e => setFormData({...formData, prodi: e.target.value})} disabled={isSubmitting} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Kampus Afiliasi</label><input required type="text" placeholder="Misal: UMM" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.kampus} onChange={e => setFormData({...formData, kampus: e.target.value})} disabled={isSubmitting} /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan/Jabatan</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} disabled={isSubmitting} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Instansi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} disabled={isSubmitting} /></div>
        </div>
        
        {/* BAGIAN SMART AUTOCOMPLETE ALAMAT */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center gap-2">
            <MapPin size={16} className="text-red-500" /> Pencarian Lokasi Domisili (Wajib)
          </label>
          <p className="text-xs text-gray-500 mb-3">Ketik nama Kecamatan atau Kota Anda, lalu <strong>klik hasil yang muncul</strong> di bawahnya.</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isSearchingLoc ? <Loader className="animate-spin text-blue-500" size={16} /> : <Search className="text-gray-400" size={16} />}
            </div>
            
            <input 
              required 
              type="text" 
              placeholder="Mulai ketik... (Cth: Pakong, Pamekasan)" 
              className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${showDropdown && suggestions.length > 0 ? 'rounded-t-md border-b-0' : 'rounded-md'}`}
              value={locQuery} 
              onChange={e => {
                setLocQuery(e.target.value);
                if (formData.lat || formData.lng) {
                  setFormData({...formData, alamat: '', lat: null, lng: null});
                }
              }} 
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
              disabled={isSubmitting}
            />

            {/* Area Dropdown Rekomendasi */}
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((loc, idx) => (
                  <li 
                    key={idx} 
                    className="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <span className="text-sm font-bold text-gray-800 line-clamp-1">{loc.display_name.split(',')[0]}</span>
                    <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{loc.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Indikator Status Geocoding */}
          <div className="mt-2">
            {formData.lat ? (
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> Koordinat Terkunci
              </span>
            ) : (
              <span className="text-xs text-orange-500 italic">
                * Anda belum memilih lokasi dari daftar saran.
              </span>
            )}
          </div>
        </div>
        
        {/* Tombol Submit Terkunci jika Lat/Lng Kosong */}
        <button 
          type="submit" 
          disabled={isSubmitting || !formData.lat} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? <><Loader className="animate-spin" size={18} /> Menyimpan...</> : 'Kirim Pendataan'}
        </button>
      </form>
    </div>
  );
}
