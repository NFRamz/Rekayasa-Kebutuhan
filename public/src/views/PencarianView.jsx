import React from 'react';
import { Search, Database, Globe } from 'lucide-react';
import { usePencarianController } from '../controllers/usePencarianController';

export default function PencarianView({ alumniDB }) {
  const { query, setQuery, isSearching, internalResults, externalResults, executeSearch } = usePencarianController(alumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Search className="text-blue-600" /> Pelacakan Jejak Alumni
      </h2>
      
      <form onSubmit={executeSearch} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Masukkan Nama Alumni atau Prodi..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex justify-center gap-2">
            {isSearching ? <span className="animate-pulse">Melacak...</span> : 'Cari Jejak'}
          </button>
        </div>
      </form>

      {(internalResults.length > 0 || externalResults.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Database size={18} className="text-green-600" /> Database Internal</h3>
            {internalResults.length > 0 ? (
              internalResults.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-green-100 mb-4 border-l-4 border-l-green-500">
                  <h4 className="font-bold text-lg">{item.nama}</h4>
                  <p className="text-sm text-gray-600">{item.prodi} ({item.tahun})</p>
                  <p className="mt-3 text-sm"><strong>Pekerjaan:</strong> {item.pekerjaan} di {item.instansi}</p>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-sm border border-yellow-200">Data tidak ditemukan di database internal. Melakukan bypass ke pencarian publik...</div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-600" /> Hasil API Publik</h3>
            {externalResults.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 mb-4">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{item.source}</div>
                <h4 className="font-bold text-md text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
