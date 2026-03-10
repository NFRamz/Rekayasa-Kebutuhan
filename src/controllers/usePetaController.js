import { useState, useEffect } from 'react';

/**
 * Controller untuk mengelola state dan logika pemetaan sebaran alumni.
 * Menggunakan koordinat asli dari database untuk akurasi maksimal.
 */
export const usePetaController = (alumniDB = []) => {
  const [filterKampus, setFilterKampus] = useState('');
  const [aggregatedMapData, setAggregatedMapData] = useState([]);

  // Ambil daftar unik kampus untuk dropdown filter
  const availableCampuses = [...new Set(alumniDB
    .filter(a => a.status === 'Terverifikasi' && a.kampus)
    .map(a => a.kampus)
  )].sort();

  useEffect(() => {
    const isFilterAll = filterKampus.trim() === '' || filterKampus.toLowerCase() === 'semua';

    // 1. Filter alumni yang terverifikasi dan memiliki koordinat
    const filteredAlumni = alumniDB.filter(a => {
      const isVerified = a.status === 'Terverifikasi';
      const hasCoords = a.lat !== undefined && a.lng !== undefined && a.lat !== null;
      const matchesKampus = isFilterAll || a.kampus.toLowerCase().includes(filterKampus.toLowerCase());
      return isVerified && hasCoords && matchesKampus;
    });

    // 2. Agregasi data berdasarkan lokasi (Kota)
    // Kita gunakan kombinasi Lat & Lng sebagai kunci agar pin bertumpuk di titik yang sama jika koordinatnya identik
    const locationGroups = {};

    filteredAlumni.forEach(alumni => {
      // Ekstrak nama kota untuk tampilan label
      const parts = alumni.alamat.split(',');
      let cityName = parts[parts.length - 1].trim();
      cityName = cityName.replace(/(kota|kabupaten|kab\.)/g, '').trim();
      
      // Gunakan string koordinat sebagai ID unik grup agar akurasi 100% sesuai DB
      const geoKey = `${alumni.lat},${alumni.lng}`;

      if (!locationGroups[geoKey]) {
        locationGroups[geoKey] = {
          nama: cityName,
          jumlah: 0,
          lat: alumni.lat,
          lng: alumni.lng,
          alumniList: [] // Opsional: untuk detail saat diklik
        };
      }
      locationGroups[geoKey].jumlah += 1;
      locationGroups[geoKey].alumniList.push(alumni.nama);
    });

    setAggregatedMapData(Object.values(locationGroups));
  }, [alumniDB, filterKampus]);

  return { filterKampus, setFilterKampus, aggregatedMapData, availableCampuses };
};
