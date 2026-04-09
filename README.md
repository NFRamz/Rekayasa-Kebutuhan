## Nama : Naufal Ramzi
## NIM  : 202310370311026
## Kelas: Rekayasa Kebutuhan D

# Sistem Pelacakan dan Pemetaan Alumni

Aplikasi web interaktif untuk melakukan pendataan mandiri, pelacakan jejak digital dari berbagai sumber (Internal DB, PDDIKTI, GitHub, Google, ORCID), serta visualisasi pemetaan sebaran domisili alumni.

Proyek ini dibangun menggunakan:
- React.js
- Tailwind CSS
- Leaflet Maps
- Supabase

---

## 🔗 Tautan Website

Live Website :  
https://dailyproject3-bice.vercel.app/

---

# 1. Penjelasan Modul Utama (Fase Sistem)

Sistem ini dirancang berdasarkan tiga alur kerja (fase) utama:

## Fase A (Pendataan & Verifikasi)

Modul untuk menghimpun data alumni secara mandiri yang dilengkapi fitur pencarian otomatis (Smart Geocoding) dan sistem antrean verifikasi oleh Admin untuk menjamin keabsahan data.

## Fase B (Pencarian Interaktif)

Modul pelacakan jejak digital on-demand. Memungkinkan pengguna melacak profil alumni di database internal sekaligus melakukan pencarian paralel ke sumber data publik:

- PDDIKTI
- GitHub
- Google
- ORCID

## Fase C (Pemetaan Sebaran)

Modul visualisasi geografis interaktif yang mengekstrak data alamat alumni menjadi titik koordinat (latitude/longitude) dan menampilkannya sebagai pin marker pada peta.

---

# 2. Tabel Pengujian Kualitas Sistem


Pengujian ini diverifikasi berdasarkan fungsionalitas terbaru sistem yang mencakup pengelolaan **Big Data (142.000+ data)**, **Automated Tracking**, dan **Audit Trail**.

| No | Modul / Fase | Aspek Kualitas (ISO 25010) | Skenario Pengujian (Test Case) | Hasil yang Diharapkan (Expected Result) | Hasil Aktual (Actual Result) | Status |
|----|--------------|-----------------------------|--------------------------------|-----------------------------------------|--------------------------------|-------|
| 1 | **Fase B (Pelacakan)** | Functional Suitability | Mengaktifkan fitur **"Robot Auto-Track"** pada data alumni yang belum terlacak. | Sistem melacak secara otomatis ke API PDDIKTI & LinkedIn,orcid,github dan meningkatkan *Confidence Score*. | Robot berhasil melacak data secara beruntun dan menaikkan skor validasi otomatis (misal: +40%). | ✅ Lulus |
| 2 | **Fase B (Pencarian)** | Functional Suitability | Melakukan pencarian menggunakan **NIM atau Nama** pada kolom pencarian global. | Sistem melakukan kueri ke seluruh data didatabase dengan mekanisme *pagination bypass*. | Data ditemukan dengan akurat meskipun alumni berada pada urutan data ke-100.000+. | ✅ Lulus |
| 3 | **Fase B (Validasi)** | Reliability | Admin mengubah data karir atau menautkan jejak digital ke profil alumni. | Sistem menyimpan perubahan dan mencatat riwayatnya secara otomatis di kolom **Audit Trail**. | Data pekerjaan ter-update dan log perubahan muncul di panel riwayat lengkap dengan *timestamp*. | ✅ Lulus |
| 4 | **Fase D (Ekspor)** | Performance Efficiency | Melakukan ekspor data ke Excel. | Sistem mengambil data per 1.000 baris secara bertahap agar browser tidak *freeze* atau *crash*. | Tombol menunjukkan progres `count/total` dan file `.xlsx` berhasil diunduh secara lokal. | ✅ Lulus |
| 5 | **Fase B (Pencarian)** | Performance Efficiency | Menjalankan pelacakan paralel ke 4 sumber API eksternal (LinkedIn, GitHub, PDDIKTI, ORCID). | *Parallel fetching* berjalan tanpa mengganggu responsivitas UI selama proses *request* berlangsung. | Hasil dari 4 API muncul secara serentak di kolom masing-masing setelah permintaan terpenuhi. | ✅ Lulus |
| 6 | **Fase C (Pemetaan)** | Functional Suitability | Memfilter sebaran alumni berdasarkan **kampus** | Peta merender ulang titik koordinat hanya untuk alumni yang sesuai dengan kategori terpilih. | Pin pada peta menyaring data secara *real-time*; titik yang tidak sesuai kategori disembunyikan. | ✅ Lulus |
| 7 | **Dashboard Stats** | Functional Suitability | Memeriksa akurasi angka pada **Card Statistik** Utama (Terlacak, Verifikasi, Antrean). | Angka statistik global diperbarui secara otomatis berdasarkan total baris riil di database. | Card statistik menampilkan jumlah riil dari seluruh database (142.000+) secara instan. | ✅ Lulus |
| 8 | **Keseluruhan** | Usability | Mengakses aplikasi dan melakukan validasi melalui perangkat layar kecil (Smartphone). | Antarmuka menyesuaikan ukuran (Responsive), panel validator berpindah ke posisi bawah (*stacking*). | UI tetap rapi, navigasi mudah digunakan, dan tidak ada elemen yang tumpang tindih. | ✅ Lulus |
| 9 | **Fase A (Integrasi)** | Reliability | Mengimpor data alumni masif melalui fitur **Excel Import (Bulk Insert)**. | Sistem memecah file menjadi paket kecil (*chunks*) untuk mencegah *database timeout*. | Ribuan data berhasil masuk ke database dengan indikator progres yang akurat. | ✅ Lulus |

---

# 🧠 Logika Sistem (Pseudocode)

### 1. Fase B: Pelacakan & Validasi Terintegrasi
* **Algoritma Confidence Score:**
  ```text
  IF data_tertaut(LinkedIn) THEN Score += 40
  IF data_tertaut(PDDIKTI) THEN Score += 30
  IF verifikasi_manual(Admin) THEN Score += 30
  MAX_SCORE = 100
