import React from 'react';
import { Search, Database, Globe } from 'lucide-react';
import { usePencarianController } from '../controllers/usePencarianController';

export default function PencarianView({ alumniDB = [] }) {
  const { queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, isSearching, internalResults, externalResults, executeSearch } = usePencarianController(alumniDB);

  const groupedExternal = externalResults.reduce((acc, item) => {
    if (!acc[item.source]) acc[item.source] = [];
    acc[item.source].push(item);
    return acc;
  }, {});

  return (
    // Memperlebar max-w menjadi 7xl agar 4 kolom tidak terlalu berdesakan
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Search className="text-blue-600" /> Pencarian Jejak Alumni</h2>
      
      <form onSubmit={executeSearch} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
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
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Database size={18} className="text-green-600" /> Database Internal</h3>
            {internalResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {internalResults.map(item => (
                  <div key={item.id} className="p-5 rounded-xl border border-green-100 border-l-4 border-l-green-500 bg-green-50/30 transition-all hover:shadow-sm">
                    <h4 className="font-bold text-lg text-gray-800 line-clamp-1" title={item.nama}>{item.nama}</h4>
                    <p className="text-sm text-gray-600 font-medium mt-1 line-clamp-1" title={`${item.prodi} - ${item.kampus}`}>{item.prodi} - <span className="text-gray-500">{item.kampus}</span></p>
                    <div className="mt-4 pt-3 border-t border-green-200/50">
                      <p className="text-xs text-gray-700 line-clamp-2"><strong>Pekerjaan:</strong> {item.pekerjaan} di {item.instansi}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (!isSearching && <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-sm border border-yellow-200">Data tidak ditemukan di database internal. Membaca sumber API publik...</div>)}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-600" /> Hasil Rekam Jejak API Publik</h3>
            
            {isSearching ? (
              <div className="text-center py-12 text-gray-400 animate-pulse bg-white rounded-xl border border-gray-100">Melacak PDDIKTI, GitHub, Google, & ORCID...</div>
            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                {Object.entries(groupedExternal).map(([source, items]) => (

                  <div key={source} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[400px]">
                    
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 shrink-0">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">{source}</span>
                      <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">{items.length} Ditemukan</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {items.map((item, idx) => (
                        <a key={idx} href={item.link !== '#' ? item.link : undefined} target="_blank" rel="noopener noreferrer" 
                           className={`flex gap-3 items-start p-2.5 rounded-xl border border-transparent transition-all ${item.link !== '#' ? 'hover:bg-blue-50 hover:border-blue-100 cursor-pointer' : 'bg-gray-50/50 cursor-default border-gray-100'}`}>
                          
                          <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm border border-blue-200/50">
                            {item.image ? (
                              <img src={item.image} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                              <span>{item.title.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-gray-800 truncate" title={item.title}>{item.title}</h4>
                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed" title={item.desc}>{item.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
