import React, { useState } from 'react';
import { Search, Database, Globe, BookOpen, Github, User, FileSpreadsheet } from 'lucide-react';
 import { usePencarianController } from '../controllers/usePencarianController';


// ==========================================
// KONFIGURASI GOOGLE SHEETS MASTER
// ==========================================
const MASTER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1JepgHxbtFpfwAxUO3DjZd6-TOpvtCr2d/gviz/tq';
const MASTER_SHEET_GID = '1674223372';

// --- FUNGSI PARSER KHUSUS GOOGLE VIZ API ---
function parseGvizJSON(text) {
  if (!text || text.includes('<!doctype html>') || text.includes('<html')) return [];
  try {
    const startIndexJson = text.indexOf('{');
    const endIndexJson = text.lastIndexOf('}');
    if (startIndexJson === -1 || endIndexJson === -1) return [];
    
    const jsonString = text.substring(startIndexJson, endIndexJson + 1);
    const jsonData = JSON.parse(jsonString);
    if (jsonData.errors) return [];

    const rows = jsonData.table?.rows || [];
    const result = [];
    
    let startIndex = 0;
    if (rows.length > 0) {
      const firstCell = rows[0]?.c?.[0];
      if (firstCell && firstCell.v) {
        const cellStr = String(firstCell.v).toLowerCase();
        if (cellStr.includes('nama') || cellStr.includes('nim')) startIndex = 1;
      }
    }

    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i]?.c;
      if (!row) continue;
      
      const nama = row[0]?.v ? String(row[0].v) : '';
      const nim = row[1]?.v ? String(row[1].v).trim() : '';
      
      if (nama || nim) {
        result.push({
          nim: nim || '-',
          nama: nama || 'Tanpa Nama',
          tahunMasuk: row[2]?.v ? String(row[2].v) : '-',
          tanggalLulus: (row[3]?.f || row[3]?.v) ? String(row[3].f || row[3].v) : '-',
          fakultas: row[4]?.v ? String(row[4].v) : '-',
          prodi: row[5]?.v ? String(row[5].v) : '-',
        });
      }
    }
    return result;
  } catch (e) {
    console.error("Gagal Parse JSON:", e);
    return [];
  }
}

export default function PencarianView({ alumniDB = [] }) {
  const { 
    queryNama, setQueryNama, 
    queryAfiliasi, setQueryAfiliasi, 
    queryKonteks, setQueryKonteks, 
    isSearching, internalResults, externalResults, executeSearch 
  } = usePencarianController(alumniDB);

  // State khusus untuk pencarian Spreadsheet
  const [sheetResults, setSheetResults] = useState([]);
  const [isSearchingSheet, setIsSearchingSheet] = useState(false);

  const groupedExternal = {
    'PDDIKTI'   : [],
    'GitHub'    : [],
    'Google Web': [],
    'ORCID'     : []
  };

  externalResults.forEach(item => {
    if (groupedExternal[item.source]) {
      groupedExternal[item.source].push(item);
    }
  });

  // Fungsi untuk menggabungkan pencarian Controller + Spreadsheet
  const handleSearchTerpadu = async (e) => {
    e.preventDefault();
    
    // 1. Eksekusi pencarian original (Controller)
    if (executeSearch) {
      executeSearch(e);
    }

    // 2. Eksekusi pencarian ke Google Sheets secara bersamaan
    if (!queryNama) return;
    setIsSearchingSheet(true);
    setSheetResults([]);
    
    try {
      let queryStr = `select *`;
      const safeSearch = queryNama.replace(/'/g, "\\'"); 
      queryStr += ` where lower(A) contains lower('${safeSearch}') or lower(B) contains lower('${safeSearch}')`;
      queryStr += ` limit 50`; // Batasi agar tidak hang
      
      const encodedQuery = encodeURIComponent(queryStr);
      const fetchUrl = `${MASTER_SHEET_URL}?tqx=out:json&gid=${MASTER_SHEET_GID}&tq=${encodedQuery}&cb=${Date.now()}`;

      const response = await fetch(fetchUrl);
      if (response.ok) {
        const textResponse = await response.text();
        const parsed = parseGvizJSON(textResponse);
        setSheetResults(parsed);
      }
    } catch (err) {
      console.error("Gagal menarik data dari Sheet:", err);
    } finally {
      setIsSearchingSheet(false);
    }
  };

  const showResults = internalResults.length > 0 || externalResults.length > 0 || sheetResults.length > 0 || isSearching || isSearchingSheet;

  return (
    <div className="max-w-[1500px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Search className="text-blue-600" /> Pencarian Jejak Alumni Terpadu
      </h2>
      
      <form onSubmit={handleSearchTerpadu} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Nama Alumni *</label>
            <input required type="text" placeholder="Misal: Naufal Ramzi" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={queryNama} onChange={(e) => setQueryNama(e.target.value)} />
          </div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Kata Kunci Afiliasi</label>
            <input type="text" placeholder="Misal: Universitas Muhammadiyah Malang" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={queryAfiliasi} onChange={(e) => setQueryAfiliasi(e.target.value)} />
          </div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Kata Kunci Konteks</label>
            <input type="text" placeholder="Misal: Informatika" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={queryKonteks} onChange={(e) => setQueryKonteks(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={isSearching || isSearchingSheet} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex justify-center gap-2 transition-colors">
          {(isSearching || isSearchingSheet) ? <span className="animate-pulse">Menyiapkan Kueri & Melacak Paralel...</span> : 'Lacak Jejak Publik & Internal'}
        </button>
      </form>

      {showResults && (
        <div className="flex flex-col gap-6">
          
          {(isSearching || isSearchingSheet) ? (
             <div className="text-center py-12 text-blue-600 font-medium animate-pulse bg-blue-50 rounded-xl border border-blue-100">
               Mencari data secara real-time di 6 platform sekaligus (termasuk Excel)...
             </div>
          ) : (
            // Mengubah grid agar cukup untuk 6 kolom (xl:grid-cols-6)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
              
              {/* KOLOM 1: DATABASE INTERNAL */}
              <div className="bg-white rounded-xl shadow-sm border border-green-200 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-green-600 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Database size={14} /> Internal DB
                  </span>
                  <span className="text-[10px] bg-green-800 px-2 py-0.5 rounded-full">{internalResults.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {internalResults.length > 0 ? internalResults.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 rounded-lg border border-green-200 bg-white hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1" title={item.nama}>{item.nama}</h4>
                      <p className="text-[11px] text-gray-600 font-medium mt-1 line-clamp-2">{item.prodi} - {item.kampus}</p>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[11px] text-gray-700 line-clamp-2"><strong>Kerja:</strong> {item.pekerjaan} di {item.instansi}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 text-center mt-10">Data tidak ditemukan di database internal.</p>
                  )}
                </div>
              </div>

              {/* KOLOM TAMBAHAN: GOOGLE SHEETS MASTER */}
              <div className="bg-white rounded-xl shadow-sm border border-orange-200 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-orange-600 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet size={14} /> Excel Master
                  </span>
                  <span className="text-[10px] bg-orange-800 px-2 py-0.5 rounded-full">{sheetResults.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {sheetResults.length > 0 ? sheetResults.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-orange-200 bg-white hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1" title={item.nama}>{item.nama}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{item.nim}</p>
                      <p className="text-[11px] text-gray-600 font-medium mt-1 line-clamp-2">{item.prodi} ({item.tahunMasuk})</p>
                      <div className="mt-2 pt-2 border-t border-orange-50 flex flex-col gap-0.5">
                         <span className="text-[10px] text-gray-500">Lulus: {item.tanggalLulus}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 text-center mt-10">Data tidak ditemukan di File Excel Master.</p>
                  )}
                </div>
              </div>

              {/* KOLOM 2: PDDIKTI */}
              <div className="bg-white rounded-xl shadow-sm border border-indigo-200 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><BookOpen size={14} /> PDDIKTI</span>
                  <span className="text-[10px] bg-indigo-800 px-2 py-0.5 rounded-full">{groupedExternal['PDDIKTI'].length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {groupedExternal['PDDIKTI'].length > 0 ? groupedExternal['PDDIKTI'].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-indigo-100 bg-white hover:border-indigo-300 transition-colors">
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-2" title={item.title}>{item.title}</h4>
                      <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  )) : <p className="text-xs text-gray-400 text-center mt-10">Tidak ada rekam jejak akademik.</p>}
                </div>
              </div>

              {/* KOLOM 3: GITHUB */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-300 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-gray-800 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Github size={14} /> GitHub</span>
                  <span className="text-[10px] bg-gray-900 px-2 py-0.5 rounded-full">{groupedExternal['GitHub'].length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {groupedExternal['GitHub'].length > 0 ? groupedExternal['GitHub'].map((item, idx) => (
                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                      <img src={item.image} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate" title={item.title}>{item.title}</h4>
                        <p className="text-[10px] text-blue-600 mt-0.5">Lihat Profil &rarr;</p>
                      </div>
                    </a>
                  )) : <p className="text-xs text-gray-400 text-center mt-10">Tidak ada profil developer.</p>}
                </div>
              </div>

              {/* KOLOM 4: GOOGLE WEB */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-200 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-blue-600 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Globe size={14} /> Google</span>
                  <span className="text-[10px] bg-blue-800 px-2 py-0.5 rounded-full">{groupedExternal['Google Web'].length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {groupedExternal['Google Web'].length > 0 ? groupedExternal['Google Web'].map((item, idx) => (
                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg border border-blue-100 bg-white hover:border-blue-400 transition-colors">
                      <h4 className="font-bold text-[11px] text-blue-700 line-clamp-2 leading-tight" title={item.title}>{item.title}</h4>
                      <p className="text-[9px] text-gray-500 mt-1.5 truncate">{item.link}</p>
                    </a>
                  )) : <p className="text-xs text-gray-400 text-center mt-10">Tidak ada jejak website/berita.</p>}
                </div>
              </div>

              {/* KOLOM 5: ORCID */}
              <div className="bg-white rounded-xl shadow-sm border border-teal-200 flex flex-col h-[450px] overflow-hidden">
                <div className="bg-teal-600 text-white p-3 flex justify-between items-center shrink-0">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><User size={14} /> ORCID</span>
                  <span className="text-[10px] bg-teal-800 px-2 py-0.5 rounded-full">{groupedExternal['ORCID'].length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                  {groupedExternal['ORCID'].length > 0 ? groupedExternal['ORCID'].map((item, idx) => (
                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg border border-teal-100 bg-white hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">ID: {item.desc}</p>
                    </a>
                  )) : <p className="text-xs text-gray-400 text-center mt-10">Tidak ada publikasi riset.</p>}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}