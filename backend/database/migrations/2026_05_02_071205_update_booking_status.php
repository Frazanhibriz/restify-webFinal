<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE bookings DROP CONSTRAINT bookings_status_check");

        DB::statement("ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
        CHECK (status IN ('pending','confirmed','checked_in','completed','cancelled'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE bookings DROP CONSTRAINT bookings_status_check");

        DB::statement("ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
        CHECK (status IN ('pending','confirmed','completed','cancelled'))");
    }
};
