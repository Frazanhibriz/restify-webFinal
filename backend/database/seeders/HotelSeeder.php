<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = [

            /*
            |--------------------------------------------------------------------------
            | BANDUNG HOTELS
            |--------------------------------------------------------------------------
            */

            [
                'name' => 'Flores Gallery Hotel',
                'address' => 'Jl. Flores No.7, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
                'city' => 'Bandung',
                'latitude' => -6.9080704,
                'longitude' => 107.6131024,
                'description' => 'Hotel artistik bintang 3 dengan banyak lukisan, suasana nyaman, dan fasilitas lengkap di pusat Bandung.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Restaurant', 'Parking Area', 'Gym'],
                'image' => 'hotels/flores-hotel.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'eL Hotel Bandung',
                'address' => 'Jl. Merdeka No.2, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111',
                'city' => 'Bandung',
                'latitude' => -6.9161116,
                'longitude' => 107.6080445,
                'description' => 'Hotel modern di pusat kota Bandung dengan akses strategis ke kawasan Braga dan pusat perbelanjaan.',
                'facilities' => ['Wifi', 'Spa', 'Cafe', 'Meeting Room', '24 Hours Front Desk'],
                'image' => 'hotels/elhotel-bandung.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Puteri Gunung Hotel',
                'address' => 'Jl. Tangkuban Perahu No.10, Lembang, Kabupaten Bandung Barat, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.813201,
                'longitude' => 107.617102,
                'description' => 'Hotel bernuansa alam dengan pemandangan pegunungan dan udara sejuk khas Lembang.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Taman', 'Restaurant', 'Area Bermain'],
                'image' => 'hotels/puteri-gunung.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Grand Restify Hotel',
                'address' => 'Jl. Sudirman No.1, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.917500,
                'longitude' => 107.619100,
                'description' => 'Hotel bintang lima dengan layanan premium, kamar luas, dan fasilitas lengkap untuk bisnis maupun liburan.',
                'facilities' => ['Wifi', 'Gym', 'Spa', 'Restaurant', 'Ballroom'],
                'image' => 'hotels/grand-restify.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Braga Heritage Hotel',
                'address' => 'Jl. Braga No.45, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.917800,
                'longitude' => 107.609900,
                'description' => 'Hotel klasik di kawasan Braga dengan desain heritage dan akses dekat ke tempat wisata sejarah.',
                'facilities' => ['Wifi', 'Cafe', 'Restaurant', 'Parking Area', 'Laundry'],
                'image' => 'hotels/braga-heritage.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Dago Hills Resort',
                'address' => 'Jl. Dago Atas No.88, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.865400,
                'longitude' => 107.618700,
                'description' => 'Resort nyaman dengan suasana sejuk khas Dago, cocok untuk keluarga dan wisata akhir pekan.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Garden View', 'Restaurant', 'Jogging Track'],
                'image' => 'hotels/dago-hills.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Lembang View Hotel',
                'address' => 'Jl. Raya Lembang No.21, Bandung Barat, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.811200,
                'longitude' => 107.617500,
                'description' => 'Hotel keluarga dengan pemandangan alam Lembang dan fasilitas ramah anak.',
                'facilities' => ['Wifi', 'Playground', 'Restaurant', 'Parking Area', 'Breakfast'],
                'image' => 'hotels/lembang-view.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Cihampelas Urban Hotel',
                'address' => 'Jl. Cihampelas No.120, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.893900,
                'longitude' => 107.604700,
                'description' => 'Hotel urban dekat pusat belanja, kuliner, dan destinasi wisata populer di Bandung.',
                'facilities' => ['Wifi', 'Cafe', 'Laundry', 'Parking Area', '24 Hours Front Desk'],
                'image' => 'hotels/cihampelas-urban.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Asia Afrika Hotel',
                'address' => 'Jl. Asia Afrika No.75, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.921700,
                'longitude' => 107.607100,
                'description' => 'Hotel strategis dekat kawasan wisata sejarah, museum, dan pusat kota Bandung.',
                'facilities' => ['Wifi', 'Restaurant', 'Meeting Room', 'Parking Area', 'Room Service'],
                'image' => 'hotels/asia-afrika.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Setiabudi Garden Hotel',
                'address' => 'Jl. Setiabudi No.99, Bandung, Jawa Barat',
                'city' => 'Bandung',
                'latitude' => -6.874900,
                'longitude' => 107.594500,
                'description' => 'Hotel nyaman dengan taman luas, suasana tenang, dan cocok untuk liburan keluarga.',
                'facilities' => ['Wifi', 'Garden', 'Restaurant', 'Parking Area', 'Breakfast'],
                'image' => 'hotels/setiabudi-garden.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'The Trans Luxury Hotel',
                'address' => 'Jl. Gatot Subroto No.289, Cibangkong, Kec. Batununggal, Kota Bandung, Jawa Barat 40273',
                'city' => 'Bandung',
                'latitude' => -6.925800,
                'longitude' => 107.636900,
                'description' => 'Hotel bintang 5 kelas dunia di Bandung dengan pelayanan mewah, dekat dengan Trans Studio Mall.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Gym', 'Spa', 'Restaurant', 'Parking Area'],
                'image' => 'images/HotelImages/The-Trans-Luxury-Hotel.jpeg',
                'qris_image' => null,
            ],

            [
                'name' => 'Hilton Hotel Bandung',
                'address' => 'Jl. H.O.S. Cokroaminoto No.41-43, Arjuna, Kec. Cicendo, Kota Bandung, Jawa Barat 40172',
                'city' => 'Bandung',
                'latitude' => -6.913300,
                'longitude' => 107.599000,
                'description' => 'Hotel modern nan elegan dengan kolam renang outdoor yang luas dan pelayanan bintang 5 di pusat Kota Bandung.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Gym', 'Restaurant', 'Meeting Room'],
                'image' => 'images/HotelImages/Hilton-Bandung.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Hotel Savoy Homann Bandung',
                'address' => 'Jl. Asia Afrika No.112, Cikawao, Kec. Lengkong, Kota Bandung, Jawa Barat 40261',
                'city' => 'Bandung',
                'latitude' => -6.921300,
                'longitude' => 107.610800,
                'description' => 'Hotel legendaris dengan desain art-deco bersejarah di Jalan Asia Afrika, tempat menginap para tokoh Konferensi Asia Afrika.',
                'facilities' => ['Wifi', 'Restaurant', 'Cafe', 'Parking Area', 'Laundry'],
                'image' => 'images/HotelImages/Hotel-Savoy-Homann-Bandung.jpg',
                'qris_image' => null,
            ],



            /*
            |--------------------------------------------------------------------------
            | JAKARTA HOTELS
            |--------------------------------------------------------------------------
            */

            [
                'name' => 'Menteng City Hotel',
                'address' => 'Jl. HOS Cokroaminoto No.45, Menteng, Jakarta Pusat, DKI Jakarta',
                'city' => 'Jakarta',
                'latitude' => -6.195500,
                'longitude' => 106.832600,
                'description' => 'Hotel bisnis di kawasan Menteng dengan akses mudah ke pusat perkantoran dan area kuliner.',
                'facilities' => ['Wifi', 'Restaurant', 'Meeting Room', 'Parking Area', 'Room Service'],
                'image' => 'hotels/menteng-city.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Sudirman Executive Hotel',
                'address' => 'Jl. Jenderal Sudirman No.10, Jakarta Pusat, DKI Jakarta',
                'city' => 'Jakarta',
                'latitude' => -6.214600,
                'longitude' => 106.821900,
                'description' => 'Hotel eksekutif di kawasan bisnis Sudirman dengan fasilitas modern untuk perjalanan bisnis.',
                'facilities' => ['Wifi', 'Gym', 'Business Center', 'Restaurant', 'Meeting Room'],
                'image' => 'hotels/sudirman-executive.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Kemang Boutique Hotel',
                'address' => 'Jl. Kemang Raya No.25, Jakarta Selatan, DKI Jakarta',
                'city' => 'Jakarta',
                'latitude' => -6.260700,
                'longitude' => 106.814900,
                'description' => 'Hotel boutique dengan desain modern dan suasana santai di kawasan Kemang.',
                'facilities' => ['Wifi', 'Cafe', 'Swimming Pool', 'Restaurant', 'Laundry'],
                'image' => 'hotels/kemang-boutique.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Ancol Seaside Hotel',
                'address' => 'Jl. Lodan Timur No.7, Ancol, Jakarta Utara, DKI Jakarta',
                'city' => 'Jakarta',
                'latitude' => -6.122300,
                'longitude' => 106.836700,
                'description' => 'Hotel dekat kawasan wisata Ancol dengan suasana tepi laut dan fasilitas keluarga.',
                'facilities' => ['Wifi', 'Sea View', 'Swimming Pool', 'Restaurant', 'Kids Area'],
                'image' => 'hotels/ancol-seaside.jpg',
                'qris_image' => null,
            ],

            [
                'name' => 'Kuningan Grand Hotel',
                'address' => 'Jl. HR Rasuna Said No.88, Kuningan, Jakarta Selatan, DKI Jakarta',
                'city' => 'Jakarta',
                'latitude' => -6.223900,
                'longitude' => 106.832900,
                'description' => 'Hotel premium di kawasan Kuningan dengan fasilitas lengkap untuk bisnis dan liburan.',
                'facilities' => ['Wifi', 'Spa', 'Gym', 'Restaurant', 'Ballroom'],
                'image' => 'hotels/kuningan-grand.jpg',
                'qris_image' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | BALI HOTELS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Ayana Resort Bali',
                'address' => 'Jl. Karang Mas Sejahtera, Jimbaran, Kec. Kuta Selatan, Kabupaten Badung, Bali 80364',
                'city' => 'Bali',
                'latitude' => -8.766300,
                'longitude' => 115.148100,
                'description' => 'Resort mewah di atas tebing Jimbaran dengan pemandangan sunset Samudra Hindia yang spektakuler.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Gym', 'Spa', 'Private Beach', 'Restaurant'],
                'image' => 'hotels/ayana-resort.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'The Seminyak Beach Resort',
                'address' => 'Jl. Kayu Aya, Seminyak Beach, Kuta, Kabupaten Badung, Bali 80361',
                'city' => 'Bali',
                'latitude' => -8.690800,
                'longitude' => 115.150800,
                'description' => 'Resort bintang 5 tepi pantai di Seminyak yang menawarkan kemewahan modern dan pemandangan laut indah.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Restaurant', 'Spa', 'Bar', 'Beach Access'],
                'image' => 'hotels/seminyak-beach.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Ubud Hanging Gardens',
                'address' => 'Banjar Susut, Desa Buahan, Kec. Payangan, Kabupaten Gianyar, Bali 80572',
                'city' => 'Bali',
                'latitude' => -8.401200,
                'longitude' => 115.263500,
                'description' => 'Resort tersembunyi di hutan Ubud dengan kolam renang infinity bertingkat ikonik di tengah lembah hijau.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Taman', 'Spa', 'Restaurant', 'Jungle View'],
                'image' => 'hotels/hanging-gardens.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Nusa Dua Beach Hotel',
                'address' => 'Kawasan Pariwisata Nusa Dua Lot North 4, Nusa Dua, Bali 80363',
                'city' => 'Bali',
                'latitude' => -8.796300,
                'longitude' => 115.231500,
                'description' => 'Hotel bergaya istana Bali dengan akses langsung ke pantai berpasir putih Nusa Dua yang tenang.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Playground', 'Gym', 'Restaurant', 'Tennis Court'],
                'image' => 'hotels/nusa-dua-beach.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Kuta Heritage Hotel',
                'address' => 'Jl. Pantai Kuta, Kuta, Kabupaten Badung, Bali 80361',
                'city' => 'Bali',
                'latitude' => -8.722400,
                'longitude' => 115.169800,
                'description' => 'Hotel butik berkonsep selancar retro-modern di seberang Pantai Kuta, ideal untuk liburan berjiwa muda.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Rooftop Bar', 'Restaurant', 'Gym'],
                'image' => 'hotels/kuta-heritage.jpg',
                'qris_image' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | YOGYAKARTA HOTELS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'The Phoenix Hotel Yogyakarta',
                'address' => 'Jl. Jend. Sudirman No.9, Cokrodiningratan, Kec. Jetis, Kota Yogyakarta, DIY 55233',
                'city' => 'Yogyakarta',
                'latitude' => -7.782800,
                'longitude' => 110.368800,
                'description' => 'Hotel butik bernuansa warisan kolonial dan Jawa klasik yang elegan di jantung kota Yogyakarta.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Gym', 'Spa', 'Restaurant', 'Meeting Room'],
                'image' => 'hotels/phoenix-yogyakarta.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Amanjiwo Resort',
                'address' => 'Ds. Majaksingi, Borobudur, Magelang, Jawa Tengah (Area Yogyakarta)',
                'city' => 'Yogyakarta',
                'latitude' => -7.618600,
                'longitude' => 110.198900,
                'description' => 'Resort ultra-mewah berdesain candi batu dengan pemandangan langsung ke Candi Borobudur dan Bukit Menoreh.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Spa', 'Restaurant', 'Library', 'Private Tour'],
                'image' => 'hotels/amanjiwo.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Hyatt Regency Yogyakarta',
                'address' => 'Jl. Palagan Tentara Pelajar, Sariharjo, Kec. Ngaglik, Kabupaten Sleman, DIY 55581',
                'city' => 'Yogyakarta',
                'latitude' => -7.737100,
                'longitude' => 110.373700,
                'description' => 'Resort megah seluas 22 hektar dengan lapangan golf 9-hole, taman tropis rindang, dan kolam renang bernuansa candi.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Golf Course', 'Gym', 'Restaurant', 'Tennis Court'],
                'image' => 'hotels/hyatt-regency.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Grand Ambarrukmo Yogyakarta',
                'address' => 'Jl. Laksda Adisucipto No.82, Ambarukmo, Caturtunggal, Depok, Sleman, DIY 55281',
                'city' => 'Yogyakarta',
                'latitude' => -7.782500,
                'longitude' => 110.400500,
                'description' => 'Hotel modern bintang 4 yang berlokasi strategis di depan Plaza Ambarrukmo dengan fasilitas lengkap.',
                'facilities' => ['Wifi', 'Kolam Renang', 'Gym', 'Restaurant', 'Lounge', 'Sky Bar'],
                'image' => 'hotels/grand-ambarrukmo.jpg',
                'qris_image' => null,
            ],
            [
                'name' => 'Malioboro Heritage Hotel',
                'address' => 'Jl. Malioboro No.60, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
                'city' => 'Yogyakarta',
                'latitude' => -7.794200,
                'longitude' => 110.365700,
                'description' => 'Hotel butik bernuansa vintage Jawa-Kolonial dengan akses berjalan kaki ke Jalan Malioboro dan Stasiun Tugu.',
                'facilities' => ['Wifi', 'Cafe', 'Restaurant', 'Parking Area', '24 Hours Front Desk'],
                'image' => 'hotels/malioboro-heritage.jpg',
                'qris_image' => null,
            ],

        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}