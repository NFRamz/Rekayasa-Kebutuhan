import { useState } from 'react';

export const useAppModel = () => {
  // Data Dummy Hardcode (Nanti diganti dengan fetch dari Supabase)
  const [alumniDB, setAlumniDB] = useState([
    { id: 1, nama: 'Budi Santoso', nim: '201910370311001', prodi: 'Informatika', tahun: '2023', pekerjaan: 'Software Engineer', instansi: 'PT GoTo', alamat: 'Kec. Lowokwaru, Kota Malang', lat: -7.950, lng: 112.610, status: 'Terverifikasi' },
    { id: 2, nama: 'Siti Aminah', nim: '201810370311045', prodi: 'Informatika', tahun: '2022', pekerjaan: 'Data Analyst', instansi: 'Bank Mandiri', alamat: 'Kec. Pakong, Kab. Pamekasan', lat: -7.054, lng: 113.568, status: 'Terverifikasi' },
    { id: 3, nama: 'Ahmad Faisal', nim: '202010370311099', prodi: 'Sistem Informasi', tahun: '2024', pekerjaan: 'UI/UX Designer', instansi: 'Ruangguru', alamat: 'Kec. Blimbing, Kota Malang', lat: -7.932, lng: 112.650, status: 'Terverifikasi' },
    { id: 4, nama: 'Dewi Lestari', nim: '201710370311012', prodi: 'Teknik Komputer', tahun: '2021', pekerjaan: 'Network Engineer', instansi: 'Telkom Indonesia', alamat: 'Kec. Gubeng, Kota Surabaya', lat: -7.280, lng: 112.750, status: 'Terverifikasi' },
    { id: 5, nama: 'Andi Pratama', nim: '202110370311005', prodi: 'Informatika', tahun: '2025', pekerjaan: 'Backend Developer', instansi: 'Traveloka', alamat: 'Kec. Klojen, Kota Malang', lat: -7.970, lng: 112.630, status: 'Menunggu Verifikasi' }
  ]);

  return { alumniDB, setAlumniDB };
};
