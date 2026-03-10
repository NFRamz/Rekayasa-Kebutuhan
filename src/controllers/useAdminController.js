const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const useAdminController = (alumniDB, setAlumniDB) => {
  const pendingData = alumniDB.filter(a => a.status === 'Menunggu Verifikasi');

  const verifyAlumni = async (id, isValid) => {

// 1. logic jika klik valid  
    if (isValid) {
      setAlumniDB(alumniDB.map(a => a.id === id ? { ...a, status: 'Terverifikasi' } : a));
      
      if (USE_SUPABASE) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/alumni?id=eq.${id}`, {
            method: 'PATCH', 
            headers: { 
              'Content-Type': 'application/json', 
              'apikey': SUPABASE_KEY, 
              'Authorization': `Bearer ${SUPABASE_KEY}` 
            },
            body: JSON.stringify({ status: 'Terverifikasi' })
          });
        } catch (err) { 
          console.error("Gagal memperbarui status di Supabase:", err); 
        }
      }
    } 

    // 2. Logika Jika Admin Klik "Tolak"
    else {

      setAlumniDB(alumniDB.filter(a => a.id !== id));

      if (USE_SUPABASE) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/alumni?id=eq.${id}`, {
            method: 'DELETE',
            headers: { 
              'apikey': SUPABASE_KEY, 
              'Authorization': `Bearer ${SUPABASE_KEY}` 
            }
          });
        } catch (err) { 
          console.error("Gagal menghapus data di Supabase:", err); 
        }
      }
    }
  };

  return { pendingData, verifyAlumni };
};
