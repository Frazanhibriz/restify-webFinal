# Restify - Hotel Booking Backend API

Restify adalah backend API untuk aplikasi hotel booking berbasis Laravel. Backend ini menyediakan fitur autentikasi, manajemen hotel dan kamar, booking hotel, pembayaran menggunakan Midtrans Snap, sistem receptionist, checkout, rating hotel, serta upload gambar.

Project ini dibuat untuk kebutuhan **Artefak TUBES 1 Web**.

---

## Tech Stack

* Laravel 12
* PostgreSQL
* Laravel Sanctum
* Midtrans Snap Payment Gateway
* REST API
* Postman untuk testing API

---

## Informasi Project

| Item               | Keterangan                  |
| ------------------ | --------------------------- |
| Nama Project       | Restify                     |
| Jenis Aplikasi     | Backend API Hotel Booking   |
| Framework          | Laravel 12                  |
| Database           | PostgreSQL                  |
| Authentication     | Laravel Sanctum             |
| API Prefix         | `/api`                      |
| Local Backend URL  | `http://127.0.0.1:8000`     |
| Local API Base URL | `http://127.0.0.1:8000/api` |
| Branch GitHub      | `backend`                   |

---

## File Artefak yang Disediakan

Project ini menyertakan file pendukung untuk kebutuhan pengumpulan tugas.

| File/Folder                                                    | Keterangan                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `.env.example`                                                 | Contoh konfigurasi environment tanpa secret asli                            |
| `restify_database.sql`                                         | File export database PostgreSQL                                             |
| `postman/Restify-Hotel-Booking-API-v3.postman_collection.json` | Postman collection untuk testing API                                        |
| `README.md`                                                    | Panduan instalasi, konfigurasi, import database, endpoint, dan akun testing |

Folder dan file berikut tidak dikumpulkan atau tidak ikut commit karena termasuk dependency, hasil build, file lokal, atau file rahasia:

* `vendor/`
* `node_modules/`
* `build/`
* `.env`
* `.env.backup`
* `.env.production`
* file testing lokal seperti `public/test-midtrans.html`
* file lain yang tercantum di `.gitignore`

---

## Struktur Folder Penting

```text
BE-Restify/
├── app/
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── postman/
│   └── Restify-Hotel-Booking-API-v3.postman_collection.json
├── public/
├── routes/
│   └── api.php
├── storage/
├── tests/
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── composer.lock
├── README.md
└── restify_database.sql
```

---

## Requirement

Sebelum menjalankan project, pastikan perangkat sudah memiliki:

* PHP sesuai requirement Laravel 12
* Composer
* PostgreSQL
* pgAdmin atau terminal PostgreSQL
* Postman untuk testing API
* Git

---

## Clone Repository

Clone repository dari GitHub:

```bash
git clone <LINK_GITHUB>
cd BE-Restify
git checkout backend
```

Ganti `<LINK_GITHUB>` dengan link repository project.

---

## Install Dependency

Karena folder `vendor/` tidak dikumpulkan, dependency Laravel harus di-install ulang.

```bash
composer install
```

---

## Setup Environment

Copy file `.env.example` menjadi `.env`.

Untuk Windows PowerShell:

```bash
copy .env.example .env
```

Untuk Git Bash, Linux, atau Mac:

```bash
cp .env.example .env
```

Generate Laravel application key:

```bash
php artisan key:generate
```

---

## Konfigurasi Environment

Buka file `.env`, lalu sesuaikan konfigurasi aplikasi.

Contoh konfigurasi utama:

```env
APP_NAME=Restify
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
```

---

## Konfigurasi Database PostgreSQL

Project ini menggunakan PostgreSQL.

Contoh konfigurasi database pada file `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=restify
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
```

Catatan:

* `DB_DATABASE` disarankan menggunakan nama `restify`.
* `DB_USERNAME` sesuaikan dengan username PostgreSQL lokal.
* `DB_PASSWORD` sesuaikan dengan password PostgreSQL lokal.
* File `.env` tidak dikumpulkan karena berisi konfigurasi lokal dan data sensitif.

---

## Import Database PostgreSQL

Database sudah disediakan dalam file:

```text
restify_database.sql
```

File tersebut merupakan hasil export database PostgreSQL dan berisi struktur tabel serta data.

---

### Cara Import Database melalui pgAdmin

Karena file database menggunakan format **Plain SQL**, cara yang aman adalah menggunakan **Query Tool**.

Langkah-langkah:

1. Buka pgAdmin.
2. Buat database baru dengan nama:

```text
restify
```

3. Klik database `restify`.
4. Buka **Query Tool**.
5. Buka file `restify_database.sql`.
6. Jalankan seluruh query.
7. Pastikan tabel berhasil dibuat, seperti:

   * `users`
   * `roles`
   * `hotels`
   * `rooms`
   * `bookings`
   * `payments`
   * `ratings`
   * `personal_access_tokens`
   * tabel pendukung Laravel lainnya

---

### Cara Import Database melalui Terminal PostgreSQL

Jika menggunakan terminal, buat database terlebih dahulu:

```bash
createdb -U postgres restify
```

Lalu import file SQL:

```bash
psql -U postgres -d restify -f restify_database.sql
```

Jika diminta password, masukkan password PostgreSQL lokal.

---

## Alternatif: Menjalankan Migration dan Seeder

Jika ingin membuat ulang database dari migration dan seeder, jalankan:

```bash
php artisan migrate --seed
```

Seeder yang tersedia:

* `RoleSeeder`
* `UserSeeder`
* `HotelSeeder`
* `RoomSeeder`
* `ReceptionistSeeder`

Data seeder mencakup:

* Role `admin`, `user`, dan `receptionist`
* Akun admin
* Data hotel
* Data room
* Data receptionist

Ketentuan data seeder:

* Hotel berjumlah 15 data:

  * 10 hotel Bandung
  * 5 hotel Jakarta
* Hotel Bandung memiliki 2 tipe kamar dan masing-masing tipe memiliki 2 room.
* Hotel Jakarta memiliki 3 tipe kamar dan masing-masing tipe memiliki 1 room.
* Setiap hotel memiliki 1 receptionist.
* Password seed mengikuti aturan minimal 8 karakter, memiliki huruf besar, huruf kecil, dan angka.

---

## Storage Link

Project ini memiliki fitur upload gambar, seperti:

* image hotel
* QRIS image hotel
* image room
* profile picture
* foto rating

Agar file upload dapat diakses dari public URL, jalankan:

```bash
php artisan storage:link
```

Jika gambar tidak tampil, jalankan ulang command tersebut.

---

## Menjalankan Laravel Server

Jalankan server lokal:

```bash
php artisan serve
```

Server akan berjalan di:

```text
http://127.0.0.1:8000
```

Base URL API:

```text
http://127.0.0.1:8000/api
```

---

## Menjalankan Scheduler

Scheduler digunakan untuk menjalankan proses otomatis, salah satunya auto cancel booking yang sudah expired.

```bash
php artisan schedule:work
```

Booking dengan status pending memiliki waktu expired selama 15 menit.

---

## Konfigurasi Midtrans

Project ini menggunakan Midtrans Snap untuk proses pembayaran.

Contoh konfigurasi pada file `.env`:

```env
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

Catatan:

* Gunakan Midtrans Sandbox untuk testing.
* Jangan commit key asli Midtrans ke GitHub.
* Key asli hanya disimpan di file `.env` lokal.

---

## Akun Testing

Berikut akun testing yang dapat digunakan untuk mencoba aplikasi.

| Role         | Email                           | Password    |
| ------------ | ------------------------------- | ----------- |
| Admin        | `admin@restify.com`             | `Admin1234` |
| Receptionist | `receptionist.flores@gmail.com` | `Recep1234` |
| User         | `user@restify.com`              | `User1234`  |

Catatan:

* Akun admin berasal dari seeder.
* Akun receptionist berasal dari seeder.
* Jika akun user belum tersedia pada database import, user dapat dibuat melalui endpoint register.
* Untuk memenuhi ketentuan tugas, disarankan akun user dummy `user@restify.com` sudah tersedia pada database yang diexport.

---

## Role dan Hak Akses

### Admin

Admin dapat melakukan:

* CRUD hotel
* CRUD room
* CRUD user
* Melihat semua booking
* Mengelola data master aplikasi

Ketentuan khusus admin:

* Admin tidak boleh membuat admin baru.
* Admin seeded tidak boleh dihapus.
* Role admin seeded tidak boleh diubah.

---

### User

User dapat melakukan:

* Register
* Login
* Logout
* Melihat profile
* Melihat daftar hotel
* Melihat detail hotel
* Melihat daftar room berdasarkan hotel
* Membuat booking
* Melihat riwayat booking
* Melihat detail booking
* Membatalkan booking
* Melihat detail payment
* Melakukan pembayaran dengan Midtrans Snap
* Checkout
* Memberikan rating setelah checkout completed
* Upload profile picture

---

### Receptionist

Receptionist dapat melakukan:

* Melihat daftar booking
* Confirm booking
* Decline booking
* Check-in
* Update status kamar

---

## Fitur Utama

### Authentication

* Register
* Login
* Logout
* Profile
* Forgot Password
* Reset Password
* Throttle login
* Throttle register
* Throttle forgot password

---

### Hotel

* Get all hotels
* Get hotel detail
* Search hotel
* Filter city
* Filter harga
* Sorting
* Pagination
* Facilities hotel dalam bentuk JSON array
* Upload image hotel
* Upload QRIS image hotel

---

### Room

* Get all rooms
* Get room detail
* Rooms by hotel
* Filter room type
* Filter status
* Filter price
* Pagination
* Facilities room dalam bentuk JSON array
* Upload image room

---

### Booking

* Create booking
* Booking history
* Booking detail
* Cancel booking
* Pencegahan double booking atau race condition menggunakan database transaction dan `lockForUpdate`
* Booking pending memiliki `expired_at` selama 15 menit
* Auto cancel expired booking melalui Laravel scheduler

---

### Payment

* Midtrans Snap token
* Payment callback
* Payment detail
* Status pembayaran:

  * `pending`
  * `paid`
  * `failed`

---

### Receptionist System

* Booking list
* Confirm booking
* Decline booking
* Check-in
* Update room status

---

### Rating

* Rating hanya bisa diberikan setelah checkout completed
* Satu booking hanya bisa memberi satu rating
* Rating dapat memiliki foto ulasan
* Foto rating memiliki `image_url`

---

### Profile

* User dapat upload profile picture
* User model memiliki `profile_picture_url`

---

## Endpoint Penting

Base URL lokal:

```text
http://127.0.0.1:8000/api
```

Untuk endpoint protected, gunakan header:

```text
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

---

### Public Endpoint

| Method | Endpoint               | Keterangan                        |
| ------ | ---------------------- | --------------------------------- |
| POST   | `/register`            | Register user                     |
| POST   | `/login`               | Login user                        |
| POST   | `/forgot-password`     | Request lupa password             |
| POST   | `/reset-password`      | Reset password                    |
| GET    | `/hotels`              | Melihat semua hotel               |
| GET    | `/hotels/{id}`         | Melihat detail hotel              |
| GET    | `/hotels/{id}/ratings` | Melihat rating hotel              |
| GET    | `/hotels/{id}/rooms`   | Melihat room berdasarkan hotel    |
| POST   | `/midtrans/callback`   | Callback pembayaran dari Midtrans |

---

### Auth Endpoint

Endpoint berikut membutuhkan token Sanctum.

| Method | Endpoint        | Keterangan                             |
| ------ | --------------- | -------------------------------------- |
| POST   | `/logout`       | Logout user                            |
| GET    | `/profile`      | Melihat profile user yang sedang login |
| GET    | `/booking/{id}` | Melihat detail booking berdasarkan ID  |

---

### Admin Endpoint

Endpoint berikut membutuhkan token Sanctum dan role `admin`.

Prefix:

```text
/admin
```

| Method    | Endpoint             | Keterangan            |
| --------- | -------------------- | --------------------- |
| GET       | `/admin/hotels`      | Melihat semua hotel   |
| POST      | `/admin/hotels`      | Membuat hotel         |
| GET       | `/admin/hotels/{id}` | Melihat detail hotel  |
| PUT/PATCH | `/admin/hotels/{id}` | Update hotel          |
| DELETE    | `/admin/hotels/{id}` | Hapus hotel           |
| GET       | `/admin/rooms`       | Melihat semua room    |
| POST      | `/admin/rooms`       | Membuat room          |
| GET       | `/admin/rooms/{id}`  | Melihat detail room   |
| PUT/PATCH | `/admin/rooms/{id}`  | Update room           |
| DELETE    | `/admin/rooms/{id}`  | Hapus room            |
| GET       | `/admin/users`       | Melihat semua user    |
| POST      | `/admin/users`       | Membuat user          |
| GET       | `/admin/users/{id}`  | Melihat detail user   |
| PUT/PATCH | `/admin/users/{id}`  | Update user           |
| DELETE    | `/admin/users/{id}`  | Hapus user            |
| GET       | `/admin/bookings`    | Melihat semua booking |

---

### User Endpoint

Endpoint berikut membutuhkan token Sanctum dan role `user`.

Prefix:

```text
/user
```

| Method | Endpoint                    | Keterangan                            |
| ------ | --------------------------- | ------------------------------------- |
| POST   | `/user/booking`             | Membuat booking                       |
| POST   | `/user/cancel-booking/{id}` | Membatalkan booking                   |
| GET    | `/user/booking-history`     | Melihat riwayat booking               |
| GET    | `/user/payment/{id}`        | Melihat detail payment                |
| POST   | `/user/pay/{id}`            | Membayar booking dengan Midtrans Snap |
| POST   | `/user/checkout/{id}`       | Checkout booking                      |
| POST   | `/user/ratings`             | Submit rating                         |
| POST   | `/user/upload-profile`      | Upload profile picture                |

---

### Receptionist Endpoint

Endpoint berikut membutuhkan token Sanctum dan role `receptionist`.

Prefix:

```text
/receptionist
```

| Method | Endpoint                           | Keterangan             |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/receptionist/bookings`           | Melihat daftar booking |
| POST   | `/receptionist/confirm-booking`    | Confirm booking        |
| POST   | `/receptionist/check-in`           | Check-in booking       |
| POST   | `/receptionist/decline-booking`    | Decline booking        |
| POST   | `/receptionist/update-room-status` | Update status kamar    |

---

## Testing API dengan Postman

Postman collection tersedia pada folder:

```text
postman/Restify-Hotel-Booking-API-v3.postman_collection.json
```

Cara menggunakan:

1. Buka Postman.
2. Klik **Import**.
3. Pilih file collection dari folder `postman`.
4. Jalankan endpoint login untuk mendapatkan token.
5. Gunakan token pada tab Authorization dengan tipe Bearer Token.
6. Jalankan endpoint sesuai role akun yang digunakan.

Rekomendasi variable Postman:

```text
base_url = http://127.0.0.1:8000/api
token = isi_token_setelah_login
```

---

## Alur Testing Singkat

### 1. Testing Admin

1. Login menggunakan akun admin.
2. Copy token dari response login.
3. Gunakan token sebagai Bearer Token.
4. Test endpoint:

   * `GET /admin/hotels`
   * `POST /admin/hotels`
   * `GET /admin/rooms`
   * `GET /admin/users`
   * `GET /admin/bookings`

---

### 2. Testing User

1. Login menggunakan akun user atau register user baru.
2. Copy token dari response login.
3. Gunakan token sebagai Bearer Token.
4. Test endpoint:

   * `GET /hotels`
   * `GET /hotels/{id}`
   * `GET /hotels/{id}/rooms`
   * `POST /user/booking`
   * `GET /user/booking-history`
   * `POST /user/pay/{id}`
   * `POST /user/checkout/{id}`
   * `POST /user/ratings`

---

### 3. Testing Receptionist

1. Login menggunakan akun receptionist.
2. Copy token dari response login.
3. Gunakan token sebagai Bearer Token.
4. Test endpoint:

   * `GET /receptionist/bookings`
   * `POST /receptionist/confirm-booking`
   * `POST /receptionist/check-in`
   * `POST /receptionist/decline-booking`
   * `POST /receptionist/update-room-status`

---

## Troubleshooting

### Dependency belum terinstall

Jalankan:

```bash
composer install
```

---

### APP_KEY kosong

Jalankan:

```bash
php artisan key:generate
```

---

### Gambar tidak tampil

Jalankan:

```bash
php artisan storage:link
```

---

### Database error

Pastikan konfigurasi `.env` sudah benar:

```env
DB_CONNECTION=pgsql
DB_DATABASE=restify
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
```

Pastikan juga file `restify_database.sql` sudah berhasil di-import ke database `restify`.

---

### Endpoint protected gagal diakses

Pastikan request menggunakan header:

```text
Authorization: Bearer {token}
Accept: application/json
```

---

### Akses ditolak

Pastikan akun yang digunakan memiliki role yang sesuai.

Contoh:

* Endpoint `/admin/...` hanya untuk role `admin`.
* Endpoint `/user/...` hanya untuk role `user`.
* Endpoint `/receptionist/...` hanya untuk role `receptionist`.

---

### Scheduler tidak berjalan

Jalankan:

```bash
php artisan schedule:work
```

Scheduler diperlukan untuk menjalankan proses auto cancel expired booking.

---

## Checklist Pengumpulan

Sebelum dikumpulkan, pastikan:

* Source code sudah paling update.
* Branch `backend` sudah dipush ke GitHub.
* File `.env` tidak ikut commit.
* Folder `vendor/` tidak ikut commit.
* Folder `node_modules/` tidak ikut commit.
* Folder `build/` tidak ikut commit.
* File testing lokal seperti `public/test-midtrans.html` tidak ikut commit.
* File `.env.example` tersedia.
* File `restify_database.sql` tersedia.
* File Postman collection tersedia di folder `postman/`.
* Database dapat di-import tanpa error.
* README sudah berisi konfigurasi aplikasi.
* README sudah berisi akun testing untuk setiap role.
* README sudah berisi endpoint penting.
* Project dapat dijalankan menggunakan `php artisan serve`.

---

## Catatan Pengumpulan

Project dikumpulkan tanpa folder dependency seperti:

* `vendor/`
* `node_modules/`
* `build/`

Project juga tidak menyertakan file rahasia seperti:

* `.env`

Database PostgreSQL sudah diexport dalam file:

```text
restify_database.sql
```

Postman collection tersedia dalam folder:

```text
postman/
```

Akun testing per role sudah dicantumkan pada bagian **Akun Testing**.
