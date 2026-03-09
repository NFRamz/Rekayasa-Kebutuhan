import React from 'react';
import { MapPin, Globe, Filter } from 'lucide-react';
import { usePetaController } from '../controllers/usePetaController';

export default function PetaView({ alumniDB }) {
  const { filterKampus, setFilterKampus, aggregatedMapData, hitungPosisiPeta } = usePetaController(alumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="text-red-500" /> Peta Sebaran Alumni</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <Filter className="text-gray-400" />
        <input type="text" placeholder="Filter Afiliasi Kampus (Misal: UMM)" className="flex-1 border-none focus:ring-0 outline-none text-gray-700 font-medium" value={filterKampus} onChange={(e) => setFilterKampus(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative h-[450px] w-full rounded-lg overflow-hidden border border-blue-200 shadow-inner bg-blue-50/50">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-md text-xs font-bold text-blue-800 shadow-sm z-10">Peta Geocoding: Area Jawa Timur</div>
          
          {aggregatedMapData.map((city, idx) => {
            const pos = hitungPosisiPeta(city.lat, city.lng);
            return (
              <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center group" style={pos}>
                <MapPin className="text-red-600 drop-shadow-md group-hover:scale-110 transition-transform" size={42} fill="#fee2e2" />
                <div className="mt-1 bg-white/95 text-blue-900 font-bold text-xs pl-2 pr-1 py-1 rounded-full shadow-md border border-blue-200 flex items-center gap-1.5 capitalize">
                  <span>{city.nama}</span>
                  <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] leading-none">{city.jumlah}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
