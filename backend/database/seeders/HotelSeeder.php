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
                'description' => 'Hotel artistik bintang 3 di pusat kota Bandung. Lokasi strategis dekat Citarum dan pusat belanja, menawarkan kenyamanan luar biasa dengan harga murah terjangkau.',
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
                'description' => 'Hotel modern bintang 4 di pusat kota Bandung dekat Jalan Braga, Stasiun Bandung, dan area perkantoran. Pilihan strategis yang mewah namun dengan harga bersahabat.',
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
                'description' => 'Resort bernuansa alam tenang dan asri dengan pemandangan pegunungan hijau di Lembang Bandung. Udara dingin sejuk, sangat cocok untuk healing dan liburan keluarga dari hiruk-pikuk kota.',
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
                'description' => 'Hotel bintang 5 ultra-mewah dengan layanan premium di pusat kota Bandung, Jalan Sudirman. Memiliki kamar sangat luas, ballroom megah, dan fasilitas bisnis/liburan terlengkap.',
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
                'description' => 'Hotel klasik bergaya kolonial-heritage di sepanjang Jalan Braga Bandung. Dekat pusat kuliner, kafe estetik, pusat belanja, dan tempat wisata bersejarah kota Bandung.',
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
                'description' => 'Resort keluarga yang sejuk di kawasan Dago Atas Bandung. Menawarkan pemandangan kota Bandung yang indah dari ketinggian (city view) dan suasana pegunungan yang asri.',
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
                'description' => 'Hotel keluarga ramah anak dengan pemandangan alam pegunungan Lembang Bandung yang indah, sejuk, dan dekat ke tempat wisata lokal populer.',
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
                'description' => 'Hotel murah berkualitas di sepanjang Jalan Cihampelas Bandung. Sangat dekat dengan pusat belanja busana, Cihampelas Walk (Ciwalk), dan pusat kuliner malam.',
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
                'description' => 'Hotel murah strategis di pusat kota Bandung dekat Jalan Asia Afrika, Alun-alun Bandung, Gedung Merdeka, dan Stasiun Bandung.',
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
                'description' => 'Hotel nyaman dengan konsep taman hijau luas yang tenang dan nyaman di kawasan Setiabudi Bandung, dekat dengan jalur ke Lembang.',
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
                'description' => 'Hotel bintang 5 premium termegah di pusat kota Bandung, tersambung langsung dengan Trans Studio Mall (TSM) dan taman hiburan Trans Studio Bandung.',
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
                'description' => 'Hotel bintang 5 mewah modern dengan desain elegan dan kolam renang outdoor luas di pusat kota Bandung, sangat dekat dari Stasiun Bandung Pintu Utara.',
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
                'description' => 'Hotel bintang 4 legendaris dengan arsitektur art-deco bersejarah di Jalan Asia Afrika pusat kota Bandung, saksi bisu Konferensi Asia Afrika.',
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
                'description' => 'Hotel bisnis bintang 3 di kawasan elit Menteng Jakarta Pusat. Akses mudah ke Monas, Stasiun Gondangdia, dan perkantoran Thamrin dengan harga hemat.',
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
                'description' => 'Hotel eksekutif premium di sepanjang Jalan Jenderal Sudirman Jakarta Pusat. Dirancang khusus untuk pelaku bisnis dengan akses stasiun MRT dan perkantoran Sudirman.',
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
                'description' => 'Hotel butik dengan desain modern dan suasana santai di pusat kuliner dan hiburan malam Kemang Jakarta Selatan, cocok untuk staycation anak muda.',
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
                'description' => 'Hotel rekreasi tepi pantai di kawasan Taman Impian Jaya Ancol Jakarta Utara. Dekat dengan Dunia Fantasi (Dufan), Sea World, dan pantai pasir putih Ancol.',
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
                'description' => 'Hotel bisnis modern bintang 4 di kawasan Segitiga Emas Kuningan Jakarta Selatan, dekat pusat perbelanjaan Lotte Avenue dan pusat perkantoran Rasuna Said.',
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
                'description' => 'Resort bintang 5 ultra-mewah di atas tebing pantai Jimbaran Bali. Menawarkan akses pantai pribadi, kolam renang infinity kelas dunia, dan pemandangan sunset Samudra Hindia yang spektakuler.',
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
                'description' => 'Resort bintang 5 persis di tepi pantai Seminyak Bali. Terkenal dengan pemandangan laut yang indah, akses langsung ke pantai pasir putih, dan dekat dengan klub pantai populer.',
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
                'description' => 'Resort bintang 5 eksotis tersembunyi di tengah hutan tropis Ubud Bali. Memiliki kolam renang infinity bertingkat ikonik dengan suasana pegunungan dan sungai yang sangat sunyi dan tenang.',
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
                'description' => 'Hotel resort legendaris bergaya istana klasik Bali di tepi pantai Nusa Dua. Area pantai pasir putih yang tenang, sangat aman untuk anak-anak dan liburan keluarga.',
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
                'description' => 'Hotel butik berkonsep selancar retro-modern tepat di seberang Pantai Kuta Bali. Sangat dekat dengan Beachwalk Mall dan pusat hiburan malam Kuta dengan harga bersahabat.',
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
                'description' => 'Hotel butik bintang 5 bernuansa warisan kolonial dan Jawa klasik mewah yang elegan di jantung kota Yogyakarta, dekat dengan Tugu Jogja dan Jalan Malioboro.',
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
                'description' => 'Resort ultra-mewah sunyi berarsitektur candi batu di Borobudur dekat Yogyakarta. Menawarkan pemandangan langsung Candi Borobudur, sawah hijau, dan Bukit Menoreh untuk ketenangan spiritual.',
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
                'description' => 'Resort bintang 5 dengan nuansa candi kuno di Sleman Yogyakarta. Memiliki lapangan golf 9-hole, taman tropis rindang seluas 22 hektar, dan kolam renang dengan seluncuran air.',
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
                'description' => 'Hotel modern bintang 4 di Yogyakarta, terletak persis di seberang Plaza Ambarrukmo (Ambarrukmo Plaza). Akses mudah ke bandara, stasiun, dan pusat kota.',
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
                'description' => 'Hotel butik bergaya vintage Jawa-Kolonial di sepanjang Jalan Malioboro Yogyakarta. Sangat dekat dengan Stasiun Tugu Jogja dan Pasar Beringharjo, menawarkan harga murah dan terjangkau.',
                'facilities' => ['Wifi', 'Cafe', 'Restaurant', 'Parking Area', '24 Hours Front Desk'],
                'image' => 'hotels/malioboro-heritage.jpg',
                'qris_image' => null,
            ],

        ];

        foreach ($hotels as $hotel) {
            Hotel::updateOrCreate(
                ['name' => $hotel['name']],
                [
                    'address' => $hotel['address'],
                    'city' => $hotel['city'],
                    'latitude' => $hotel['latitude'],
                    'longitude' => $hotel['longitude'],
                    'description' => $hotel['description'],
                    'facilities' => $hotel['facilities'],
                    'image' => $hotel['image'],
                    'qris_image' => $hotel['qris_image'],
                ]
            );
        }
    }
}