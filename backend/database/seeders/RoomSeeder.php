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


            /*
            |--------------------------------------------------------------------------
            | JAKARTA HOTELS
            |--------------------------------------------------------------------------
            | 3 type room
            | setiap type punya 1 room
            */

            if ($hotel->city === 'Jakarta') {

                
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