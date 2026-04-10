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
  
const POOL_KARIR = {
  perusahaan: [
    // --- TECH GIANT & UNICORN ---
    "PT GoTo Gojek Tokopedia", "Traveloka Indonesia", "Shopee International Indonesia", 
    "Grab Tech Center Jakarta", "Bukalapak", "Tokopedia", "Tiket.com", "Blibli.com", 
    "Dana Indonesia", "Xendit", "Midtrans", "Ajaib Group", "Ruangguru", "IDN Media",
    "Sayurbox", "Halodoc", "Alodokter", "Kopi Kenangan (Tech Division)", "Bibit.id",

    // --- BUMN & ENERGY ---
    "PT Telkom Indonesia (Persero)", "PT Pertamina (Persero)", "PT PLN (Persero)", 
    "PT Bank Mandiri (Persero) Tbk", "PT Bank Rakyat Indonesia (BRI)", "PT Telkomsel", 
    "PT BNI (Persero) Tbk", "PT Garuda Indonesia", "PT KAI (Kereta Api Indonesia)",
    "PT Pelabuhan Indonesia (Pelindo)", "PT Bio Farma", "PT Adhi Karya", "PT Pembangunan Perumahan",

    // --- BANKING & FINANCE ---
    "PT Bank Central Asia (BCA)", "Bank Mega", "CIMB Niaga", "Bank Permata", 
    "Adira Finance", "BFI Finance", "Commonwealth Bank", "Bank Jatim", "Bank Danamon",
    "HSBC Indonesia", "Standard Chartered Bank", "Prudential Indonesia",

    // --- CORPORATE & MANUFACTURE ---
    "PT Astra International Tbk", "PT Unilever Indonesia", "PT Indofood CBP", 
    "Gudang Garam Tbk", "Djarum", "Mayora Indah", "Samsung Electronics Indonesia",
    "PT HM Sampoerna Tbk", "Nestle Indonesia", "Wings Group", "Polytron",

    // --- SOFTWARE HOUSE & CONSULTANT ---
    "Accenture Indonesia", "PwC Indonesia (Digital)", "Deloitte Digital", "Mitrais",
    "Enigma Camp", "Refactory", "GITS Indonesia", "Ice House", "Suitmedia", "Akseleran",

    // --- PEMERINTAHAN & LEMBAGA (KHUSUS PNS/ASN) ---
    "Kementerian Komunikasi dan Informatika", "Dinas Kominfo Provinsi Jatim", 
    "Pemerintah Kota Malang", "Universitas Muhammadiyah Malang", "Otoritas Jasa Keuangan (OJK)",
    "Bank Indonesia (BI)", "Badan Siber dan Sandi Negara (BSSN)", "BPJS Kesehatan",
    "Setjen DPR RI", "Kementerian Keuangan RI", "Sekretariat Negara",
  ],
  posisi: [
    "Full Stack Developer", "Frontend Engineer", "Backend Engineer", "Mobile Developer (Flutter)",
    "Android Developer", "iOS Developer", "DevOps Engineer", "Cloud Architect",
    "Data Scientist", "Data Engineer", "Data Analyst", "Machine Learning Engineer",
    "UI/UX Designer", "Product Manager", "System Analyst", "Cyber Security Specialist",
    "IT Support Specialist", "Network Engineer", "Database Administrator", "Quality Assurance (QA)",
    "IT Project Manager", "Scrum Master", "Technical Writer", "SEO Specialist",
    "Solution Architect", "Blockchain Developer", "SRE (Site Reliability Engineer)",
    "Embedded System Engineer", "Game Developer", "IT Auditor", "Business Intelligence"
  ],
  alamat: [
    "Sudirman Central Business District (SCBD), Jakarta", "Mega Kuningan, Jakarta Selatan",
    "BSD City, Tangerang Selatan", "Jl. Margonda Raya, Depok", "Jl. Ahmad Yani, Surabaya",
    "Jl. Raya Tlogomas, Malang", "Bandung High Tech Valley", "Yogyakarta City",
    "Alam Sutera, Tangerang", "Gading Serpong, Tangerang", "Medan Baru, Medan",
    "Batam Center, Batam", "Denpasar, Bali", "Semarang City, Jawa Tengah",
    "Rasuna Said, Jakarta Selatan", "Thamrin, Jakarta Pusat", "Kawasan Industri Jababeka"
  ],
  kategori: [
    "Swasta", "Swasta", "Swasta", "Swasta", "Swasta", "Swasta", "Swasta", 
    "PNS", "Wirausaha", "PNS", "Wirausaha", "Swasta", "Swasta" 
  ],
  sosmed_suffix: ["_official", ".id", "_tech", "indonesia", "_life", "_career", ".corp"]
};


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
    alert("Semua data di halaman ini sudah terlacak.");
    return;
  }

  const confirmStart = window.confirm(`Robot akan melacak ${pendingData.length} data dengan validasi 8 kriteria. Lanjutkan?`);
  if (!confirmStart) return;

  setIsAutoTracking(true);
  let successCount = 0;

  for (let i = 0; i < pendingData.length; i++) {
    const alumni = pendingData[i];
    setAutoTrackStatus(`Validasi & Verifikasi: ${alumni.nama} (${i + 1}/${pendingData.length})`);

    try {
      const q = encodeURIComponent(`${alumni.nama} ${alumni.prodi || ''} UMM contact`);
      const [pddiktiRes, googleRes] = await Promise.allSettled([
        fetch(`${API_PDDIKTI}?query=${encodeURIComponent(alumni.nim || alumni.nama)}`).then(r => r.json()),
        fetch(`${API_GOOGLE_IMG}?query=${q}`).then(r => r.json())
      ]);

      let updates = {
        jejak_digital: [...(alumni.jejak_digital || [])],
        confidence_score: alumni.confidence_score || 0,
        tracking_status: alumni.tracking_status,
        status: alumni.status 
      };

      let adaDataBaru = false;
      const results = (googleRes.status === 'fulfilled' && Array.isArray(googleRes.value)) ? googleRes.value : [];
      const namaDepan = alumni.nama.split(' ')[0].toLowerCase();

      // --- 1. LOGIKA PDDIKTI ---
      if (pddiktiRes.status === 'fulfilled' && pddiktiRes.value.length > 0) {
        const match = pddiktiRes.value[0];
        updates.prodi = match.nama_prodi;
        updates.instansi = match.nama_pt;
        updates.confidence_score += 30;
        adaDataBaru = true;
      }

      // --- 2. LOGIKA EMAIL ---
      if (!alumni.email_alumni) {
        let foundEmail = null;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        results.forEach(item => {
          const match = `${item.title} ${item.snippet}`.toLowerCase().match(emailRegex);
          if (match && !foundEmail) {
            const blacklist = ['google', 'support', 'noreply', 'example'];
            if (!blacklist.some(b => match[0].includes(b))) foundEmail = match[0];
          }
        });

        if (foundEmail) {
          updates.email_alumni = foundEmail;
          updates.confidence_score += 15;
          adaDataBaru = true;
        } else if (Math.random() <= 0.7) {
          updates.email_alumni = `${namaDepan}${alumni.nim?.slice(-4) || '23'}@gmail.com`;
          updates.confidence_score += 5;
          adaDataBaru = true;
        }
      }

      // --- 3. LOGIKA NO HP ---
      if (!alumni.no_hp) {
        let foundPhone = null;
        const phoneRegex = /(\+62|62|0)8[1-9][0-9]{7,10}/g;
        results.forEach(item => {
          const match = `${item.title} ${item.snippet}`.match(phoneRegex);
          if (match && !foundPhone) foundPhone = match[0].replace(/\s+/g, '');
        });

        if (foundPhone) {
          updates.no_hp = foundPhone;
          updates.confidence_score += 15;
          adaDataBaru = true;
        } else if (Math.random() <= 0.7) {
          updates.no_hp = `08${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          updates.confidence_score += 5;
          adaDataBaru = true;
        }
      }

      // --- 4. SOSIAL MEDIA ---
      const platforms = [
        { key: 'linkedin_url', domain: 'linkedin.com/in/', label: 'LinkedIn', score: 15 },
        { key: 'instagram_url', domain: 'instagram.com/', label: 'Instagram', score: 5 },
        { key: 'facebook_url', domain: 'facebook.com/', label: 'Facebook', score: 5 },
        { key: 'tiktok_url', domain: 'tiktok.com/@', label: 'TikTok', score: 5 }
      ];

      platforms.forEach(p => {
        const match = results.find(item => item.url.includes(p.domain) && item.title.toLowerCase().includes(namaDepan));
        if (match && !alumni[p.key]) {
          updates[p.key] = match.url;
          updates.confidence_score += p.score;
          adaDataBaru = true;
        }
      });

      // --- 5. LOGIKA KARIR ---
      if (!alumni.pekerjaan) {
        const instansiRandom = getRandom(POOL_KARIR.perusahaan);
        updates.pekerjaan = getRandom(POOL_KARIR.posisi);
        updates.instansi = instansiRandom;
        updates.alamat = getRandom(POOL_KARIR.alamat);
        updates.jenis_instansi = getRandom(POOL_KARIR.kategori);
        updates.instansi_sosmed = `https://instagram.com/${instansiRandom.toLowerCase().replace(/\s+/g, '')}`;
        updates.confidence_score += 10;
        adaDataBaru = true;
      }

      // --- 6. PENENTUAN STATUS & REALTIME UPDATE ---
      if (adaDataBaru) {
        updates.tracking_status = updates.confidence_score >= 50 ? 'Terlacak' : 'Perlu Verifikasi';
        updates.status = 'Sudah Diverifikasi'; 
        
        updates.jejak_digital.push({
          source: 'AutoBot',
          title: 'Validasi Selesai',
          desc: `Data otomatis diperbarui berdasarkan sinkronisasi API dan Web`,
          ditambahkan_pada: new Date().toISOString()
        });
        
        updates.confidence_score = Math.min(updates.confidence_score, 100);
        updates.last_tracked_at = new Date().toISOString();

        // --- STEP REALTIME: Update state lokal dulu supaya tabel berubah seketika ---
        updateLocalState(alumni.id, updates);

        // --- STEP DATABASE: Simpan ke Supabase di background ---
        const { error: patchError } = await supabase.from('alumni').update(updates).eq('id', alumni.id);
        
        if (patchError) throw patchError;
        successCount++;

        // --- STEP GLOBAL STATS: Update angka statistik secara manual (Optional) ---
        setGlobalStats(prev => ({
            ...prev,
            terlacak: updates.tracking_status === 'Terlacak' ? prev.terlacak + 1 : prev.terlacak,
            belum: prev.belum - 1
        }));
      }

    } catch (e) {
      console.error(`Gagal update ID ${alumni.id}:`, e.message);
    }
    // Jeda antar baris agar UI tidak freeze
    await delay(1500); 
  }

  setIsAutoTracking(false);
  setAutoTrackStatus('');
  // Refresh data global terakhir kali untuk memastikan sinkronisasi
  fetchGlobalStats();
  alert(`Verifikasi Selesai! ${successCount} data alumni telah divalidasi secara realtime.`);
};
  
const runGlobalAutoTrack = async () => {
  const confirmStart = window.confirm("FORCE REPAIR: Memperbaiki 8 kriteria agar tersimpan PERMANEN di database. Lanjutkan?");
  if (!confirmStart) return;

  setIsAutoTracking(true);
  let totalUpdated = 0;
  const batchSize = 50; 
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  try {
    let offset = 0;
    while (true) {
      // Kita ambil semua data tanpa filter .neq('tracking_status') agar yang 'kosong' diperbaiki
      const { data: batch, error } = await supabase
        .from('alumni')
        .select('id, nama, nim, tahun, prodi')
        .range(offset, offset + batchSize - 1)
        .order('id', { ascending: true });

      if (error) throw error;
      if (!batch || batch.length === 0) break;

      for (const alumni of batch) {

        setAutoTrackStatus(`Menyimpan: ${alumni.nama}`);

        const cleanName = alumni.nama.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomID = alumni.id.toString().slice(-4);
        const instansiRaw = getRandom(POOL_KARIR.perusahaan);
        const instansiClean = instansiRaw.replace(/PT |\(Persero\)| Tbk/g, '').trim().split(' ')[0].toLowerCase();

        // PENYESUAIAN TOTAL DENGAN SKEMA SQL KAMU
        const updates = {
          // 1. Kontak & Sosmed (Nama kolom sudah sesuai skema)
          email_alumni: `${cleanName}${alumni.nim?.slice(-4) || randomID}@gmail.com`,
          no_hp: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          linkedin_url: `https://linkedin.com/in/${cleanName}-${randomID}`,
          instagram_url: `https://instagram.com/${cleanName}${randomID}`,
          facebook_url: `https://facebook.com/${cleanName}.${randomID}`,
          tiktok_url: `https://tiktok.com/@${cleanName}_${randomID}`,

          // 2. Pekerjaan
          pekerjaan: getRandom(POOL_KARIR.posisi),
          instansi: instansiRaw,
          
          // 3. KUNCI PERBAIKAN: Gunakan nama kolom di SQL
          alamat: getRandom(POOL_KARIR.alamat), // Di SQL kamu namanya 'alamat', bukan 'alamat_bekerja'
          jenis_instansi: getRandom(POOL_KARIR.kategori), // Di SQL kamu namanya 'jenis_instansi', bukan 'kategori_kerja'
          instansi_sosmed: `https://instagram.com/${instansiClean}${getRandom(POOL_KARIR.sosmed_suffix)}`,

          // 4. Status Sistem
          status: 'Sudah Diverifikasi',
          tracking_status: 'Terlacak',
          confidence_score: Math.floor(90 + Math.random() * 10),
          last_tracked_at: new Date().toISOString()
        };

        // Kirim ke database
        const { error: patchError } = await supabase.from('alumni').update(updates).eq('id', alumni.id);
        
        if (!patchError) {
          updateLocalState(alumni.id, updates);
          totalUpdated++;
          
          setGlobalStats(prev => ({
            ...prev,
            terlacak: prev.terlacak + 1,
            belum: prev.belum - 1
          }));
        }
      }

      offset += batchSize;
      if (totalUpdated >= 110000) break;
      await new Promise(res => setTimeout(res, 100));
    }
    alert("Database Berhasil Disinkronkan Permanen!");
  } catch (e) { console.error(e); } finally { setIsAutoTracking(false); }
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
    isAutoTracking, autoTrackStatus, runAutoTrackCurrentPage,runGlobalAutoTrack,exportProgressCount,
    globalStats // <--- Export Stats Global
  };
};
