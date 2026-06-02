# Restify - Aplikasi Hotel Booking Terintegrasi

Restify adalah platform manajemen dan pemesanan (booking) hotel end-to-end yang terdiri dari Laravel 12 API sebagai Backend dan Next.js 15 sebagai Frontend. Platform ini menyediakan fitur lengkap mulai dari pencarian hotel, manajemen kamar, pemesanan hotel terintegrasi dengan Midtrans Payment Gateway, sistem manajemen khusus Resepsionis untuk check-in/out, sistem rating dinamis, hingga mekanisme keamanan modern dengan Laravel Sanctum dan Google reCAPTCHA v3.

Project ini dibuat khusus untuk memenuhi kebutuhan **Artefak TUBES 1 Web**.

---

## 🚀 Tech Stack

### Backend
* **Framework**: Laravel 12
* **Database**: PostgreSQL (port default `5432`)
* **Security & Auth**: Laravel Sanctum & Google reCAPTCHA v3
* **Payment Gateway**: Midtrans Snap Sandbox
* **API Architecture**: REST API

### Frontend
* **Framework**: Next.js 15 (TypeScript)
* **Styling**: Tailwind CSS & Vanilla CSS
* **HTTP Client**: Axios

---

## 📁 Struktur Folder Utama

```text
restify-webFinal/
├── backend/                  # Source code API Laravel 12
│   ├── app/                  # Controller, Middleware, Models, Providers
│   ├── config/               # Berkas konfigurasi aplikasi Laravel
│   ├── database/             # Migrations, Seeders, Factories
│   ├── routes/               # Defini endpoint API (api.php)
│   ├── storage/              # Lokasi berkas upload & logs
│   ├── .env.example          # Template konfigurasi environment backend
│   └── artisan               # CLI Tool Laravel
├── frontend/                 # Source code Frontend Next.js 15
│   ├── app/                  # Pages, layouts, routing Next.js
│   ├── context/              # State management
│   ├── lib/                  # Library pembantu (Axios instance, notifications)
│   ├── public/               # Asset statis frontend
│   └── types/                # Tipe TypeScript (grecaptcha, dll)
├── postman/                  # Postman collection untuk pengujian API
│   └── Restify-Hotel-Booking-API-v3.postman_collection.json
├── restify_database.sql      # Berkas ekspor database PostgreSQL
└── README.md                 # Panduan instalasi dan pengujian aplikasi (file ini)
```

---

## 🛠️ Persyaratan Perangkat Lunak (Requirements)

Sebelum memulai instalasi, pastikan komputer Anda telah terinstal:
* **PHP** (Sesuai dengan kebutuhan Laravel 12, direkomendasikan PHP >= 8.2)
* **Composer**
* **Node.js** (Direkomendasikan Node.js >= 18) & **npm**
* **PostgreSQL** (Pastikan service pgsql berjalan di port default `5432`)
* **pgAdmin** atau PostgreSQL Terminal CLI
* **Ngrok** (Opsional, hanya jika ingin mensimulasikan webhook pembayaran Midtrans secara real-time)

> **Catatan Konfigurasi Khusus (Framework & DBMS)**:
> * **Framework**: Aplikasi ini dibangun menggunakan framework **Laravel 12** untuk Backend API dan **Next.js 15** untuk Frontend Web. Instruksi konfigurasi dan langkah instalasi dependensi masing-masing framework telah disediakan secara lengkap di bawah.
> * **DBMS (Database Management System)**: Platform Restify menggunakan **PostgreSQL** yang merupakan RDBMS (Relational Database Management System). **Aplikasi ini tidak menggunakan DBMS non-relasional** (seperti MongoDB atau Redis) untuk penyimpanan data utama, sehingga Anda tidak perlu mengonfigurasi layanan non-relasional apa pun untuk menjalankan aplikasi secara utuh.

---

## ⚙️ Langkah-Langkah Menjalankan Aplikasi (Step-by-Step Setup)

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan platform Restify dengan aman dan lancar di lingkungan lokal Anda.

### Langkah 1: Setup Database PostgreSQL
1. Buka **pgAdmin** atau terminal PostgreSQL Anda.
2. Buat sebuah database baru bernama:
   ```text
   restify
   ```
3. Import file database **`restify_database.sql`** yang berada di root direktori project:
   * **Menggunakan pgAdmin**:
     1. Klik kanan database `restify` -> Pilih **Query Tool**.
     2. Buka berkas `restify_database.sql` di Query Tool tersebut.
     3. Klik tombol **Execute / Play** (F5). Pastikan seluruh query sukses dieksekusi dan tabel seperti `users`, `hotels`, `rooms`, `bookings`, `payments`, `ratings` telah terbentuk.
   * **Menggunakan Terminal CLI**:
     ```bash
     psql -U postgres -d restify -f restify_database.sql
     ```
     *(Masukkan kata sandi PostgreSQL lokal Anda saat diminta).*

---

### Langkah 2: Setup & Jalankan Backend (Laravel API)
1. Buka terminal baru dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Salin template environment menjadi file `.env` aktif:
   * **Windows PowerShell / Command Prompt**:
     ```powershell
     copy .env.example .env
     ```
   * **Linux / macOS / Git Bash**:
     ```bash
     cp .env.example .env
     ```
3. Pasang semua dependensi library PHP:
   ```bash
   composer install
   ```
4. Buat kunci aplikasi Laravel (App Key):
   ```bash
   php artisan key:generate
   ```
5. Buka berkas **`backend/.env`** menggunakan editor teks pilihan Anda, kemudian sesuaikan bagian konfigurasi database PostgreSQL Anda:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=restify
   DB_USERNAME=username_postgresql_anda  # Contoh: postgres
   DB_PASSWORD=password_postgresql_anda  # Contoh: admin123
   ```
6. Hubungkan direktori storage agar gambar hotel, kamar, dan ulasan dapat diakses secara publik:
   ```bash
   php artisan storage:link
   ```
7. Jalankan server lokal API Laravel:
   ```bash
   php artisan serve
   ```
   *Server backend sekarang aktif dan berjalan di **http://127.0.0.1:8000**.*

---

### Langkah 3: Jalankan Layanan Pendukung (Sangat Direkomendasikan)
* **Laravel Scheduler (Auto-Cancel Booking)**:
  Aplikasi ini memiliki scheduler yang akan otomatis membatalkan pemesanan yang tidak dibayar dalam **15 menit**. Buka terminal baru di direktori `backend/` dan jalankan:
  ```bash
  php artisan schedule:work
  ```
  *Biarkan command ini tetap berjalan selama proses simulasi pemesanan kamar.*
  
* **Fitur Reset Kata Sandi (Password Reset)**:
  Secara default di `.env`, konfigurasi pengirim email diatur ke `MAIL_MAILER=log`. Hal ini sangat praktis untuk kebutuhan presentasi dan pengujian lokal oleh Dosen. Ketika Anda melakukan request "Lupa Kata Sandi", token reset **tidak dikirim ke email asli**, melainkan dicatat secara otomatis ke file log backend:
  ```text
  backend/storage/logs/laravel.log
  ```
  Dosen atau penguji dapat langsung menyalin token reset dari log tersebut untuk dimasukkan ke form "Reset Kata Sandi" di browser.

---

### Langkah 4: Setup & Jalankan Frontend (Next.js)
1. Buka terminal baru dan arahkan ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Pasang seluruh dependensi node package:
   ```bash
   npm install
   ```
3. Jalankan server development frontend Next.js:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend web sekarang aktif dan dapat dibuka langsung melalui browser di **http://localhost:3000**.*

---

## 🔐 Data Akun Pengujian (Testing Credentials)

Untuk memudahkan dosen atau penguji dalam menjelajahi fungsionalitas aplikasi berdasarkan hak akses masing-masing peran, silakan gunakan kredensial bawaan berikut:

### 1. Akun Admin (Manajer Utama)
* **Peran**: Mengelola data hotel (CRUD), kamar (CRUD), pengguna/staf (CRUD), serta memantau semua daftar pemesanan global.
* **Email**: `admin@restify.com`
* **Password**: `Admin1234`

### 2. Akun Resepsionis (Receptionist)
* **Peran**: Meninjau pemesanan masuk khusus hotel mereka, menyetujui/menolak pesanan, memproses check-in tamu saat datang di tempat, dan mengubah status kamar ke selesai dibersihkan.
* **Email**: `receptionist.flores@gmail.com`
* **Password**: `Recep1234`

### 3. Akun Tamu (User / Customer)
* **Peran**: Menjelajahi hotel, memesan kamar secara real-time, membayar via Midtrans Snap, check-out mandiri, serta memberikan ulasan/rating.
* **Akses**: Silakan daftar akun baru secara instan melalui antarmuka pendaftaran (Register) pada web, atau gunakan akun dummy yang sudah tersedia:
  * **Email**: `user@restify.com`
  * **Password**: `User1234`

---

## 🛡️ Fitur Keamanan & Pembayaran Utama

### 1. Google reCAPTCHA v3
Sistem registrasi dan login Anda telah dilindungi dari serangan spam bot menggunakan Google reCAPTCHA v3. Kunci situs (Site Key) dan kunci rahasia (Secret Key) resmi untuk domain `localhost` sudah terkonfigurasi secara terintegrasi baik di frontend maupun berkas `backend/.env.example` bawaan. Tidak diperlukan langkah konfigurasi reCAPTCHA tambahan untuk pengujian lokal.

### 2. Midtrans Payment Gateway (Simulasi Pembayaran)
Pembayaran pemesanan hotel didukung oleh Midtrans Snap Sandbox.
1. Saat Tamu melakukan pemesanan dan mengklik tombol bayar, popup lembar pembayaran Snap akan muncul di layar.
2. Anda dapat menggunakan metode simulasi seperti Simulator Kartu Kredit / QRIS di Midtrans Sandbox MAP untuk menyelesaikan pembayaran fiktif.
3. **Simulasi Webhook Real-time (Opsional)**: Jika Anda ingin agar status pemesanan di web langsung berubah menjadi **Paid (Lunas)** seketika setelah pembayaran sukses di popup, gunakan **Ngrok** untuk meneruskan port 8000 lokal Anda:
   ```bash
   ngrok http 8000
   ```
   Salin URL HTTPS publik dari Ngrok (misal `https://xxxx.ngrok-free.app`), buka dashboard Midtrans MAP Sandbox Anda, masuk ke **Settings > Merchant Base URL**, lalu isi **Payment Notification URL** dengan:
   ```text
   https://xxxx.ngrok-free.app/api/midtrans/callback
   ```

---

## 🧪 Panduan Pengujian API via Postman

Bagi penguji yang ingin memverifikasi respons API backend secara terpisah, sebuah berkas Postman Collection lengkap telah disertakan:
* **Lokasi Berkas**: `postman/Restify-Hotel-Booking-API-v3.postman_collection.json`
* **Cara Penggunaan**:
  1. Buka aplikasi **Postman**.
  2. Klik tombol **Import** -> Pilih berkas JSON koleksi di atas.
  3. Gunakan endpoint Login untuk memperoleh token autentikasi Sanctum.
  4. Salin token dari respons, dan tempelkan ke tab **Authorization** (pilih tipe **Bearer Token**) pada endpoint terproteksi lainnya yang ingin diuji.

---

## ⚡ Pemecahan Masalah (Troubleshooting)

* **Gambar Hotel / Kamar Rusak (Broken Image)**:
  Pastikan Anda telah menjalankan perintah `php artisan storage:link` di folder `backend`. Jika masih bermasalah, hapus folder pintasan `public/storage` lama Anda dan jalankan perintah tersebut kembali.
* **Database Connection Refused**:
  Pastikan service PostgreSQL di komputer Anda sudah berjalan aktif di port `5432` dan kata sandi di berkas `backend/.env` telah dikonfigurasi dengan benar sesuai database lokal Anda.
* **Verifikasi reCAPTCHA Gagal**:
  Pastikan file konfigurasi `.env` Anda sudah ter-update dengan kunci reCAPTCHA yang benar dan Anda telah membersihkan cache konfigurasi Laravel setelah mengedit file `.env` dengan menjalankan:
  ```bash
  php artisan config:clear
  ```
