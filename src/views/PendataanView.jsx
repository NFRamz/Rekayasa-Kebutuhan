import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { usePendataanController } from '../controllers/usePendataanController';

export default function PendataanView({ alumniDB, setAlumniDB }) {
  const { formData, setFormData, submitData, success } = usePendataanController(alumniDB, setAlumniDB);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"><FileText className="text-blue-600" /> Form Pendataan (Simulasi Google Form)</h2>
      <p className="text-sm text-gray-500 mb-6">Fase A: Alumni mengisi data diri untuk dimasukkan ke tabel sementara.</p>
      
      {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2"><CheckCircle size={20} /> Data masuk antrean verifikasi Admin.</div>}
      
      <form onSubmit={submitData} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">NIM / KTP</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun Lulus</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.prodi} onChange={e => setFormData({...formData, prodi: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Kampus Afiliasi</label><input required type="text" placeholder="Misal: UMM" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.kampus} onChange={e => setFormData({...formData, kampus: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan/Jabatan</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Instansi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili (Format: Kec, Kab, Kota)</label><textarea required rows="2" placeholder="Contoh: Kec. Pakong, Kab. Pamekasan" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})}></textarea></div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-4">Kirim Pendataan</button>
      </form>
    </div>
  );
}
