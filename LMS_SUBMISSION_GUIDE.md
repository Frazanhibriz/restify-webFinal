# Panduan Pengumpulan LMS (Restify Application)

Gunakan dokumen panduan ini untuk diserahkan ke LMS Anda.

---

## 🛠️ Cara Menjalankan Aplikasi & Konfigurasi

### 1. Database Setup (PostgreSQL)
* Pastikan service PostgreSQL Anda sedang berjalan pada port default (`5432`).
* Buat database baru bernama `restify` (atau sesuaikan nama database di berkas `.env`).
* Import file export database `restify_database.sql` yang terletak di folder utama project:
  ```bash
  psql -U postgres -d restify -f restify_database.sql
  ```
  *(Masukkan kata sandi database PostgreSQL lokal Anda).*

### 2. Konfigurasi Backend (Laravel API)
* Masuk ke subdirektori `backend`:
  ```bash
  cd backend
  ```
* Buat berkas konfigurasi `.env` dari template yang tersedia:
  ```bash
  cp .env.example .env
  ```
* Buka berkas `.env` dan pastikan konfigurasi credentials database PostgreSQL sudah sesuai:
  ```env
  DB_CONNECTION=pgsql
  DB_HOST=127.0.0.1
  DB_PORT=5432
  DB_DATABASE=restify
  DB_USERNAME=username_anda
  DB_PASSWORD=password_anda
  ```
* Install library pendukung menggunakan Composer:
  ```bash
  composer install
  ```
* Jalankan server development API:
  ```bash
  php artisan serve
  ```
  *Server backend otomatis berjalan di http://127.0.0.1:8000.*

### 3. Konfigurasi Frontend (Next.js Application)
* Buka terminal baru dan masuk ke subdirektori `frontend`:
  ```bash
  cd frontend
  ```
* Unduh dan pasang dependencies node package:
  ```bash
  npm install
  ```
* Jalankan server Next.js dev:
  ```bash
  npm run dev
  ```
  *Aplikasi web interaktif siap dibuka di browser via http://localhost:3000.*

---

## 🔐 Data Uji Akun per Role (Credentials)

Untuk memudahkan proses penilaian di LMS, silakan gunakan akun-akun uji coba yang sudah siap pakai di database berikut:

### 1. Role: Admin
* **Tanggung Jawab**: CRUD data Hotel, CRUD data Kamar, serta CRUD manajemen Pengguna (Admin, Resepsionis, Tamu).
* **Email**: `admin@restify.com`
* **Password**: `Admin1234`

### 2. Role: Resepsionis (Receptionist)
* **Tanggung Jawab**: Melakukan check-in tamu hotel, check-out, memantau status pemesanan secara real-time, dan memvalidasi pembayaran QRIS/Tunai.
* **Email**: `receptionist.flores@gmail.com` *(Atau email resepsionis hotel lain dalam file sql)*
* **Password**: `Recep1234`

### 3. Role: Tamu (User/Customer)
* **Tanggung Jawab**: Booking kamar hotel, pembayaran QRIS/Midtrans Snap, rating & ulasan ubin hotel, serta check-out mandiri.
* **Akses**: *Silakan gunakan fitur Registrasi (tombol Daftar) pada antarmuka aplikasi untuk membuat akun Tamu baru secara instan, atau daftar dengan data fiktif apa pun.*

---

## 📦 File Arsip Project
Berkas kompresi bersih **`restify-project.zip`** sudah dibuat di direktori utama, dengan pengecualian folder `/node_modules`, `/vendor`, `/.next`, dan `/.git` untuk memenuhi batas ukuran pengiriman LMS.
Ukuran berkas zip akhir hanya berkisar **4.3 MB**.
