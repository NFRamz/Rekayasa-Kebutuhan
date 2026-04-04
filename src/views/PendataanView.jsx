import React, { useState } from 'react';
import { FileText, CheckCircle, Loader, MapPin, Search, Smartphone, Globe, Briefcase } from 'lucide-react';
import { usePendataanController } from '../controllers/usePendataanController';

export default function PendataanView({ alumniDB, setAlumniDB }) {
  const { 
    formData, setFormData, submitData, success, isSubmitting,
    locQuery, setLocQuery, suggestions, isSearchingLoc, showDropdown, setShowDropdown, handleSelectLocation
  } = usePendataanController(alumniDB, setAlumniDB);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"><FileText className="text-blue-600" /> Form Pendataan Alumni Lengkap</h2>
      <p className="text-sm text-gray-500 mb-6">Semua data adalah untuk kepentingan pembelajaran, dilarang menyebarkan untuk kepentingan apapun.</p>
      
      {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2 shadow-sm"><CheckCircle size={20} /> Data berhasil dikirim ke antrean admin untuk verifikasi!</div>}
      
      <form onSubmit={submitData} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
        
        {/* BAGIAN 1: IDENTITAS */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-gray-800">1. Identitas & Akademik</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Sesuai Excel</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">NIM / ID Alumni</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.prodi} onChange={e => setFormData({...formData, prodi: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun Lulus</label><input required type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} disabled={isSubmitting} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Kampus Afiliasi</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={formData.kampus} onChange={e => setFormData({...formData, kampus: e.target.value})} disabled={isSubmitting} /></div>
          </div>
        </div>

        {/* BAGIAN 2: KONTAK & SOSMED */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-gray-800 flex items-center gap-2"><Smartphone size={18}/> 2. Kontak & Media Sosial Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label><input required type="email" placeholder="contoh@gmail.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">No HP / WhatsApp</label><input required type="tel" placeholder="0812xxxx" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label><input type="url" placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram (Username)</label><input type="text" placeholder="@username" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.ig} onChange={e => setFormData({...formData, ig: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook (Nama Akun)</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.fb} onChange={e => setFormData({...formData, fb: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">TikTok (Username)</label><input type="text" placeholder="@username" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.tiktok} onChange={e => setFormData({...formData, tiktok: e.target.value})} disabled={isSubmitting} /></div>
          </div>
        </div>

        {/* BAGIAN 3: PEKERJAAN */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-gray-800 flex items-center gap-2"><Briefcase size={18}/> 3. Informasi Karir & Pekerjaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pekerjaan Utama</label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" value={formData.jenisPekerjaan} onChange={e => setFormData({...formData, jenisPekerjaan: e.target.value})} disabled={isSubmitting}>
                <option value="">-- Pilih Status Pekerjaan --</option>
                <option value="PNS">PNS / ASN / TNI / POLRI</option>
                <option value="Swasta">Pegawai Swasta / BUMN</option>
                <option value="Wirausaha">Wirausaha / Pemilik Usaha</option>
                <option value="Lainnya">Lainnya / Freelance / Studi</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tempat Bekerja / Nama Usaha</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.tempatBekerja} onChange={e => setFormData({...formData, tempatBekerja: e.target.value})} disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Posisi / Jabatan</label><input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.posisi} onChange={e => setFormData({...formData, posisi: e.target.value})} disabled={isSubmitting} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Bekerja / Kantor</label><textarea required rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none" value={formData.alamatBekerja} onChange={e => setFormData({...formData, alamatBekerja: e.target.value})} disabled={isSubmitting} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Sosial Media Tempat Bekerja (Web/IG/FB)</label><input type="text" placeholder="Misal: www.perusahaan.com atau @ig_perusahaan" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.sosmedBekerja} onChange={e => setFormData({...formData, sosmedBekerja: e.target.value})} disabled={isSubmitting} /></div>
          </div>
        </div>
        
        {/* BAGIAN SMART AUTOCOMPLETE ALAMAT (UNTUK PETA) */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center gap-2">
            <MapPin size={16} className="text-red-500" /> Koordinat Sebaran Alumni (Wajib untuk fitur Peta)
          </label>
          <p className="text-xs text-gray-500 mb-3">Ketik nama Kecamatan atau Kota domisili Anda, lalu <strong>klik hasil yang muncul</strong> di bawahnya.</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isSearchingLoc ? <Loader className="animate-spin text-blue-500" size={16} /> : <Search className="text-gray-400" size={16} />}
            </div>
            
            <input 
              required 
              type="text" 
              placeholder="Mulai ketik... (Cth: Pakong, Pamekasan)" 
              className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${showDropdown && suggestions.length > 0 ? 'rounded-t-md border-b-0' : 'rounded-md'}`}
              value={locQuery} 
              onChange={e => {
                setLocQuery(e.target.value);
                if (formData.lat || formData.lng) {
                  setFormData({...formData, alamat: '', lat: null, lng: null});
                }
              }} 
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
              disabled={isSubmitting}
            />

            {/* Area Dropdown Rekomendasi */}
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((loc, idx) => {
                  const shortName = loc.display_name.split(',')[0].replace(/^(Kecamatan|Kec\.|Kabupaten|Kab\.|Kota)\s+/i, '').trim();
                  return (
                    <li 
                      key={idx} 
                      className="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col"
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <span className="text-sm font-bold text-gray-800 line-clamp-1">{shortName}</span>
                      <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{loc.display_name}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          
          <div className="mt-2">
            {formData.lat ? (
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> Koordinat Terkunci
              </span>
            ) : (
              <span className="text-xs text-orange-500 italic">
                * Anda belum memilih lokasi dari daftar saran.
              </span>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !formData.lat} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? <><Loader className="animate-spin" size={18} /> Menyimpan Data...</> : 'Kirim Data Pendataan'}
        </button>
      </form>
    </div>
  );
}