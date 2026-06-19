<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = Hotel::all();

        foreach ($hotels as $hotel) {

            /*
            |--------------------------------------------------------------------------
            | BANDUNG HOTELS
            |--------------------------------------------------------------------------
            | 2 type room
            | setiap type punya 2 room
            */

            if ($hotel->city === 'Bandung') {
                if ($hotel->name === 'The Trans Luxury Hotel') {
                    // Type 1: Premier Room
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Premier Room',
                        'price' => 1850000,
                        'status' => 'available',
                        'capacity' => 2,
                        'description' => 'Kamar premium dengan pemandangan kota Bandung yang menakjubkan dan fasilitas bintang lima.',
                        'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Mini Bar'],
                        'image' => 'rooms/premier-room.jpg',
                    ]);

                    // Type 2: Presidential Suite
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Presidential Suite',
                        'price' => 3500000,
                        'status' => 'available',
                        'capacity' => 4,
                        'description' => 'Suite termewah dengan ruang tamu pribadi, fasilitas premium, dan pelayanan eksklusif.',
                        'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Jacuzzi', 'Breakfast', 'Kitchenette'],
                        'image' => 'rooms/presidential-suite.jpg',
                    ]);
                } else if ($hotel->name === 'Hilton Hotel Bandung') {
                    // Type 1: Deluxe King Room
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Deluxe King Room',
                        'price' => 1250000,
                        'status' => 'available',
                        'capacity' => 2,
                        'description' => 'Kamar deluxe yang luas dengan ranjang King size super nyaman dan interior elegan.',
                        'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Work Desk'],
                        'image' => 'rooms/deluxe-king.jpg',
                    ]);

                    // Type 2: Executive Suite
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Executive Suite',
                        'price' => 2100000,
                        'status' => 'available',
                        'capacity' => 3,
                        'description' => 'Suite eksekutif dengan akses ke club lounge, ruang tamu terpisah, dan kamar mandi marmer mewah.',
                        'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Executive Lounge Access'],
                        'image' => 'rooms/executive-suite.jpg',
                    ]);
                } else if ($hotel->name === 'Hotel Savoy Homann Bandung') {
                    // Type 1: Homann Executive Room
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Homann Executive Room',
                        'price' => 850000,
                        'status' => 'available',
                        'capacity' => 2,
                        'description' => 'Kamar bergaya art-deco klasik dengan sentuhan modern untuk kenyamanan ekstra selama menginap.',
                        'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Coffee Maker'],
                        'image' => 'rooms/homann-executive.jpg',
                    ]);

                    // Type 2: Homann Suite
                    Room::create([
                        'hotel_id' => $hotel->id,
                        'room_type' => 'Homann Suite',
                        'price' => 1450000,
                        'status' => 'available',
                        'capacity' => 3,
                        'description' => 'Suite luas bersejarah dengan ornamen klasik art-deco yang elegan dan ruang duduk terpisah.',
                        'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Sofa Bed'],
                        'image' => 'rooms/homann-suite.jpg',
                    ]);
                } else {
                    $prices = [
                        'Flores Gallery Hotel' => ['deluxe' => 450000, 'superior' => 650000],
                        'eL Hotel Bandung' => ['deluxe' => 600000, 'superior' => 800000],
                        'Puteri Gunung Hotel' => ['deluxe' => 720000, 'superior' => 950000],
                        'Grand Restify Hotel' => ['deluxe' => 900000, 'superior' => 1200000],
                        'Braga Heritage Hotel' => ['deluxe' => 550000, 'superior' => 750000],
                        'Dago Hills Resort' => ['deluxe' => 850000, 'superior' => 1100000],
                        'Lembang View Hotel' => ['deluxe' => 500000, 'superior' => 700000],
                        'Cihampelas Urban Hotel' => ['deluxe' => 400000, 'superior' => 550000],
                        'Asia Afrika Hotel' => ['deluxe' => 480000, 'superior' => 680000],
                        'Setiabudi Garden Hotel' => ['deluxe' => 650000, 'superior' => 850000],
                    ];

                    $hotelPrices = $prices[$hotel->name] ?? ['deluxe' => 750000, 'superior' => 950000];

                    // Type 1: Deluxe Room, 2 kamar
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Deluxe Room',
                            'price' => $hotelPrices['deluxe'],
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar deluxe nyaman dengan fasilitas lengkap untuk tamu yang menginginkan kenyamanan standar premium.',
                            'facilities' => [
                                'AC',
                                'Wifi',
                                'Smart TV',
                                'Hot Water',
                                'Breakfast'
                            ],
                            'image' => 'rooms/deluxe-room.jpg',
                        ]);
                    }

                    // Type 2: Superior Room, 2 kamar
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Superior Room',
                            'price' => $hotelPrices['superior'],
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Kamar superior dengan ruang lebih luas dan fasilitas premium untuk keluarga atau perjalanan bisnis.',
                            'facilities' => [
                                'AC',
                                'Wifi',
                                'Netflix TV',
                                'Mini Bar',
                                'Bathtub'
                            ],
                            'image' => 'rooms/superior-room.jpg',
                        ]);
                    }
                }
            }


            /*
            |--------------------------------------------------------------------------
            | JAKARTA HOTELS
            |--------------------------------------------------------------------------
            | 3 type room
            | setiap type punya 1 room
            */

            if ($hotel->city === 'Jakarta') {
                $jakartaPrices = [
                    'Menteng City Hotel' => ['standard' => 550000, 'deluxe' => 800000, 'executive' => 1150000],
                    'Sudirman Executive Hotel' => ['standard' => 750000, 'deluxe' => 1050000, 'executive' => 1450000],
                    'Kemang Boutique Hotel' => ['standard' => 600000, 'deluxe' => 850000, 'executive' => 1200000],
                    'Ancol Seaside Hotel' => ['standard' => 680000, 'deluxe' => 950000, 'executive' => 1300000],
                    'Kuningan Grand Hotel' => ['standard' => 800000, 'deluxe' => 1100000, 'executive' => 1500000],
                ];

                $prices = $jakartaPrices[$hotel->name] ?? ['standard' => 650000, 'deluxe' => 900000, 'executive' => 1250000];

                // Type 1: Standard Room, 1 kamar
                Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => 'Standard Room',
                    'price' => $prices['standard'],
                    'status' => 'available',
                    'capacity' => 2,
                    'description' => 'Kamar standard yang nyaman untuk tamu bisnis maupun wisatawan dengan fasilitas dasar lengkap.',
                    'facilities' => [
                        'AC',
                        'Wifi',
                        'TV',
                        'Hot Water'
                    ],
                    'image' => 'rooms/standard-room.jpg',
                ]);

                // Type 2: Deluxe Room, 1 kamar
                Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => 'Deluxe Room',
                    'price' => $prices['deluxe'],
                    'status' => 'available',
                    'capacity' => 2,
                    'description' => 'Kamar deluxe modern dengan fasilitas lebih lengkap dan suasana nyaman di pusat kota.',
                    'facilities' => [
                        'AC',
                        'Wifi',
                        'Smart TV',
                        'Breakfast',
                        'Work Desk'
                    ],
                    'image' => 'rooms/deluxe-room.jpg',
                ]);

                // Type 3: Executive Room, 1 kamar
                Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => 'Executive Room',
                    'price' => $prices['executive'],
                    'status' => 'available',
                    'capacity' => 3,
                    'description' => 'Kamar executive dengan fasilitas premium untuk kebutuhan bisnis dan pengalaman menginap yang lebih eksklusif.',
                    'facilities' => [
                        'AC',
                        'Wifi',
                        'Netflix TV',
                        'Mini Bar',
                        'Bathtub',
                        'City View'
                    ],
                ]);
            }

            if ($hotel->city === 'Bali') {
                if ($hotel->name === 'Ayana Resort Bali') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Ocean View Suite',
                            'price' => 3200000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Suite mewah dengan pemandangan Samudra Hindia yang memukau langsung dari kamar Anda.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Mini Bar', 'Ocean View'],
                            'image' => 'rooms/premier-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Cliff Pool Villa',
                            'price' => 5500000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Villa eksklusif di atas tebing dengan kolam renang pribadi dan akses premium.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Jacuzzi', 'Breakfast', 'Private Pool'],
                            'image' => 'rooms/presidential-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'The Seminyak Beach Resort') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Beach Room',
                            'price' => 2100000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar modern dengan pemandangan taman tropis dan akses mudah langsung ke pantai Seminyak.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Work Desk'],
                            'image' => 'rooms/deluxe-king.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Ocean Suite',
                            'price' => 3800000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Suite pantai mewah dengan teras pribadi menghadap langsung ke deburan ombak pantai Seminyak.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Sea View'],
                            'image' => 'rooms/executive-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Ubud Hanging Gardens') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Riverside Villa',
                            'price' => 2800000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Villa pribadi di tepian sungai Ayung dengan dikelilingi hutan hujan Ubud yang asri.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Jungle View'],
                            'image' => 'rooms/homann-suite.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Panoramic Pool Villa',
                            'price' => 4200000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Villa mewah dengan kolam renang infinity pribadi yang menyuguhkan pemandangan lembah Ubud.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Private Pool'],
                            'image' => 'rooms/presidential-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Nusa Dua Beach Hotel') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Deluxe Room Bali',
                            'price' => 1350000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar deluxe bernuansa tradisional Bali yang hangat dengan pemandangan taman tropis.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast'],
                            'image' => 'rooms/deluxe-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Palace Club Room',
                            'price' => 2250000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Kamar premium dengan ornamen mewah, akses eksklusif ke Palace Club lounge dan layanan butler.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Club Access'],
                            'image' => 'rooms/homann-executive.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Kuta Heritage Hotel') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Superior Heritage',
                            'price' => 650000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar nyaman bernuansa bahari dengan fasilitas modern lengkap di pusat keramaian Kuta.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast'],
                            'image' => 'rooms/standard-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Deluxe Heritage',
                            'price' => 850000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar deluxe yang modern dan luas dengan desain bertema selancar yang artistik.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Breakfast'],
                            'image' => 'rooms/deluxe-room.jpg',
                        ]);
                    }
                }
            }

            if ($hotel->city === 'Yogyakarta') {
                if ($hotel->name === 'The Phoenix Hotel Yogyakarta') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Legacy Deluxe',
                            'price' => 1050000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar klasik bergaya kolonial-Jawa dengan pemandangan kolam renang yang menawan.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Heritage Style'],
                            'image' => 'rooms/homann-executive.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Phoenix Suite',
                            'price' => 1950000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Suite megah dengan perpaduan dekorasi klasik timur dan barat, ruang santai luas, dan fasilitas premium.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Living Area'],
                            'image' => 'rooms/homann-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Amanjiwo Resort') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Garden Pool Suite',
                            'price' => 4800000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Suite pribadi dengan taman asri, kolam renang pribadi, dan pemandangan persawahan Borobudur.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Private Pool', 'Borobudur View'],
                            'image' => 'rooms/premier-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Borobudur Suite',
                            'price' => 6500000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Suite paling mewah dengan kubah batu, pemandangan langsung ke stupa Candi Borobudur, dan pelayanan eksklusif.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Butler Service'],
                            'image' => 'rooms/presidential-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Hyatt Regency Yogyakarta') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Regency Garden',
                            'price' => 1150000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar modern dengan pemandangan taman tropis dan lapangan golf Hyatt yang luas.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast', 'Garden View'],
                            'image' => 'rooms/deluxe-king.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Regency Suite',
                            'price' => 2300000,
                            'status' => 'available',
                            'capacity' => 3,
                            'description' => 'Suite mewah dengan balkon pribadi menghadap ke Gunung Merapi dan lapangan golf.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Bathtub', 'Breakfast', 'Golf View'],
                            'image' => 'rooms/executive-suite.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Grand Ambarrukmo Yogyakarta') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Deluxe Ambarrukmo',
                            'price' => 780000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar deluxe bergaya kontemporer yang nyaman dengan fasilitas bisnis lengkap.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water', 'Breakfast'],
                            'image' => 'rooms/deluxe-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Grand Deluxe',
                            'price' => 980000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar grand deluxe dengan area duduk lebih luas dan desain minimalis modern.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Mini Bar', 'Breakfast'],
                            'image' => 'rooms/superior-room.jpg',
                        ]);
                    }
                } else if ($hotel->name === 'Malioboro Heritage Hotel') {
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Standard Malioboro',
                            'price' => 480000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar standard yang nyaman dan bersih di pusat kota Yogyakarta, sangat dekat dengan jalan Malioboro.',
                            'facilities' => ['AC', 'Wifi', 'Smart TV', 'Hot Water'],
                            'image' => 'rooms/standard-room.jpg',
                        ]);
                    }
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Superior Malioboro',
                            'price' => 580000,
                            'status' => 'available',
                            'capacity' => 2,
                            'description' => 'Kamar superior dengan fasilitas lebih lengkap dan desain klasik vintage Jawa.',
                            'facilities' => ['AC', 'Wifi', 'Netflix TV', 'Breakfast'],
                            'image' => 'rooms/superior-room.jpg',
                        ]);
                    }
                }
            }
        }
    }
}