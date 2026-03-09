import React from 'react';
import { Search, Database, Globe, ExternalLink } from 'lucide-react';
import { usePencarianController } from '../controllers/usePencarianController';

export default function PencarianView({ alumniDB }) {
  const { queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, isSearching, internalResults, externalResults, executeSearch } = usePencarianController(alumniDB);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Database size={18} className="text-green-600" /> Database Internal</h3>
            {internalResults.length > 0 ? (
              internalResults.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-green-100 mb-4 border-l-4 border-l-green-500">
                  <h4 className="font-bold text-lg">{item.nama}</h4>
                  <p className="text-sm text-gray-600">{item.prodi} - {item.kampus}</p>
                  <p className="mt-3 text-sm"><strong>Pekerjaan:</strong> {item.pekerjaan} di {item.instansi}</p>
                  <p className="text-sm"><strong>Domisili:</strong> {item.alamat}</p>
                </div>
              ))
            ) : (!isSearching && <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-sm border border-yellow-200">Data tidak ditemukan di database internal. Membypass ke sumber publik...</div>)}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-600" /> Hasil API Publik</h3>
            {isSearching ? <div className="text-center py-10 text-gray-400 animate-pulse">Memuat PDDIKTI, GitHub, Google, & ORCID...</div> : 
              externalResults.map((item, idx) => (
                <a key={idx} href={item.link !== '#' ? item.link : undefined} target="_blank" rel="noopener noreferrer" className={`block bg-white p-4 rounded-xl shadow-sm border border-blue-100 mb-4 transition-all ${item.link !== '#' ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}`}>
                  <div className="flex gap-4 items-start">
                    {item.image && <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden"><img src={item.image} alt="Profil" className="w-full h-full object-cover" /></div>}
                    <div>
                      <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded uppercase">{item.source}</span>
                      <h4 className="font-bold text-md text-gray-800 mt-1 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                </a>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
