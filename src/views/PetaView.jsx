import React from 'react';
import { MapPin, Filter } from 'lucide-react';
import { usePetaController } from '../controllers/usePetaController';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix bug bawaan dari react-leaflet untuk icon marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png)',
  iconUrl: '[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png)',
  shadowUrl: '[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png)',
});

export default function PetaView({ alumniDB }) {
  const { filterKampus, setFilterKampus, aggregatedMapData } = usePetaController(alumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="text-red-500" /> Peta Sebaran Alumni</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <Filter className="text-gray-400" />
        <input type="text" placeholder="Filter Afiliasi Kampus (Misal: UMM)" className="flex-1 border-none focus:ring-0 outline-none text-gray-700 font-medium" value={filterKampus} onChange={(e) => setFilterKampus(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="h-[450px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-inner z-0">
          <MapContainer center={[-7.5, 112.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {aggregatedMapData.map((city, idx) => (
              <Marker key={idx} position={[city.lat, city.lng]}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-blue-700 capitalize text-base">{city.nama}</strong><br />
                    <span className="text-gray-600 font-medium">Jumlah Alumni: {city.jumlah}</span>
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
