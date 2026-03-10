import React from 'react';
import { MapPin, Filter } from 'lucide-react';
import { usePetaController } from '../controllers/usePetaController';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fungsi untuk membuat Custom HTML Marker (Desain Pin + Angka)
const createCustomIcon = (city) => {
  return L.divIcon({
    className: 'custom-pin-container',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -100%);">
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md group-hover:scale-110 transition-transform">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <div class="mt-1 bg-white/95 text-blue-900 font-bold text-xs pl-2 pr-1 py-1 rounded-full shadow-md border border-blue-200 flex items-center gap-1.5 whitespace-nowrap">
          <span>${city.nama}</span>
          <span class="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] leading-none">
            ${city.jumlah}
          </span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0], 
    popupAnchor: [0, -45] 
  });
};

// PASTIKAN BARIS INI ADA: "export default function"
export default function PetaView({ alumniDB }) {
  // Mengambil state dan variabel dari Controller di Canvas
  const { filterKampus, setFilterKampus, aggregatedMapData, availableCampuses } = usePetaController(alumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="text-red-500" /> Peta Sebaran Alumni</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <Filter className="text-gray-400" />
        
        {/* Implementasi Dropdown Select */}
        <select 
          className="flex-1 border-none focus:ring-0 outline-none text-gray-700 font-medium cursor-pointer bg-transparent" 
          value={filterKampus} 
          onChange={(e) => setFilterKampus(e.target.value)} 
        >
          <option value="">Lihat Semua Kampus</option>
          {availableCampuses && availableCampuses.map((kampus, idx) => (
            <option key={idx} value={kampus}>{kampus}</option>
          ))}
        </select>

      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="h-[450px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-inner z-0 relative">
          
          <style>{`
            .custom-pin-container { background: transparent; border: none; }
          `}</style>

          <MapContainer center={[-7.5, 112.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {aggregatedMapData && aggregatedMapData.map((city, idx) => (
              <Marker 
                key={idx} 
                position={[city.lat, city.lng]}
                icon={createCustomIcon(city)}
              >
                <Popup>
                  <div className="text-center min-w-[120px]">
                    <strong className="text-blue-700 capitalize text-base">{city.nama}</strong><br />
                    <span className="text-gray-600 font-medium text-sm">Total Alumni: <span className="font-bold text-red-600">{city.jumlah}</span></span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
