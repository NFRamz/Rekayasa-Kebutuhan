import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// KONFIGURASI SUPABASE
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const API_PDDIKTI    = import.meta.env.VITE_API_PDDIKTI;
const API_GITHUB     = import.meta.env.VITE_API_GITHUB;
const API_GOOGLE_IMG = import.meta.env.VITE_API_GOOGLE_IMG;
const API_ORCID      = import.meta.env.VITE_API_ORCID;

// =============================================================
// URL GOOGLE SCRIPT UNTUK EXPORT SPREADSHEET
const GAS_URL = "https://script.google.com/macros/s/AKfycby6XEBJgX0Wdq7yxuIST1tWem5YOH3_XwAfY1AcMYDuhuEbEMaYxq4p19MuWMEH0WEy/exec";
// =============================================================

export const usePencarianController = () => {
  const [queryNama, setQueryNama] = useState('');
  const [queryAfiliasi, setQueryAfiliasi] = useState('');
  const [queryKonteks, setQueryKonteks] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [internalResults, setInternalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [alumniDB, setAlumniDB] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const pageSize = 50;
  
  const [exportProgressCount, setExportProgressCount] = useState(0);
  
  const [searchHistory, setSearchHistory] = useState([]);
  
  // State Import
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');

  // State Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [successSheetUrl, setSuccessSheetUrl] = useState(null);

  // State Robot Auto-Track
  const [isAutoTracking, setIsAutoTracking] = useState(false);
  const [autoTrackStatus, setAutoTrackStatus] = useState('');

  // State Global Stats (Menghitung seluruh database)
  const [globalStats, setGlobalStats] = useState({ terlacak: 0, verifikasi: 0, belum: 0 });

  // 1. Fungsi Mengambil Data per Halaman
  const fetchAlumniPagination = async (page) => {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    try {
      const { data, count, error } = await supabase
          .from('alumni')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('id', { ascending: true });
      if (!error) {
          setAlumniDB(data);
          setTotalData(count || 0);
          if (!queryNama) setInternalResults(data);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  // 2. Fungsi Mengambil Statistik Global (Seluruh Baris Database)
  const fetchGlobalStats = async () => {
    try {
      // Hitung Terlacak (Validitas Tinggi)
      const { count: terlacak } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .eq('tracking_status', 'Terlacak')
        .gte('confidence_score', 50);

      // Hitung Perlu Verifikasi (Status Pending atau Score Rendah)
      const { count: verifikasi } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .or('tracking_status.eq.Pending,and(tracking_status.eq.Terlacak,confidence_score.lt.50)');

      // Hitung Belum Dilacak
      const { count: belum } = await supabase
        .from('alumni')
        .select('*', { count: 'exact', head: true })
        .or('tracking_status.is.null,tracking_status.eq.Belum Dilacak,tracking_status.eq.Menunggu');

      setGlobalStats({ 
        terlacak: terlacak || 0, 
        verifikasi: verifikasi || 0, 
        belum: belum || 0 
      });
    } catch (err) { console.error("Global Stats Error:", err); }
  };

  useEffect(() => { 
    fetchAlumniPagination(currentPage); 
    fetchGlobalStats();
  }, [currentPage]);

  useEffect(() => {
    const saved = localStorage.getItem('tracer_search_history');
    if (saved) setSearchHistory(JSON.parse(saved));
  }, []);

  const updateLocalState = (alumniId, updatedFields) => {
    const updateFn = (prev) => prev.map(a => 
      a.id.toString() === alumniId.toString() ? { ...a, ...updatedFields } : a
    );
    setAlumniDB(updateFn);
    setInternalResults(updateFn);
  };

  const simpanJejak = async (alumniId, itemInfo) => {
    const targetAlumni = alumniDB.find(a => a.id.toString() === alumniId.toString()) || internalResults.find(a => a.id.toString() === alumniId.toString());
    if (!targetAlumni) return;

    const currentTime = new Date().toISOString();
    const newScore = Math.min((targetAlumni.confidence_score || 0) + 25, 100);
    const dataJejakBaru = { source: itemInfo.source, title: itemInfo.title, link: itemInfo.link, desc: itemInfo.desc || '', ditambahkan_pada: currentTime };
    const jejakUpdate = [dataJejakBaru, ...(targetAlumni.jejak_digital || [])];

    updateLocalState(alumniId, { jejak_digital: jejakUpdate, tracking_status: 'Terlacak', last_tracked_at: currentTime, confidence_score: newScore });
    await supabase.from('alumni').update({ jejak_digital: jejakUpdate, tracking_status: 'Terlacak', last_tracked_at: currentTime, confidence_score: newScore }).eq('id', alumniId);
    fetchGlobalStats(); // Refresh angka dashboard
  };

  const updateInformasiAlumni = async (alumniId, field, valueBaru) => {
    const targetAlumni = alumniDB.find(a => a.id.toString() === alumniId.toString()) || internalResults.find(a => a.id.toString() === alumniId.toString());
    if (!targetAlumni || targetAlumni[field] === valueBaru) return;

    const currentTime = new Date().toISOString();
    const newScore = Math.min((targetAlumni.confidence_score || 0) + 10, 100);
    const arsipPerubahan = { source: "SISTEM (Update)", title: `Update ${field.toUpperCase()}`, desc: `Mengganti "${targetAlumni[field] || 'Kosong'}" ke "${valueBaru}"`, link: "#", ditambahkan_pada: currentTime };
    const jejakUpdate = [arsipPerubahan, ...(targetAlumni.jejak_digital || [])];

    updateLocalState(alumniId, { [field]: valueBaru, jejak_digital: jejakUpdate, last_tracked_at: currentTime, confidence_score: newScore });
    await supabase.from('alumni').update({ [field]: valueBaru, jejak_digital: jejakUpdate, last_tracked_at: currentTime, confidence_score: newScore }).eq('id', alumniId);
    fetchGlobalStats(); // Refresh angka dashboard
  };

  const executeSearch = async (e) => {
    if (e) e.preventDefault();
    if (!queryNama) { setInternalResults(alumniDB); return; }
    setIsSearching(true);

    const updatedHistory = [queryNama, ...searchHistory.filter(h => h !== queryNama)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('tracer_search_history', JSON.stringify(updatedHistory));

    try {
      const { data: internalData } = await supabase.from('alumni').select('*').ilike('nama', `%${queryNama}%`).limit(50);
      setInternalResults(internalData || []);
      
      const q = encodeURIComponent(`${queryNama} ${queryKonteks} ${queryAfiliasi}`.trim());
      const [pddiktiRes, githubRes, googleRes, orcidRes] = await Promise.allSettled([
        fetch(`${API_PDDIKTI}?query=${encodeURIComponent(queryNama)}`).then(res => res.json()),
        fetch(`${API_GITHUB}?q=${encodeURIComponent(queryNama)}`).then(res => res.json()),
        fetch(`${API_GOOGLE_IMG}?query=${q}`).then(res => res.json()),
        fetch(`${API_ORCID}?q=${encodeURIComponent(queryNama)}`, { headers: { 'Accept': 'application/json' } }).then(res => res.text())
      ]);

      let fetchedExternal = [];
      if (pddiktiRes.status === 'fulfilled' && Array.isArray(pddiktiRes.value)) pddiktiRes.value.forEach(item => fetchedExternal.push({ source: 'PDDIKTI', title: item.nama, desc: `PT: ${item.nama_pt} | Prodi: ${item.nama_prodi}`, link: `https://www.google.com/search?q=${encodeURIComponent(item.nama + " " + item.nama_pt)}` }));
      if (githubRes.status === 'fulfilled' && githubRes.value.items) githubRes.value.items.forEach(item => fetchedExternal.push({ source: 'GitHub', title: `@${item.login}`, desc: `Profil Developer`, link: item.html_url, image: item.avatar_url }));
      if (googleRes.status === 'fulfilled' && Array.isArray(googleRes.value)) googleRes.value.forEach(item => fetchedExternal.push({ source: 'Google Web', title: item.title, desc: item.url, link: item.url, image: item.image }));
      if (orcidRes.status === 'fulfilled' && orcidRes.value) { try { const data = JSON.parse(orcidRes.value); if (data?.result) data.result.forEach(item => fetchedExternal.push({ source: 'ORCID', title: 'Profil Peneliti', desc: item['orcid-identifier'].path, link: item['orcid-identifier'].uri })); } catch(e) {} }

      setExternalResults(fetchedExternal);
    } catch (error) { console.error("Global Search Error:", error); } finally { setIsSearching(false); }
  };

  // 3. FUNGSI ROBOT AUTO-TRACK (Mencari Otomatis)
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const runAutoTrackCurrentPage = async () => {
    const pendingData = internalResults.filter(a => a.tracking_status !== 'Terlacak');
    
    if (pendingData.length === 0) {
        alert("Semua data di halaman tabel ini sudah terlacak. Silakan pindah ke halaman berikutnya!");
        return;
    }

    const confirmStart = window.confirm(`Robot akan melacak ${pendingData.length} data secara otomatis. Mohon jangan tutup halaman saat proses berjalan. Note: Data terlacak dikecualikan. Lanjutkan?`);
    if (!confirmStart) return;

    setIsAutoTracking(true);
    let successCount = 0;

    for (let i = 0; i < pendingData.length; i++) {
        const alumni = pendingData[i];
        setAutoTrackStatus(`Melacak ${i + 1}/${pendingData.length}: ${alumni.nama}`);

        try {
            const q = encodeURIComponent(`${alumni.nama} ${alumni.prodi} LinkedIn`.trim());
            const [pddiktiRes, googleRes] = await Promise.allSettled([
                fetch(`${API_PDDIKTI}?query=${encodeURIComponent(alumni.nama)}`).then(r => r.json()),
                fetch(`${API_GOOGLE_IMG}?query=${q}`).then(r => r.json())
            ]);

            let jejakBaruOtomatis = [];
            let scoreTambahan = 0;
            let linkedinUrlToSave = alumni.linkedin_url;

            if (pddiktiRes.status === 'fulfilled' && Array.isArray(pddiktiRes.value)) {
                const match = pddiktiRes.value.find(item => item.nama.toLowerCase() === alumni.nama.toLowerCase());
                if (match) {
                    jejakBaruOtomatis.push({ source: 'PDDIKTI (AutoBot)', title: match.nama, desc: match.nama_pt, link: '#', ditambahkan_pada: new Date().toISOString() });
                    scoreTambahan += 30;
                }
            }

            if (googleRes.status === 'fulfilled' && Array.isArray(googleRes.value)) {
                const namaDepan = alumni.nama.split(' ')[0].toLowerCase();
                const matchLinkedin = googleRes.value.find(item => item.url.includes('linkedin.com/in/') && item.title.toLowerCase().includes(namaDepan));
                
                if (matchLinkedin) {
                    jejakBaruOtomatis.push({ source: 'LinkedIn (AutoBot)', title: matchLinkedin.title, desc: matchLinkedin.url, link: matchLinkedin.url, ditambahkan_pada: new Date().toISOString() });
                    linkedinUrlToSave = matchLinkedin.url;
                    scoreTambahan += 40;
                }
            }

            if (jejakBaruOtomatis.length > 0) {
                const currentTime = new Date().toISOString();
                const newScore = Math.min((alumni.confidence_score || 0) + scoreTambahan, 100);
                const mergedJejak = [...jejakBaruOtomatis, ...(alumni.jejak_digital || [])];

                updateLocalState(alumni.id, {
                    jejak_digital: mergedJejak,
                    tracking_status: 'Terlacak',
                    last_tracked_at: currentTime,
                    confidence_score: newScore,
                    linkedin_url: linkedinUrlToSave
                });

                await supabase.from('alumni').update({
                    jejak_digital: mergedJejak,
                    tracking_status: 'Terlacak',
                    last_tracked_at: currentTime,
                    confidence_score: newScore,
                    linkedin_url: linkedinUrlToSave
                }).eq('id', alumni.id);

                successCount++;
            }
        } catch (e) {
            console.error(`Gagal Auto-Track untuk ${alumni.nama}:`, e);
        }
        await delay(2000); 
    }

    setIsAutoTracking(false);
    setAutoTrackStatus('');
    fetchGlobalStats(); // Refresh angka dashboard setelah robot selesai
    alert(`Robot selesai bekerja! Berhasil melacak ${successCount} data otomatis.`);
  };
  
  // 4. FUNGSI EXPORT KE G-SHEETS
const exportToSpreadsheet = async (isTestMode = false) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportProgressCount(0);
    setSuccessSheetUrl(null);

    let allDataAccumulated = []; // Untuk menampung semua data
    let totalProcessed = 0;

    const headers = [
      "No", "Nama Lulusan", "NIM", "Tahun Masuk", "Tanggal Lulus", "Fakultas", 
      "Program Studi", "Email", "No Hp", "Kategori", "Posisi", "Tempat bekerja", 
      "Alamat bekerja", "Sosmed Kantor", "Linkedin", "IG", "Fb", "Tiktok", "Score (%)", "Status"
    ];

    // --- FUNGSI RECURSIVE UNTUK AMBIL DATA ---
    const fetchAndAccumulate = async (offset) => {
      const step = 1000; // Limit aman Supabase
      const to = offset + step - 1;

      console.log(`Mengambil data batch untuk Excel: ${offset} sampai ${to}...`);

      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .range(offset, to)
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map data ke format Array murni
        const batchData = data.map((item, index) => [
          totalProcessed + index + 1,
          item.nama || '', item.nim || '', item.tahun_masuk || '', item.tanggal_lulus || '',
          item.fakultas || '', item.prodi || '', item.email_alumni || '', item.no_hp || '',
          item.kategori_kerja || '', item.pekerjaan || '', item.instansi || '',
          item.alamat_bekerja || '', item.instansi_sosmed || '', item.linkedin_url || '',
          item.instagram_url || '', item.facebook_url || '', item.tiktok_url || '',
          item.confidence_score || 0, item.status || ''
        ]);

        // Masukkan ke penampung utama
        allDataAccumulated = [...allDataAccumulated, ...batchData];
        
        totalProcessed += data.length;
        setExportProgressCount(totalProcessed);
        
        // Update Persentase
        const percent = Math.min(Math.round((totalProcessed / totalData) * 100), 99);
        setExportProgress(percent);

        // --- CEK APAKAH LANJUT LAGI? ---
        if (!isTestMode && data.length === step) {
          // Tidak perlu jeda lama karena tidak kirim ke Google (hanya narik dari Supabase)
          return await fetchAndAccumulate(offset + step); 
        }
      }
    };

    try {
      await fetchAndAccumulate(0); // Mulai proses penarikan data
      
      // PROSES PEMBUATAN FILE EXCEL SETELAH SEMUA DATA TERKUMPUL
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...allDataAccumulated]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Alumni");

      // Download file secara lokal (Direct)
      const fileName = `Master_Tracer_Alumni_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setExportProgress(100);
      alert("Ekspor Excel Berhasil! File sedang didownload.");

    } catch (err) {
      console.error("Export Fail:", err);
      alert("Terjadi kesalahan saat memproses data besar.");
    } finally {
      setIsExporting(false);
    }
  };

  // 5. FUNGSI IMPORT EXCEL


  
  return { 
    queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, 
    isSearching, internalResults, externalResults, alumniDB, searchHistory, 
    currentPage, setCurrentPage, totalData, 
    executeSearch, simpanJejak, updateInformasiAlumni, 
    exportToSpreadsheet, isExporting, exportProgress, successSheetUrl,
    isImporting, importProgress, importStatus,
    isAutoTracking, autoTrackStatus, runAutoTrackCurrentPage,exportProgressCount,
    globalStats // <--- Export Stats Global
  };
};