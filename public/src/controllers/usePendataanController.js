import { useState } from 'react';

export const usePendataanController = (alumniDB, setAlumniDB) => {
  const [formData, setFormData] = useState({ nama: '', nim: '', prodi: '', tahun: '', pekerjaan: '', instansi: '', alamat: '' });
  const [success, setSuccess] = useState(false);

  const submitData = (e) => {
    e.preventDefault();
    const newAlumni = {
      ...formData,
      id: Date.now(),
      lat: -7.5 + (Math.random() * 1.5 - 0.75),
      lng: 112.5 + (Math.random() * 2 - 1),
      status: 'Menunggu Verifikasi'
    };
    setAlumniDB([...alumniDB, newAlumni]);
    setSuccess(true);
    setFormData({ nama: '', nim: '', prodi: '', tahun: '', pekerjaan: '', instansi: '', alamat: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return { formData, handleInputChange, submitData, success };
};
