import React, { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const usePendataanController = (alumniDB, setAlumniDB) => {
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
    // FIX: Hanya mengambil bagian pertama dari balasan API (misal: "Tuban")
    const addressParts = loc.display_name.split(',');
    let cleanAddress = addressParts[0].trim();
    
    // Membersihkan awalan administratif agar yang muncul murni nama daerahnya saja
    cleanAddress = cleanAddress.replace(/^(Kecamatan|Kec\.|Kabupaten|Kab\.|Kota)\s+/i, '').trim();

    setFormData({
      ...formData,
      alamat: cleanAddress, // Menyimpan format nama tunggal (Contoh: "Tuban")
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon)
    });
    
    setLocQuery(cleanAddress); // Menampilkan format bersih di kolom input
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
