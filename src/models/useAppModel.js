import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inisialisasi Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const useAppModel = () => {
  const [alumniDB, setAlumniDB] = useState([]);

  // Tarik data secara global dari Supabase saat aplikasi pertama kali dimuat
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          // PERBAIKAN: Mengubah 'id' menjadi 'created_at' karena tabel baru tidak punya kolom 'id'
          .order('created_at', { ascending: false }); 

        if (error) throw error;

        if (data) {
          setAlumniDB(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data global Supabase:", err);
      }
    };

    fetchGlobalData();
  }, []);

  return { alumniDB, setAlumniDB };
};