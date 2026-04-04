import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const useAdminController = (alumniDB, setAlumniDB) => {
  // Hanya ambil data yang statusnya Menunggu Verifikasi
  const pendingData = alumniDB.filter(a => a.status === 'Menunggu Verifikasi');

  const verifyAlumni = async (nim, isValid) => {
    // 1. Logika Jika Admin Klik "Valid"
    if (isValid) {
      // Update UI seketika
      setAlumniDB(alumniDB.map(a => a.nim === nim ? { ...a, status: 'Terverifikasi' } : a));
      
      try {
        // Update database Supabase
        const { error } = await supabase
          .from('alumni')
          .update({ status: 'Terverifikasi' })
          .eq('nim', nim); // MENGGUNAKAN 'nim', bukan 'id'

        if (error) throw error;
      } catch (err) { 
        console.error("Gagal memperbarui status di Supabase:", err); 
        alert("Gagal memverifikasi di database.");
      }
    } 
    // 2. Logika Jika Admin Klik "Tolak"
    else {
      // Hapus dari UI seketika
      setAlumniDB(alumniDB.filter(a => a.nim !== nim));

      try {
        // Hapus dari database Supabase
        const { error } = await supabase
          .from('alumni')
          .delete()
          .eq('nim', nim); // MENGGUNAKAN 'nim', bukan 'id'
          
        if (error) throw error;
      } catch (err) { 
        console.error("Gagal menghapus data di Supabase:", err); 
        alert("Gagal menolak data di database.");
      }
    }
  };

  return { pendingData, verifyAlumni };
};