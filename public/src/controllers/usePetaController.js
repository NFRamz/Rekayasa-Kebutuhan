import { useState, useEffect } from 'react';

export const usePetaController = (alumniDB) => {
  const [aggregatedCities, setAggregatedCities] = useState([]);

  useEffect(() => {
    const verifiedAlumni = alumniDB.filter(a => a.status === 'Terverifikasi');
    const cityData = {};

    verifiedAlumni.forEach(alumni => {
      const parts = alumni.alamat.split(',');
      let kota = parts[parts.length - 1].trim();
      kota = kota.replace(/Kab\.|Kota/gi, '').trim();

      if (!cityData[kota]) {
        cityData[kota] = { nama: kota, jumlah: 0, lats: [], lngs: [] };
      }
      cityData[kota].jumlah += 1;
      if (alumni.lat) cityData[kota].lats.push(alumni.lat);
      if (alumni.lng) cityData[kota].lngs.push(alumni.lng);
    });

    const parsedData = Object.values(cityData).map(city => ({
      ...city,
      lat: city.lats.reduce((a, b) => a + b, 0) / city.lats.length || -7.5,
      lng: city.lngs.reduce((a, b) => a + b, 0) / city.lngs.length || 112.5
    }));

    setAggregatedCities(parsedData);
  }, [alumniDB]);

  const hitungPosisiPeta = (lat, lng) => {
    const x = ((lng - 111.0) / 4.0) * 100;
    const y = ((lat - (-6.5)) / (-2.5)) * 100; 
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`
    };
  };

  return { aggregatedCities, hitungPosisiPeta };
};
