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
                    // Type 1: Deluxe Room, 2 kamar
                    for ($i = 1; $i <= 2; $i++) {
                        Room::create([
                            'hotel_id' => $hotel->id,
                            'room_type' => 'Deluxe Room',
                            'price' => 750000,
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
                            'price' => 950000,
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

                // Type 1: Standard Room, 1 kamar
                Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => 'Standard Room',
                    'price' => 650000,
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
                    'price' => 900000,
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
                    'price' => 1250000,
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
                    'image' => 'rooms/executive-room.jpg',
                ]);
            }
        }
    }
}