import React, { useState, useEffect } from 'react';
import { 
  Search, Database, Globe, BookOpen, User, Save, Clock, History, 
  ChevronRight, MapPin, Briefcase, Activity, ChevronLeft, ExternalLink,
  Eye, Edit2, Link, Download, Upload, Smartphone, Building, CloudLightning, 
  FileCheck, Github, Wand, UserPlus, Info, AlertCircle, CheckCircle2, Timer, Loader2,
} from 'lucide-react';
import { usePencarianController } from '../controllers/usePencarianController';

export default function PencarianView({ setActiveTab }) {
  const { 
    queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, 
    isSearching, internalResults, externalResults, alumniDB, executeSearch, simpanJejak, updateInformasiAlumni,
    currentPage, setCurrentPage, totalData, searchHistory, 
    exportToSpreadsheet, isExporting, exportProgress, successSheetUrl,
    isImporting, importProgress, importStatus, handleImportExcel,exportProgressCount,
    isAutoTracking, autoTrackStatus, runAutoTrackCurrentPage,runGlobalAutoTrack,
    globalStats 
  } = usePencarianController();

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [tableFilter, setTableFilter] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    // Mengecek jika alumniDB sudah ter-load (meskipun kosong/length 0, artinya fetch selesai)
    if (alumniDB) {
      // Memberikan sedikit delay 500ms agar transisi UI terlihat halus
      const timer = setTimeout(() => setIsPageLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [alumniDB]);
  // -----------------------------

  // 1. LOGIKA STATISTIK GLOBAL
  const displayStats = globalStats || { terlacak: 0, verifikasi: 0, belum: 0 };

  useEffect(() => {
    if (isSearching) setShowApiPanel(true);
    if (queryNama.trim() === '') setShowApiPanel(false);
  }, [isSearching, queryNama]);

  const groupedExternal = { 'PDDIKTI': [], 'GitHub': [], 'Google Web': [], 'ORCID': [] };
  externalResults.forEach(item => { if (groupedExternal[item.source]) groupedExternal[item.source].push(item); });

  const filteredTableData = internalResults.filter(item => 
    item.nama.toLowerCase().includes(tableFilter.toLowerCase()) || 
    (item.nim && item.nim.toLowerCase().includes(tableFilter.toLowerCase()))
  );

  const SaveTracerButton = ({ item }) => (
    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
      <Save size={12} className="text-indigo-500 shrink-0" />
      <select className="w-full text-[10px] p-1.5 border border-indigo-200 rounded text-indigo-700 bg-indigo-50 outline-none cursor-pointer font-bold transition-all hover:bg-indigo-100" onChange={(e) => { if(e.target.value) { simpanJejak(e.target.value, item); setSelectedReportId(parseInt(e.target.value)); } e.target.value = ""; }} defaultValue="">
        <option value="" disabled>Tautkan ke Data...</option>
        {internalResults.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
      </select>
    </div>
  );

  const selectedAlumni = internalResults.find(a => a.id.toString() === selectedReportId?.toString()) || alumniDB.find(a => a.id.toString() === selectedReportId?.toString());

  const getStatusColor = (status) => {
    if (status === 'Terlacak') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  const getStatusDot = (status) => {
    if (status === 'Terlacak') return 'bg-emerald-500';
    if (status === 'Pending') return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const SearchableInput = ({ label, field, placeholder, icon, searchContext }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">{icon} {label}</label>
        <div className="flex gap-2">
            <input 
                key={`${field}-${selectedAlumni[field]}`}
                className="flex-1 text-xs font-bold p-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                defaultValue={selectedAlumni[field]} 
                onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, field, e.target.value)} 
                placeholder={placeholder} 
            />
            <button onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchContext)}`, '_blank')} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors" title={`Cari ${label}`}>
                <Search size={14}/>
            </button>
        </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] w-full mx-auto animate-in fade-in duration-500 px-4 pb-20 font-sans relative">
      
      {/* UI LOADING OVERLAY INITIAL DATA */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-300 border border-slate-100">
                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-black text-slate-800">Memuat Data...</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">Menyiapkan dashboard pelacakan alumni</p>
            </div>
        </div>
      )}
      
      {/* UI LOADING OVERLAY IMPORT EXCEL */}
      {isImporting && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4"><Upload size={32} className="animate-bounce" /></div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Mengimpor Data Excel</h3>
                <p className="text-xs font-bold text-slate-500 mb-6">{importStatus || 'Membaca file...'}</p>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner"><div className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out relative" style={{ width: `${importProgress}%` }}><div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div></div></div>
                <div className="flex justify-between w-full text-xs font-black text-slate-400"><span>Sedang diproses...</span><span className="text-indigo-600 text-sm">{importProgress}%</span></div>
            </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 mt-4">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg"><Activity className="text-white" size={20} /></div>
          Pelacakan Alumni <span className="text-indigo-600 font-mono text-sm bg-indigo-50 px-2 py-1 rounded">Remidi V1 (untuk daily project 3 dan 4)</span>
        </h2>
        
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block mr-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total alumni</p>
                <p className="text-lg font-black text-gray-900">{totalData.toLocaleString('id-ID')}</p>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            {setActiveTab && (
              <button onClick={() => setActiveTab('pendataan')} disabled={isSearching || isImporting || isExporting || isAutoTracking} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 px-3 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50">
                  <UserPlus size={14} /> Tambah Manual
              </button>
            )}

            <input type="file" id="import-excel" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcel} disabled={isImporting || isExporting || isSearching || isAutoTracking} />
            <label htmlFor="import-excel" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-sm cursor-pointer transition-all ${isImporting ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-200 active:scale-95'}`}>
                <Upload size={14} /> Import
            </label>

            <button onClick={() => exportToSpreadsheet(true)} disabled={isSearching || isImporting || isExporting || isAutoTracking} className="flex items-center gap-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-200 px-3 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50">
                <CloudLightning size={14} /> Test export 1000 data
            </button>

            <button 
                onClick={() => exportToSpreadsheet(false)} 
                disabled={isSearching || isImporting || isExporting || isAutoTracking} 
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all min-w-[160px] ${
                    isExporting 
                    ? 'bg-emerald-100 text-emerald-600 cursor-wait' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700 active:scale-95 disabled:opacity-50'
                }`}
            >
                {/* Baris Atas: Ikon dan Teks Status */}
                <div className="flex items-center gap-2">
                    {isExporting ? <Activity size={14} className="animate-spin" /> : <Download size={14} />} 
                    <span>{isExporting ? `Sync ${exportProgress}%` : 'Export All To Excel'}</span>
                </div>

                {/* Baris Bawah: Counter Data (Hanya muncul saat Exporting) */}
                {isExporting && (
                    <div className="text-[9px] font-black text-emerald-500 bg-emerald-200/50 px-2 py-0.5 rounded-full animate-pulse">
                        {(exportProgressCount || 0).toLocaleString('id-ID')} / {totalData.toLocaleString('id-ID')}
                    </div>
                )}
            </button>
        </div>
      </div>

      {/* 2. DASHBOARD INFORMASI GLOBAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1"><Globe size={12}/> Teridentifikasi</span>
            <span className="text-[10px] font-bold text-slate-400">{Math.round(((displayStats.terlacak + displayStats.verifikasi) / (totalData || 1)) * 100)}%</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{(displayStats.terlacak + displayStats.verifikasi).toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12}/> Terlacak (Valid)</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{displayStats.terlacak.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12}/> Perlu Verifikasi</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{displayStats.verifikasi.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm opacity-80">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Timer size={12}/> Antrean data belum ditemukan</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{displayStats.belum.toLocaleString('id-ID')}</p>
        </div>
      </div>



      {/* KOTAK NOTIFIKASI SUKSES */}
      {successSheetUrl && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
              <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-full text-white"><FileCheck size={20} /></div>
                  <div>
                      <p className="font-bold text-emerald-800 text-sm">Laporan Spreadsheet Berhasil Dibuat!</p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">Silakan klik tombol di samping untuk membuka.</p>
                  </div>
              </div>
              <a href={successSheetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap">
                  <ExternalLink size={14} /> BUKA SPREADSHEET
              </a>
          </div>
      )}
      
      {/* FORM PENCARIAN WEB */}
      <form onSubmit={executeSearch} className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-900/5 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 mt-4">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg"><Search className="text-white" size={20} /></div>
          Cari Data <span className="text-indigo-600 font-mono text-sm bg-indigo-50 px-2 py-1 rounded"></span>
        </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <input required type="text" placeholder="Nama / NIM (Pencarian Global)..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={queryNama} onChange={(e) => setQueryNama(e.target.value)} />
          <input type="text" placeholder="Fakultas / Prodi..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={queryAfiliasi} onChange={(e) => setQueryAfiliasi(e.target.value)} />
          <input type="text" placeholder="Konteks (Misal: LinkedIn)..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={queryKonteks} onChange={(e) => setQueryKonteks(e.target.value)} />
        </div>
        <button type="submit" disabled={isSearching || isExporting || isAutoTracking} className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-black tracking-widest text-xs uppercase flex justify-center items-center gap-2 transition-all">
          {isSearching ? <Activity size={16} className="animate-spin"/> : <Search size={16}/>} MULAI PELACAKAN WEB
        </button>
      </form>

      {/* HASIL PENCARIAN API */}
      {showApiPanel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
              {['PDDIKTI', 'GitHub', 'Google Web', 'ORCID'].map((source) => (
                <div key={source} className={`bg-white rounded-xl shadow-sm border flex flex-col h-[450px] overflow-hidden ${source === 'PDDIKTI' ? 'border-indigo-200' : source === 'GitHub' ? 'border-gray-300' : source === 'Google Web' ? 'border-blue-200' : 'border-teal-200'}`}>
                  <div className={`p-3 flex justify-between items-center shrink-0 text-white ${source === 'PDDIKTI' ? 'bg-indigo-600' : source === 'GitHub' ? 'bg-gray-800' : source === 'Google Web' ? 'bg-blue-600' : 'bg-teal-600'}`}>
                    <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      {source === 'PDDIKTI' ? <BookOpen size={14}/> : source === 'GitHub' ? <Github size={14}/> : source === 'Google Web' ? <Globe size={14}/> : <User size={14}/>} {source}
                    </span>
                    <span className="text-[10px] opacity-80 px-2 py-0.5 rounded-full bg-black/20">{groupedExternal[source].length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/50">
                    {groupedExternal[source].length > 0 ? groupedExternal[source].map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow overflow-hidden">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border-b border-gray-100">
                              {item.image && <img src={item.image} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-100 object-cover" />}
                              <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-xs text-gray-900 truncate" title={item.title}>{item.title}</h4>
                                  <p className="text-[10px] text-blue-600 mt-0.5">Lihat Profil &rarr;</p>
                              </div>
                          </a>
                          <div className="px-3 pb-3"><SaveTracerButton item={item} /></div>
                      </div>
                    )) : <p className="text-xs text-gray-400 text-center mt-10">Tidak ada temuan.</p>}
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* AREA UTAMA (TABEL & VALIDATOR) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* PANEL KIRI: TABEL */}
        <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="font-black text-xs uppercase text-gray-600 flex items-center gap-2"><Database size={14}/> Data Alumni</span>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={runAutoTrackCurrentPage}
                            disabled={isAutoTracking || isSearching || isExporting || isImporting}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all w-full sm:w-auto justify-center ${
                                isAutoTracking 
                                ? 'bg-purple-100 text-purple-600 cursor-wait' 
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 active:scale-95'
                            }`}
                        >
                            {isAutoTracking ? <Activity size={12} className="animate-spin"/> : <Wand size={12} />}
                            {isAutoTracking ? autoTrackStatus : 'Lacak Otomatis pada Halaman ini'}
                        </button>

                        <button 
                            onClick={runGlobalAutoTrack}
                            disabled={isAutoTracking || isSearching || isExporting || isImporting}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all w-full sm:w-auto justify-center ${
                                isAutoTracking 
                                ? 'bg-green-100 text-purple-600 cursor-wait' 
                                : 'bg-gradient-to-r from-green-600 to-green-600 text-white hover:from-green-700 hover:to-indigo-700 active:scale-95'
                            }`}
                        >
                            {isAutoTracking ? <Activity size={12} className="animate-spin"/> : <Wand size={12} />}
                            {isAutoTracking ? autoTrackStatus : 'Lacak Otomatis Seluruh Data'}
                        </button>

                        {/*<div className="relative w-full sm:w-48">
                            <Search size={14} className="absolute left-3 top-2 text-gray-400" />
                            <input type="text" placeholder="Cari di halaman ini" className="w-full pl-8 pr-4 py-1.5 text-xs font-bold border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={tableFilter} onChange={(e) => setTableFilter(e.target.value)} />
                        </div>*/}
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                <th className="p-4 pl-6">INFO ALUMNI</th><th className="p-4">AKADEMIK</th><th className="p-4">KATEGORI</th><th className="p-4">STATUS</th><th className="p-4">CONFIDENCE</th><th className="p-4 pr-6">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTableData.map((item) => {
                                const getInitials = (name) => {
                                    if (!name) return 'A'; const parts = name.replace(/[^a-zA-Z ]/g, '').trim().split(' ');
                                    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
                                };
                                return (
                                <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedReportId === item.id ? 'bg-indigo-50/50' : ''}`}>
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">{getInitials(item.nama)}</div>
                                            <div><div className="font-bold text-slate-800 text-sm">{item.nama}</div><div className="text-[10px] font-mono text-slate-400">{item.nim}</div></div>
                                        </div>
                                    </td>
                                    <td className="p-4"><div className="font-bold text-slate-700 text-xs">{item.prodi || '-'}</div><div className="text-[10px] text-slate-400">Angkatan {item.tahun || '-'}</div></td>
                                    <td className="p-4"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold"><Briefcase size={10} /> {item.jenis_instansi || 'Belum Diisi'}</span></td>
                                    <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(item.tracking_status)}`}><div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.tracking_status)}`}></div>{item.tracking_status || 'Menunggu'}</span></td>
                                    <td className="p-4">
                                        <div className="w-20">
                                            <div className="flex justify-between text-[9px] mb-1"><span className="font-bold text-slate-700">{(item.confidence_score ? item.confidence_score / 10 : 0).toFixed(1)}</span><span className="text-slate-400 font-bold">{item.confidence_score || 0}%</span></div>
                                            <div className="w-full bg-slate-200 rounded-full h-1"><div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${item.confidence_score || 0}%` }}></div></div>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6"><button onClick={() => setSelectedReportId(item.id)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-[10px] rounded-lg transition-all active:scale-95"><Edit2 size={12} /> VALIDASI</button></td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>

                <div className="shrink-0 bg-white border-t border-slate-100">
                    <div className="p-4 flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase">Hal {currentPage + 1} dari {Math.ceil(totalData / 50)}</span><div className="flex gap-2"><button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all active:scale-95"><ChevronLeft size={16}/></button><button onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all active:scale-95"><ChevronRight size={16}/></button></div></div>
                </div>
            </div>
        </div>

        {/* PANEL KANAN: VALIDATOR DENGAN SEMUA FIELD (Linkedin, IG, FB, Tiktok, Email, HP, Karir, Alamat Kerja, Sosmed Kantor) */}
        <div className="w-full lg:w-1/3">
            {selectedAlumni ? (
                <div key={selectedAlumni.id + selectedAlumni.last_tracked_at} className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-in slide-in-from-right-8 duration-500 h-[750px] flex flex-col">
                    <div className="bg-gray-900 p-6 text-white shrink-0">
                        <div className="flex justify-between items-start">
                            <div><h4 className="font-black text-lg uppercase tracking-tighter">{selectedAlumni.nama}</h4><p className="text-indigo-300 text-[10px] font-bold mt-1 uppercase">NIM: {selectedAlumni.nim}</p></div>
                            <div className="bg-white/10 p-2 rounded-xl text-center border border-white/10 min-w-[60px]"><p className="text-[8px] font-black text-indigo-200 uppercase">Score</p><p className="text-sm font-black text-emerald-400">{selectedAlumni.confidence_score}%</p></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                        
                        {/* 1. AKADEMIK */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-900 uppercase flex items-center gap-2 border-b border-indigo-100 pb-1"><BookOpen size={12}/> Akademik</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input key={"prodi-"+selectedAlumni.prodi} className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.prodi} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'prodi', e.target.value)} placeholder="Prodi" />
                                <input key={"tahun-"+selectedAlumni.tahun} className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.tahun} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'tahun', e.target.value)} placeholder="Tahun Lulus" />
                            </div>
                        </div>

                        {/* 2. KONTAK & DOMISILI */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-900 uppercase flex items-center gap-2 border-b border-indigo-100 pb-1"><User size={12}/> Kontak & Domisili</label>
                            <input key={"hp-"+selectedAlumni.no_hp} className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.no_hp} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'no_hp', e.target.value)} placeholder="No Handphone / WA" />
                            <input key={"eml-"+selectedAlumni.email_alumni} type="email" className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.email_alumni} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'email_alumni', e.target.value)} placeholder="Email Aktif" />
                            <textarea key={"alm-"+selectedAlumni.alamat} className="w-full text-xs font-bold p-2 border rounded-lg h-12 resize-none outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.alamat} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'alamat', e.target.value)} placeholder="Alamat Domisili..." />
                        </div>

                        {/* 3. SOSMED PRIBADI */}
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                            <label className="text-[10px] font-black text-indigo-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-2 mb-2"><Smartphone size={12}/> Sosial Media Pribadi</label>
                            <SearchableInput label="LinkedIn" field="linkedin_url" placeholder="Link LinkedIn..." icon={<ExternalLink size={10}/>} searchContext={`${selectedAlumni.nama} LinkedIn`} />
                            <SearchableInput label="Instagram" field="instagram_url" placeholder="Link Instagram..." icon={<ExternalLink size={10}/>} searchContext={`${selectedAlumni.nama} Instagram`} />
                            <SearchableInput label="Facebook" field="facebook_url" placeholder="Link Facebook..." icon={<ExternalLink size={10}/>} searchContext={`${selectedAlumni.nama} Facebook`} />
                            <SearchableInput label="TikTok" field="tiktok_url" placeholder="Link TikTok..." icon={<ExternalLink size={10}/>} searchContext={`${selectedAlumni.nama} TikTok`} />
                        </div>

                        {/* 4. KARIR & INSTANSI */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-900 uppercase flex items-center gap-2 border-b border-indigo-100 pb-1"><Briefcase size={12}/> Karir & Tempat Bekerja</label>
                            <select key={"kat-"+selectedAlumni.jenis_instansi} className="w-full text-xs font-bold p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.jenis_instansi} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'kategori_kerja', e.target.value)}>
                                <option value="">Pilih Kategori Kerja...</option>
                                <option value="PNS">PNS / ASN</option>
                                <option value="Swasta">Swasta</option>
                                <option value="Wirausaha">Wirausaha / Founder</option>
                            </select>
                            <input key={"pek-"+selectedAlumni.pekerjaan} className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.pekerjaan} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'pekerjaan', e.target.value)} placeholder="Posisi / Jabatan" />
                            <input key={"inst-"+selectedAlumni.instansi} className="w-full text-xs font-bold p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.instansi} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'instansi', e.target.value)} placeholder="Nama Tempat Bekerja" />
                            <textarea key={"almbk-"+selectedAlumni.alamat} className="w-full text-xs font-bold p-2 border rounded-lg h-12 resize-none outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={selectedAlumni.alamat} onBlur={(e) => updateInformasiAlumni(selectedAlumni.id, 'alamat_bekerja', e.target.value)} placeholder="Alamat Tempat Bekerja..." />
                            <SearchableInput label="Sosmed Instansi" field="instansi_sosmed" placeholder="Link Sosmed Kantor..." icon={<Building size={10}/>} searchContext={`${selectedAlumni.instansi} social media`} />
                        </div>

                        {/* 5. AUDIT TRAIL */}
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2 mb-2"><History className="text-indigo-600" size={14} /> Audit Trail Perubahan</h5>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                {selectedAlumni.jejak_digital?.map((jejak, i) => (
                                    <div key={i} className={`p-3 rounded-xl border text-[13px] shadow-sm ${jejak.source.includes("SISTEM") ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                          <span className={`font-black uppercase px-1.5 py-0.5 rounded text-[7px] ${jejak.source.includes("SISTEM") ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'}`}>{jejak.source}</span>
                                          <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {new Date(jejak.ditambahkan_pada).toLocaleDateString()}</span>
                                        </div>
                                        <p className="font-bold text-slate-800">{jejak.title}</p>
                                        <p className="text-slate-500 mt-1 italic">{jejak.desc}</p>
                                    </div>
                                ))}
                                {(!selectedAlumni.jejak_digital || selectedAlumni.jejak_digital.length === 0) && <p className="text-[11px] text-slate-400 italic text-center py-2">Belum ada riwayat.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="h-[750px] border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white p-10 text-center shadow-sm">
                    <div className="bg-slate-50 p-6 rounded-full mb-4"><Edit2 size={48} className="text-indigo-300"/></div>
                    <p className="font-black text-sm uppercase tracking-widest text-slate-600">Mulai Validasi</p>
                    <p className="text-[11px] mt-2 max-w-[200px] leading-relaxed">Klik tombol <b>Validasi</b> pada baris tabel di samping untuk melengkapi ke-8 data wajib lulusan.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
