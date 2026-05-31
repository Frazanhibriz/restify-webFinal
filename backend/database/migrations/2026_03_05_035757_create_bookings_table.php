<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('room_id')
                  ->constrained()
                  ->cascadeOnDelete();

            
            $table->date('check_in_date');
            $table->date('check_out_date');

            
            $table->unsignedInteger('nights');
            $table->decimal('total_price', 10, 2);

            
            $table->unsignedInteger('guests');

            
            $table->boolean('extra_bed')->default(false);

            
            $table->enum('status', [
                'pending',
                'confirmed',
                'checked_in',
                'completed',
                'cancelled'
            ])->default('pending');

            
            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed'
            ])->default('pending');

            
            $table->string('payment_method')->nullable();

            
            $table->string('payment_token')->nullable();

            
            $table->index(['user_id', 'room_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};