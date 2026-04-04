import React, { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const usePendataanController = (alumniDB, setAlumniDB) => {
  const [formData, setFormData] = useState({ 
    nama: '', nim: '', prodi: '', kampus: '', tahun: '', 
    email: '', noHp: '',
    linkedin: '', ig: '', fb: '', tiktok: '',
    jenispekerjaan: '', tempatbekerja: '', alamatbekerja: '', posisi: '', sosmedbekerja: '',
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

    // 1. TERJEMAHKAN DATA AGAR 100% COCOK DENGAN SCHEMA SUPABASE
    const payloadSupabase = {
      nim: formData.nim,
      nama: formData.nama,
      prodi: formData.prodi,
      kampus: formData.kampus,
      tahun: parseInt(formData.tahun) || null, // Ubah string ke integer
      email: formData.email,
      nohp: formData.noHp, // Perbaikan: Sesuaikan huruf kecil
      linkedin: formData.linkedin,
      ig: formData.ig,
      fb: formData.fb,
      tiktok: formData.tiktok,
      jenispekerjaan: formData.jenispekerjaan,
      tempatbekerja: formData.tempatbekerja,
      alamatbekerja: formData.alamatbekerja,
      posisi: formData.posisi,
      sosmedbekerja: formData.sosmedbekerja,
      alamat: formData.alamat,
      lat: formData.lat,
      lng: formData.lng,
      instansi: formData.tempatbekerja, // Salinan untuk kompatibilitas peta
      pekerjaan: formData.posisi,       // Salinan untuk kompatibilitas peta
      status: 'Menunggu Verifikasi'
      // HAPUS id: Date.now() karena schema tidak punya kolom 'id'
    };
    
    // Update local state (UI)
    if (setAlumniDB) setAlumniDB([...(alumniDB || []), payloadSupabase]);

    // Kirim ke API Supabase
    if (USE_SUPABASE) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/alumni`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            apikey: SUPABASE_KEY, 
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payloadSupabase) // Kirim payload yang sudah bersih
        });

        // Tangkap error detail jika masih gagal
        if (!response.ok) {
           const errData = await response.json();
           console.error("Detail Error Supabase:", errData);
           throw new Error(errData.message || "Gagal menyimpan ke database");
        }
      } catch (err) { 
        console.error("Gagal simpan ke DB", err); 
        alert("Gagal mendaftar: " + err.message);
        setIsSubmitting(false);
        return; // Hentikan eksekusi jika error
      }
    }
    
    setIsSubmitting(false);
    setSuccess(true);
    
    // Reset Form (Gunakan nama properti lowercase agar sinkron saat diketik ulang)
    setFormData({ 
      nama: '', nim: '', prodi: '', kampus: '', tahun: '', 
      email: '', noHp: '', linkedin: '', ig: '', fb: '', tiktok: '',
      jenispekerjaan: '', tempatbekerja: '', alamatbekerja: '', posisi: '', sosmedbekerja: '',
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
