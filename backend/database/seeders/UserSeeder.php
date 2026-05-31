<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Restify',
            'email' => 'admin@restify.com',
            'password' => Hash::make('Admin1234'),
            'role_id' => 1, 
            'hotel_id' => null
        ]);
    }
}