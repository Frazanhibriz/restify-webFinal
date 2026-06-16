# Restify - Aplikasi Hotel Booking Terintegrasi

Restify adalah platform manajemen dan pemesanan (booking) hotel *end-to-end* yang terdiri dari **Laravel 12 API** sebagai Backend dan **Next.js 15** sebagai Frontend. Platform ini menyediakan fitur lengkap mulai dari pencarian hotel, manajemen kamar, pemesanan hotel terintegrasi dengan Midtrans Payment Gateway, sistem manajemen khusus Resepsionis untuk check-in/out, sistem rating dinamis dengan dukungan foto ulasan, unduh bukti pembayaran (E-Receipt PDF), proteksi rute berbasis peran (Role Guard), fitur penghapusan akun mandiri oleh user, hingga mekanisme keamanan modern dengan Laravel Sanctum dan Google reCAPTCHA v3.

Project ini dibuat khusus untuk memenuhi kebutuhan **Artefak TUBES 1 Web**.

---

## 🚀 Tech Stack

### Backend
| Teknologi | Keterangan |
|---|---|
| **Laravel 12** | Framework PHP utama (REST API) |
| **PostgreSQL** | Database relasional (port default `5432`) |
| **Laravel Sanctum** | Token-based API Authentication |
| **Google reCAPTCHA v3** | Proteksi form login & registrasi dari bot |
| **Midtrans Snap Sandbox** | Payment Gateway simulasi |
| **n8n** | Workflow otomasi pengiriman OTP email |

### Frontend
| Teknologi | Keterangan |
|---|---|
| **Next.js 15 (TypeScript)** | Framework React untuk SSR & CSR |
| **Tailwind CSS + Vanilla CSS** | Styling & design system |
| **Axios** | HTTP client dengan interceptor token otomatis |
| **Next.js Middleware** | Server-side route protection berbasis role |
| **Sonner** | Sistem notifikasi toast |

---

## ✨ Fitur Utama

### 👤 Manajemen Pengguna & Autentikasi
- **Registrasi & Login** dengan proteksi Google reCAPTCHA v3
- **Lupa Kata Sandi** via OTP email (integrasi n8n workflow)
- **Edit Profil** — nama, email, nomor telepon, foto profil
- **Hapus Akun Mandiri** — user dapat menghapus akunnya sendiri secara aman
- **Role-Based Access Control** (Admin / Resepsionis / Tamu)

### 🔒 Proteksi Rute Berbasis Peran (Role Guard)
- **Next.js Middleware** (`middleware.ts`) memproteksi rute di sisi server:
  - `/home/*` → hanya untuk role `user`
  - `/admin/*` → hanya untuk role `admin`
  - `/receptionist/*` → hanya untuk role `receptionist`
- **Client-side guard** di setiap layout — redirect otomatis jika role salah
- Cookie `auth_token` + `user_role` disinkronisasi saat login/logout untuk keamanan berlapis
- Pesan error yang informatif jika akses ditolak (termasuk role yang dimiliki)

### 🏨 Pencarian & Detail Hotel
- Daftar hotel dengan filter lokasi, harga, dan rating
- Halaman detail hotel — galeri foto, fasilitas, tipe kamar tersedia
- Peta lokasi hotel
- Fitur Favorit (simpan hotel ke daftar favorit)

### 📅 Pemesanan Kamar (Booking)
- Pilih tipe kamar, tanggal check-in/check-out, jumlah tamu, extra bed
- Validasi ketersediaan kamar real-time (mencegah double booking)
- Auto-cancel pemesanan yang tidak dibayar dalam **15 menit**
- Status tracking pemesanan: `Pending → Confirmed → Checked-In → Completed`

### 💳 Pembayaran (Midtrans Snap)
- Popup Midtrans Snap langsung di halaman booking
- Mendukung simulasi Virtual Account, Transfer Bank, dll.
- Webhook otomatis memperbarui status pembayaran
- Validasi bahwa hanya akun dengan role `user` yang dapat melakukan pembayaran

### 🧾 Bukti Pembayaran (E-Receipt PDF)
- Tombol **Unduh PDF** tersedia di halaman riwayat pemesanan (kondisi `paid`)
- Template PDF premium dengan desain profesional:
  - Header gradient olive dengan kode transaksi
  - Badge status "LUNAS / TERBAYAR" berwarna hijau
  - Detail pemesan & detail reservasi dalam dua kolom
  - Tabel rincian pembayaran dengan subtotal, pajak (10%), dan grand total
  - Footer dengan pesan terima kasih dan informasi legal
- Data diinject secara dinamis (tidak ada template mentah)

### ⭐ Rating & Ulasan
- Beri rating bintang (1-5) dan teks ulasan setelah check-out
- **Upload foto ulasan** langsung dari form rating
- Hapus/ubah ulasan yang sudah diberikan
- Rating ditampilkan di halaman detail hotel

### 🛎️ Panel Resepsionis
- Dashboard statistik: pesanan menunggu, belum check-in, sedang check-in
- Kelola reservasi: konfirmasi, proses check-in, selesaikan check-out
- Manajemen data kamar hotel sendiri

### 🔧 Panel Admin
- Dashboard statistik: total hotel, kamar, pengguna
- CRUD Hotel & Kamar
- CRUD Pengguna (Admin, Resepsionis, Tamu)

---

## 📁 Struktur Folder Utama

```text
restify-webFinal/
├── backend/                        # Source code API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/        # AuthController, BookingController, dll.
│   │   │   ├── Middleware/         # RoleMiddleware (role-based access)
│   │   │   └── Requests/           # Form Request Validation
│   │   └── Models/                 # User, Hotel, Room, Booking, Rating, dll.
│   ├── database/                   # Migrations, Seeders
│   ├── routes/api.php              # Definisi seluruh endpoint API
│   ├── storage/                    # Upload foto profil, kamar, ulasan
│   └── .env.example                # Template konfigurasi environment
├── frontend/                       # Source code Frontend Next.js 15
│   ├── app/
│   │   ├── (auth)/                 # Login, Register, Forgot Password
│   │   ├── admin/                  # Panel Admin (CRUD hotel, kamar, user)
│   │   ├── detail/                 # Halaman detail hotel & booking
│   │   ├── home/                   # Beranda, Riwayat, Favorit, Profil
│   │   └── receptionist/           # Panel Resepsionis
│   ├── context/AuthContext.tsx     # State management auth + cookie management
│   ├── middleware.ts               # Next.js middleware — server-side role guard
│   ├── lib/                        # Axios instance, notifications, utils
│   └── types/                      # Tipe TypeScript (grecaptcha, dll.)
├── postman/                        # Postman collection pengujian API
│   └── Restify-Hotel-Booking-API-v3.postman_collection.json
├── restify_database.sql            # Ekspor database PostgreSQL
└── README.md                       # Panduan ini
```

---

## 🛠️ Persyaratan Perangkat Lunak

Pastikan komputer Anda telah terinstal:
- **PHP** ≥ 8.2 (sesuai kebutuhan Laravel 12)
- **Composer**
- **Node.js** ≥ 18 & **npm**
- **PostgreSQL** (service berjalan di port `5432`)
- **pgAdmin** atau PostgreSQL CLI
- **Ngrok** *(Opsional — untuk simulasi webhook Midtrans real-time)*

---

## ⚙️ Langkah Menjalankan Aplikasi

### Langkah 1: Setup Database PostgreSQL

1. Buka **pgAdmin** atau terminal PostgreSQL Anda.
2. Buat database baru bernama `restify`.
3. Import file **`restify_database.sql`** dari root direktori project:
   - **pgAdmin**: Klik kanan database → Query Tool → buka `restify_database.sql` → Execute (F5)
   - **CLI**:
     ```bash
     psql -U postgres -d restify -f restify_database.sql
     ```

---

### Langkah 2: Setup & Jalankan Backend (Laravel API)

```bash
cd backend
```

```bash
# Windows
copy .env.example .env
# Linux / macOS
cp .env.example .env
```

```bash
composer install
php artisan key:generate
```

Buka `backend/.env` dan sesuaikan konfigurasi berikut:

```env
# Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=restify
DB_USERNAME=username_postgresql_anda
DB_PASSWORD=password_postgresql_anda

# Midtrans Sandbox (https://dashboard.sandbox.midtrans.com)
MIDTRANS_SERVER_KEY=server_key_sandbox_anda
MIDTRANS_CLIENT_KEY=client_key_sandbox_anda

# Google reCAPTCHA v3 (sudah terkonfigurasi untuk localhost)
RECAPTCHA_SECRET_KEY=secret_key_recaptcha_v3_anda
```

```bash
php artisan storage:link
php artisan serve
```

> Backend aktif di **http://127.0.0.1:8000**

---

### Langkah 3: Jalankan Layanan Pendukung

**Laravel Scheduler** (auto-cancel booking tidak dibayar dalam 15 menit):
```bash
# Buka terminal baru di folder backend/
php artisan schedule:work
```

---

### Langkah 4: Setup & Jalankan Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

> Frontend aktif di **http://localhost:3000**

Saat pertama kali buka browser, **logout dulu** jika sudah pernah login sebelumnya agar cookie role tersinkronisasi dengan benar.

---

## 🔐 Data Akun Pengujian

### 1. Admin (Manajer Utama)
- **Akses**: CRUD hotel, kamar, pengguna; monitor semua pemesanan global
- **Email**: `admin@restify.com`
- **Password**: `Admin1234`
- **Panel**: http://localhost:3000/admin

### 2. Resepsionis
- **Akses**: Kelola reservasi hotel sendiri; proses check-in/check-out tamu
- **Email**: `receptionist.flores@gmail.com`
- **Password**: `Recep1234`
- **Panel**: http://localhost:3000/receptionist

### 3. Tamu (User / Customer)
- **Akses**: Cari & pesan hotel, bayar via Midtrans, rating ulasan, unduh E-Receipt PDF
- **Email**: `user@restify.com`
- **Password**: `User1234`
- **Panel**: http://localhost:3000/home

> **Catatan Keamanan Role**: Setiap role hanya dapat mengakses panel miliknya. Jika resepsionis mencoba membuka `/home`, sistem akan otomatis mengarahkan kembali ke `/receptionist`.

---

## 🛡️ Fitur Keamanan & Pembayaran

### Google reCAPTCHA v3
Registrasi dan login dilindungi dari bot. Kunci site key & secret key untuk `localhost` sudah terkonfigurasi. Tidak diperlukan konfigurasi tambahan untuk pengujian lokal.

### Midtrans Payment Gateway (Simulasi)
1. Klik **Bayar Sekarang** pada halaman detail hotel
2. Popup Midtrans Snap muncul — pilih metode simulasi (Virtual Account BNI/BRI/Mandiri, dll.)
3. Salin kode VA yang muncul dan selesaikan simulasi pembayaran

**Simulasi Webhook Real-time** *(Opsional)*:
```bash
ngrok http 8000
```
Salin URL HTTPS ngrok → Dashboard Midtrans → Settings → Merchant Base URL → Payment Notification URL:
```
https://xxxx.ngrok-free.app/api/midtrans/callback
```

---

## 📧 Konfigurasi Workflow n8n (Lupa Kata Sandi)

### Langkah 1: Install & Jalankan n8n
```bash
npm install -g n8n
npx n8n
```
> n8n berjalan di **http://localhost:5678**

### Langkah 2: Import Workflow
1. Buka http://localhost:5678 → **Add workflow**
2. Menu (tiga titik) → **Import from file** → pilih `Restify.json` di root project

### Langkah 3: Setup Kredensial Email (Gmail SMTP)
Klik dua kali node pengirim email → isi:
- **Email**: alamat Gmail Anda
- **Password**: [App Password Google](https://myaccount.google.com/apppasswords)
- **Host**: `smtp.gmail.com`
- **Port**: `465` (SSL) atau `587` (TLS)

### Langkah 4: Publish & Salin Production URL
1. Aktifkan workflow → klik **Publish**
2. Klik node Webhook → tab **Webhook URLs** → salin **Production URL**

### Langkah 5: Update AuthController
Buka `backend/app/Http/Controllers/AuthController.php` dan ganti URL webhook di method `forgotPassword`:
```php
$response = Http::post('http://localhost:5678/webhook/YOUR_PRODUCTION_ID', [
    'email' => $request->email,
    'code'  => $code
]);
```

---

## 🧪 Pengujian API via Postman

Berkas Postman Collection tersedia di:
```
postman/Restify-Hotel-Booking-API-v3.postman_collection.json
```

**Cara penggunaan**:
1. Buka **Postman** → **Import** → pilih file JSON di atas
2. Jalankan endpoint **Login** → salin `token` dari response
3. Tempelkan token ke tab **Authorization** (tipe: **Bearer Token**) pada endpoint yang memerlukan autentikasi

---

## ⚡ Pemecahan Masalah (Troubleshooting)

| Masalah | Solusi |
|---|---|
| **Gambar hotel/kamar rusak** | Jalankan `php artisan storage:link` di folder `backend/` |
| **Database Connection Refused** | Pastikan service PostgreSQL aktif di port `5432` dan `.env` sudah dikonfigurasi |
| **reCAPTCHA gagal** | Jalankan `php artisan config:clear` setelah mengedit `.env` |
| **"Access Denied" saat bayar** | Pastikan login sebagai akun **Tamu** (bukan Admin/Resepsionis). Logout lalu login ulang |
| **Role salah setelah login** | Logout → hapus localStorage di DevTools → login ulang agar cookie role tersinkronisasi |
| **PDF menampilkan kode mentah** | Refresh halaman, pastikan koneksi internet aktif (untuk Google Fonts di PDF) |
| **Popup Midtrans tidak muncul** | Izinkan pop-up browser untuk `localhost:3000` di pengaturan browser |

---

## 📋 Changelog Terbaru

### v2.1.0 — Juni 2025
- ✅ **Role Guard berlapis**: Next.js middleware (server-side) + client-side guard di setiap layout
- ✅ **Cookie-based role management**: `auth_token` & `user_role` cookie untuk proteksi middleware
- ✅ **E-Receipt PDF premium**: Template didesain ulang dengan gradient header, badge status, tabel rincian, dan grand total box — semua data diinject dengan benar (bug template mentah diperbaiki)
- ✅ **Rating dengan foto ulasan**: User dapat melampirkan foto saat memberikan ulasan
- ✅ **Fix "Access Denied" saat booking**: Validasi role dilakukan di frontend sebelum API call, dengan pesan error yang informatif
- ✅ **RoleMiddleware diperbarui**: Selalu load relasi `role` dari DB, logging detail untuk debugging
- ✅ **Redirect yang benar antar panel**: Admin ke `/admin`, Resepsionis ke `/receptionist`, Tamu ke `/home`
- ✅ **Tombol PDF hanya tampil saat belum bayar**: Setelah `completed`/`checked_out`, tombol PDF disembunyikan agar tampilan bersih

---

*Dibuat dengan ❤️ untuk TUBES Web — Restify v2.1.0*
