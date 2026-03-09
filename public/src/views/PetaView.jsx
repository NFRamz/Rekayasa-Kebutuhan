import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { usePetaController } from '../controllers/usePetaController';

export default function PetaView({ alumniDB }) {
  const { aggregatedCities, hitungPosisiPeta } = usePetaController(alumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-red-500" /> Peta Sebaran Wilayah
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative h-[450px] w-full rounded-lg overflow-hidden border border-blue-200 shadow-inner bg-blue-50/50">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"><Globe size={300} /></div>
          
          {aggregatedCities.map((city, idx) => {
            const pos = hitungPosisiPeta(city.lat, city.lng);
            return (
              <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center group cursor-default" style={pos}>
                <MapPin className="text-red-600 drop-shadow-md group-hover:scale-110 transition-transform" size={42} fill="#fee2e2" />
                <div className="mt-1 bg-white/95 text-blue-900 font-bold text-xs pl-2 pr-1 py-1 rounded-full shadow-md border border-blue-200 flex items-center gap-1.5 whitespace-nowrap">
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
