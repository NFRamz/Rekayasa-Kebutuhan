import { useState, useEffect } from 'react';

/**
 * Controller untuk mengelola state dan logika pemetaan sebaran alumni.
 * Menangani filter afiliasi dan agregasi data spasial.
 */
export const usePetaController = (alumniDB) => {
  const [filterKampus, setFilterKampus] = useState('');
  const [aggregatedMapData, setAggregatedMapData] = useState([]);

  const availableCampuses = [...new Set(alumniDB
    .filter(a => a.status === 'Terverifikasi' && a.kampus)
    .map(a => a.kampus)
  )];

  const geocodeDB = {
    'malang': { lat: -7.98, lng: 112.63 },
    'pamekasan': { lat: -7.16, lng: 113.48 },
    'surabaya': { lat: -7.25, lng: 112.75 },
    'jakarta': { lat: -6.20, lng: 106.81 },
    'yogyakarta': { lat: -7.79, lng: 110.36 }
  };

  /**
   * Mengekstrak kota dari string alamat, melakukan grouping jumlah alumni per kota,
   * dan memetakan nama kota ke titik koordinat (mock geocoding).
   */
  useEffect(() => {
    const isFilterAll = filterKampus.trim() === '' || filterKampus.toLowerCase() === 'semua';

    const verifiedAlumni = alumniDB.filter(a => {
      if (a.status !== 'Terverifikasi') return false;
      if (isFilterAll) return true;
      return a.kampus.toLowerCase().includes(filterKampus.toLowerCase());
    });

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

  return { filterKampus, setFilterKampus, aggregatedMapData, availableCampuses };
};
