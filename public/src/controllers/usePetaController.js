import { useState, useEffect } from 'react';

export const usePetaController = (alumniDB) => {
  const [filterKampus, setFilterKampus] = useState('Universitas Muhammadiyah Malang');
  const [aggregatedMapData, setAggregatedMapData] = useState([]);

  const geocodeDB = {
    'malang': { lat: -7.98, lng: 112.63 },
    'pamekasan': { lat: -7.16, lng: 113.48 },
    'surabaya': { lat: -7.25, lng: 112.75 },
    'jakarta': { lat: -6.20, lng: 106.81 }
  };

  useEffect(() => {
    const verifiedAlumni = alumniDB.filter(a => a.status === 'Terverifikasi' && a.kampus.toLowerCase().includes(filterKampus.toLowerCase()));
    const cityCount = {};

    verifiedAlumni.forEach(alumni => {
      const parts = alumni.alamat.split(',');
      let extractedCity = parts[parts.length - 1].trim().toLowerCase();
      extractedCity = extractedCity.replace(/(kota|kabupaten|kab\.)/g, '').trim();

      if (!cityCount[extractedCity]) {
        cityCount[extractedCity] = { nama: extractedCity, jumlah: 0 };
      }
      cityCount[extractedCity].jumlah += 1;
    });

    const mapData = Object.values(cityCount).map(city => {
      const coords = geocodeDB[city.nama] || { lat: -7.5 + (Math.random()), lng: 112.5 + (Math.random()) };
      return { ...city, lat: coords.lat, lng: coords.lng };
    });

    setAggregatedMapData(mapData);
  }, [alumniDB, filterKampus]);

  const hitungPosisiPeta = (lat, lng) => {
    const x = ((lng - 111.0) / 4.0) * 100;
    const y = ((lat - (-6.5)) / (-2.5)) * 100; 
    return { left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` };
  };

  return { filterKampus, setFilterKampus, aggregatedMapData, hitungPosisiPeta };
};
