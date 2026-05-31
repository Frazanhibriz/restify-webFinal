<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hotel_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('room_type');

            $table->decimal('price', 10, 2);

            $table->enum('status', ['available', 'booked', 'maintenance'])
                  ->default('available');

            $table->integer('capacity')->default(2);

            $table->text('description')->nullable();

            
            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};