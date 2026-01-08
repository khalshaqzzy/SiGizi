# UAS II3160 Teknologi Sistem Terintegrasi (TST) - SiGizi

## Identitas
<p align="left">
  <img src="assets/Khalfani-Shaquille_Photograph.jpg" alt="M Khalfani Shaquille" width="200" />
</p>

*   **Nama:** M Khalfani Shaquille
*   **NIM:** 18223104
*   **Program Studi:** Sistem dan Teknologi Informasi

---

## 1. Deskripsi Aplikasi SiGizi

**SiGizi** adalah platform sistem terintegrasi yang dirancang untuk mempercepat penanganan stunting pada balita di Indonesia. Sistem ini menghubungkan dua domain operasional utama yang sebelumnya terfragmentasi: unit **Kesehatan** (Posyandu) dan unit **Logistik** (Gudang Bantuan). 

Tujuan utama dari sistem ini adalah menciptakan rantai pasok intervensi gizi yang *real-time* dan otomatis. Segera setelah kader Posyandu mencatat pengukuran anak yang masuk dalam kategori "Zona Merah" (stunting berat), sistem akan secara otomatis memicu permintaan bantuan ke gudang logistik terdekat. Hal ini memotong jalur birokrasi manual yang panjang dan memastikan bantuan pangan tambahan sampai ke tangan keluarga yang membutuhkan dalam waktu sesingkat mungkin.

### Peran Layanan Logistik (Fokus Implementasi)
Dalam proyek ini, saya bertanggung jawab atas perancangan dan implementasi **Layanan Mikro Logistik** dan **Client-Logistik**. Layanan ini bertindak sebagai pusat kendali distribusi yang menangani:
*   **Manajemen Inventaris:** Pemantauan stok bantuan gizi (susu, vitamin, biskuit PMT) dengan sistem peringatan dini stok rendah.
*   **Penugasan Driver Otomatis:** Algoritma cerdas yang memilih armada pengiriman berdasarkan ketersediaan dan jarak tempuh.
*   **Optimasi Geospasial:** Integrasi dengan Google Maps untuk kalkulasi rute tercepat dan pemetaan otomatis Posyandu ke Hub penyuplai terdekat.
*   **Closed-loop Tracking:** Visibilitas status pengiriman dua arah dari gudang hingga konfirmasi penerimaan di lokasi tujuan.

## 2. Arsitektur dan Teknologi Sistem

Sistem SiGizi menggunakan arsitektur **Microservices** berbasis domain (*Domain-Driven Design*) untuk memastikan isolasi logika bisnis dan kemudahan pengembangan.

### Backend (Microservices)
*   **Node.js & Express:** Runtime dan framework utama untuk performa I/O yang efisien.
*   **TypeScript:** Menjamin keamanan tipe data (*type-safety*) dalam komunikasi antar layanan.
*   **MongoDB (Mongoose):** Database NoSQL yang digunakan untuk fleksibilitas penyimpanan data logistik dan geospasial.
*   **JWT (JSON Web Token):** Standar keamanan untuk otentikasi admin dan pengamanan endpoint API.

### Frontend (Clients)
*   **Next.js (App Router):** Framework React untuk aplikasi web yang cepat dan SEO-friendly.
*   **Tailwind CSS:** Framework CSS utility-first untuk desain antarmuka yang modern dan responsif.
*   **TanStack Query:** Manajemen status server untuk sinkronisasi data *real-time* di dasbor.

### Eksternal & Integrasi
*   **Google Maps Platform:** Pemanfaatan Geocoding API, Places Autocomplete, dan Distance Matrix API untuk akurasi lokasi dan navigasi.
*   **Vercel:** Platform deployment untuk aplikasi frontend (client).
*   **STB Linux:** Infrastruktur *edge computing* untuk deployment microservice backend.
*   **Tunneling:** Jalur akses aman dari internet publik menuju server backend lokal.

## 3. Panduan Deployment

### 3.1 Deployment Microservice-Logistics (Backend)
Layanan ini dapat dijalankan secara lokal maupun menggunakan Docker.

1.  **Instalasi Dependensi:**
    ```bash
    cd microservice-logistics
    npm install
    ```
2.  **Konfigurasi Environment:** Buat file `.env` dan lengkapi variabel berikut:
    *   `PORT=5002`
    *   `MONGO_URI=your_mongodb_connection_string`
    *   `JWT_SECRET=your_jwt_secret`
    *   `GOOGLE_MAPS_API_KEY=your_google_maps_key`
    *   `HEALTH_SERVICE_SECRET=shared_internal_secret`
3.  **Menjalankan Layanan:**
    *   Mode Pengembangan: `npm run dev`
    *   Mode Docker: `docker-compose up --build -d`

### 3.2 Deployment Client-Logistik (Frontend)
Aplikasi ini di-deploy di Vercel untuk kemudahan akses.

1.  **Instalasi Dependensi:**
    ```bash
    cd client-logistik
    npm install
    ```
2.  **Konfigurasi Environment:** Buat file `.env.local`:
    *   `NEXT_PUBLIC_API_URL=https://your-backend-api.id/api`
    *   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key`
    *   `NEXT_PUBLIC_HEALTH_API_URL=https://your-health-api.id/api`
3.  **Menjalankan Klien:**
    *   Lokal: `npm run dev`
    *   Build Produksi: `npm run build && npm start`

## 4. Tautan Deployment (Live Demo)

Seluruh sistem telah di-deploy dan dapat diakses secara publik melalui tautan berikut:

| Komponen | URL Deployment |
| :--- | :--- |
| **Client-Logistik** | [sigizilogz.vercel.app](https://sigizilogz.vercel.app) |
| **Client-Posyandu** | [sigizihealth.vercel.app](https://sigizihealth.vercel.app) |
| **Backend Logistics (API)** | `https://abang.theokaitou.my.id/api` |
| **Backend Health (API)** | `https://keane.theokaitou.my.id/api` |

## 5. Repositori Terintegrasi

Sistem ini dikembangkan secara kolaboratif. Repositori layanan kesehatan dan klien posyandu dapat diakses melalui tautan berikut:
*   **GitHub (Health & Posyandu):** [keaneplim/SiGIzi-PosyanduTST](https://github.com/keaneplim/SiGIzi-PosyanduTST)

## 6. Pengujian End-to-End (E2E)

Untuk melakukan pengujian alur sistem secara lengkap dari tahap deteksi hingga distribusi fisik, diperlukan jalannya seluruh komponen secara bersamaan:
1.  **Microservice-Health & Microservice-Logistics** harus dalam status aktif dan saling terhubung melalui tunnel/jaringan.
2.  **Client-Posyandu & Client-Logistik** digunakan untuk mensimulasikan interaksi pengguna.

Pengujian integrasi mencakup validasi sinkronisasi lokasi Posyandu ke registri logistik, pengiriman sinyal intervensi saat Z-Score berada di Zona Merah, hingga pembaruan status pengiriman secara *real-time* di kedua dasbor. Tanpa beroperasinya salah satu layanan, siklus intervensi stunting tidak dapat diselesaikan secara utuh.

---

