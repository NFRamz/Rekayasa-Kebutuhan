import React from 'react';
import { Search, Database, Globe } from 'lucide-react';\

export default function PencarianView({ alumniDB = [] }) {
  const { queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, isSearching, internalResults, externalResults, executeSearch } = usePencarianController(alumniDB);

  // Memaksa 4 kategori API eksternal agar selalu muncul kotaknya meskipun kosong (0 Ditemukan)
  const groupedExternal = {
    'PDDIKTI': [],
    'GitHub': [],
    'Google Web': [],
    'ORCID': []
  };

  externalResults.forEach(item => {
    if (groupedExternal[item.source]) {
      groupedExternal[item.source].push(item);
    }
  });

  return (
    // Memperlebar container (max-w-[1400px]) agar 5 kolom memiliki ruang yang cukup
    <div className="max-w-[1400px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Search className="text-blue-600" /> Pencarian Jejak Alumni</h2>
      
      <form onSubmit={executeSearch} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-5xl">
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
        <button type="submit" disabled={isSearching} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex justify-center gap-2 transition-colors">
          {isSearching ? <span className="animate-pulse">Menyiapkan Kueri & Melacak Paralel...</span> : 'Lacak Jejak Publik & Internal'}
        </button>
      </form>

      {(internalResults.length > 0 || externalResults.length > 0 || isSearching) && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
            <Globe size={20} className="text-blue-600" /> Hasil Penelusuran Integrasi Terpusat
          </div>

          {isSearching ? (
             <div className="text-center py-12 text-gray-400 animate-pulse bg-white rounded-xl border border-gray-100">Melacak Database Internal, PDDIKTI, GitHub, Google, & ORCID secara simultan...</div>
          ) : (
            // Grid utama untuk 5 Kolom: 1 Internal + 4 Eksternal (xl:grid-cols-5)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
              
              {/* KOLOM 1: DATABASE INTERNAL */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex flex-col h-[400px]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 shrink-0">
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-green-100 flex items-center gap-1">
                    <Database size={12} /> Internal DB
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">{internalResults.length} Ditemukan</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {internalResults.length > 0 ? internalResults.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl border border-green-100 bg-green-50/40 transition-all hover:shadow-sm">
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-1" title={item.nama}>{item.nama}</h4>
                      <p className="text-[10px] text-gray-600 font-medium mt-1 line-clamp-2" title={`${item.prodi} - ${item.kampus}`}>{item.prodi} - <span className="text-gray-500">{item.kampus}</span></p>
                      <div className="mt-2 pt-2 border-t border-green-200/50">
                        <p className="text-[10px] text-gray-700 line-clamp-2" title={`${item.pekerjaan} di ${item.instansi}`}><strong>Kerja:</strong> {item.pekerjaan} di {item.instansi}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[11px] text-gray-400 text-center mt-6 px-2">Data tidak ditemukan di database internal.</p>
                  )}
                </div>
              </div>

              {/* KOLOM 2 SAMPAI 5: SUMBER API EKSTERNAL */}
              {Object.entries(groupedExternal).map(([source, items]) => (
                <div key={source} className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col h-[400px]">
                  
                  {/* Header Kotak Sumber API */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 shrink-0">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">{source}</span>
                    <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">{items.length} Ditemukan</span>
                  </div>
                  
                  {/* List Hasil (Area dengan Scroll Internal) */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {items.length > 0 ? items.map((item, idx) => (
                      <a key={idx} href={item.link !== '#' ? item.link : undefined} target="_blank" rel="noopener noreferrer" 
                         className={`flex gap-3 items-start p-2.5 rounded-xl border border-transparent transition-all ${item.link !== '#' ? 'hover:bg-blue-50 hover:border-blue-100 cursor-pointer shadow-sm' : 'bg-gray-50/50 cursor-default border-gray-100'}`}>
                        
                        {/* Gambar / Inisial Avatar */}
                        <div className="w-8 h-8 rounded-full shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-[10px] overflow-hidden shadow-sm border border-blue-200/50">
                          {item.image ? (
                            <img src={item.image} alt="Profil" className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.title.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        
                        {/* Teks Deskripsi */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[11px] text-gray-800 truncate" title={item.title}>{item.title}</h4>
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed" title={item.desc}>{item.desc}</p>
                        </div>
                      </a>
                    )) : (
                      <p className="text-[11px] text-gray-400 text-center mt-6 px-2">Tidak ada kecocokan jejak digital di platform ini.</p>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}
    </div>
  );
}
