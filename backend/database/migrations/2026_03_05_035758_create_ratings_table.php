<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();

            
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            
            $table->foreignId('booking_id')
                  ->constrained()
                  ->cascadeOnDelete();

            
            $table->foreignId('hotel_id')
                  ->constrained()
                  ->cascadeOnDelete();

            
            $table->unique('booking_id');

            
            $table->unsignedTinyInteger('rating');

            
            $table->text('review')->nullable();

            
            $table->string('image')->nullable();

            $table->timestamps();

             
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};