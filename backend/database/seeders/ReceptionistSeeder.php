<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Hotel;
use Illuminate\Support\Facades\Hash;

class ReceptionistSeeder extends Seeder
{
    public function run(): void
    {
        $receptionists = [
            
            'Flores Gallery Hotel' => [
                'name' => 'Receptionist Flores Gallery',
                'email' => 'receptionist.flores@gmail.com',
            ],

            'eL Hotel Bandung' => [
                'name' => 'Receptionist eL Hotel',
                'email' => 'receptionist.elhotel@gmail.com',
            ],

            'Puteri Gunung Hotel' => [
                'name' => 'Receptionist Puteri Gunung',
                'email' => 'receptionist.puterigunung@gmail.com',
            ],

            'Grand Restify Hotel' => [
                'name' => 'Receptionist Grand Restify',
                'email' => 'receptionist.grandrestify@gmail.com',
            ],

            'Braga Heritage Hotel' => [
                'name' => 'Receptionist Braga Heritage',
                'email' => 'receptionist.braga@gmail.com',
            ],

            'Dago Hills Resort' => [
                'name' => 'Receptionist Dago Hills',
                'email' => 'receptionist.dagohills@gmail.com',
            ],

            'Lembang View Hotel' => [
                'name' => 'Receptionist Lembang View',
                'email' => 'receptionist.lembangview@gmail.com',
            ],

            'Cihampelas Urban Hotel' => [
                'name' => 'Receptionist Cihampelas Urban',
                'email' => 'receptionist.cihampelas@gmail.com',
            ],

            'Asia Afrika Hotel' => [
                'name' => 'Receptionist Asia Afrika',
                'email' => 'receptionist.asiaafrika@gmail.com',
            ],

            'Setiabudi Garden Hotel' => [
                'name' => 'Receptionist Setiabudi Garden',
                'email' => 'receptionist.setiabudi@gmail.com',
            ],

            'The Trans Luxury Hotel' => [
                'name' => 'Receptionist Trans Luxury',
                'email' => 'receptionist.transluxury@gmail.com',
            ],

            'Hilton Hotel Bandung' => [
                'name' => 'Receptionist Hilton',
                'email' => 'receptionist.hilton@gmail.com',
            ],

            'Hotel Savoy Homann Bandung' => [
                'name' => 'Receptionist Savoy Homann',
                'email' => 'receptionist.savoyhomann@gmail.com',
            ],

            
            'Menteng City Hotel' => [
                'name' => 'Receptionist Menteng City',
                'email' => 'receptionist.mentengcity@gmail.com',
            ],

            'Sudirman Executive Hotel' => [
                'name' => 'Receptionist Sudirman Executive',
                'email' => 'receptionist.sudirman@gmail.com',
            ],

            'Kemang Boutique Hotel' => [
                'name' => 'Receptionist Kemang Boutique',
                'email' => 'receptionist.kemang@gmail.com',
            ],

            'Ancol Seaside Hotel' => [
                'name' => 'Receptionist Ancol Seaside',
                'email' => 'receptionist.ancol@gmail.com',
            ],

            'Kuningan Grand Hotel' => [
                'name' => 'Receptionist Kuningan Grand',
                'email' => 'receptionist.kuningan@gmail.com',
            ],
        ];

        foreach ($receptionists as $hotelName => $receptionist) {
            $hotel = Hotel::where('name', $hotelName)->first();

            if (!$hotel) {
                continue;
            }

            User::create([
                'name' => $receptionist['name'],
                'email' => $receptionist['email'],
                'phone' => null,
                'password' => Hash::make('Recep1234'),
                'role_id' => 3,
                'hotel_id' => $hotel->id,
                'profile_picture' => null,
            ]);
        }
    }
}