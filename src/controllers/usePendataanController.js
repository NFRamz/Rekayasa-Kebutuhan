import React, { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const usePendataanController = (alumniDB, setAlumniDB) => {
  // Ditambahkan 8 field sesuai instruksi tugas dosen
  const [formData, setFormData] = useState({ 
    nama: '', nim: '', prodi: '', kampus: '', tahun: '', 
    // Field Tambahan Baru
    email: '', noHp: '',
    linkedin: '', ig: '', fb: '', tiktok: '',
    jenisPekerjaan: '', tempatBekerja: '', alamatBekerja: '', posisi: '', sosmedBekerja: '',
    // Kebutuhan Peta
    alamat: '', lat: null, lng: null
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
    const addressParts = loc.display_name.split(',');
    let cleanAddress = addressParts[0].trim();
    
    cleanAddress = cleanAddress.replace(/^(Kecamatan|Kec\.|Kabupaten|Kab\.|Kota)\s+/i, '').trim();

    setFormData({
      ...formData,
      alamat: cleanAddress, 
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon)
    });
    
    setLocQuery(cleanAddress); 
    setShowDropdown(false);
  };

  const submitData = async (e) => {
    e.preventDefault();
    
    if (!formData.lat || !formData.lng) {
      alert("Mohon ketik nama kecamatan/kota domisili dan PILIH dari daftar saran yang muncul!");
      return;
    }

    setIsSubmitting(true);

    // Salin pekerjaan untuk kompatibilitas peta jika admin belum review
    const instansiMap = formData.tempatBekerja; 
    const pekerjaanMap = formData.posisi;

    const newAlumni = { 
      ...formData, 
      instansi: instansiMap,
      pekerjaan: pekerjaanMap,
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
    
    // Reset Form
    setFormData({ 
      nama: '', nim: '', prodi: '', kampus: '', tahun: '', 
      email: '', noHp: '', linkedin: '', ig: '', fb: '', tiktok: '',
      jenisPekerjaan: '', tempatBekerja: '', alamatBekerja: '', posisi: '', sosmedBekerja: '',
      alamat: '', lat: null, lng: null 
    });
    setLocQuery('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return { 
    formData, setFormData, submitData, success, isSubmitting,
    locQuery, setLocQuery, suggestions, isSearchingLoc, showDropdown, setShowDropdown, handleSelectLocation
  };
};
