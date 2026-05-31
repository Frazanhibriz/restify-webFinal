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
        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}