import { useState } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const usePendataanController = (alumniDB, setAlumniDB) => {
  const [formData, setFormData] = useState({ nama: '', nim: '', prodi: '', kampus: '', tahun: '', pekerjaan: '', instansi: '', alamat: '' });
  const [success, setSuccess] = useState(false);

  const submitData = async (e) => {
    e.preventDefault();
    const newAlumni = { ...formData, id: Date.now(), status: 'Menunggu Verifikasi' };
    
    setAlumniDB([...alumniDB, newAlumni]);

    if (USE_SUPABASE) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/alumni`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify(newAlumni)
        });
      } catch (err) { console.error("Gagal simpan ke DB", err); }
    }
    
    setSuccess(true);
    setFormData({ nama: '', nim: '', prodi: '', kampus: '', tahun: '', pekerjaan: '', instansi: '', alamat: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return { formData, setFormData, submitData, success };
};
