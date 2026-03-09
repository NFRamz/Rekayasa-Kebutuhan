import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { usePendataanController } from '../controllers/usePendataanController';

export default function PendataanView({ alumniDB, setAlumniDB }) {
  const { formData, handleInputChange, submitData, success } = usePendataanController(alumniDB, setAlumniDB);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" /> Form Pendataan Mandiri
      </h2>
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2"><CheckCircle size={20} /> Berhasil dikirim.</div>}
      <form onSubmit={submitData} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nama} onChange={e => handleInputChange('nama', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">NIM</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nim} onChange={e => handleInputChange('nim', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun Lulus</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.tahun} onChange={e => handleInputChange('tahun', e.target.value)} /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.prodi} onChange={e => handleInputChange('prodi', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan/Jabatan</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.pekerjaan} onChange={e => handleInputChange('pekerjaan', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Instansi/Perusahaan</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.instansi} onChange={e => handleInputChange('instansi', e.target.value)} /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label><textarea required rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.alamat} onChange={e => handleInputChange('alamat', e.target.value)}></textarea></div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-4">Kirim Data</button>
      </form>
    </div>
  );
}
