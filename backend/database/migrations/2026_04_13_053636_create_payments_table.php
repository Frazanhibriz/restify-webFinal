<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            
            $table->foreignId('booking_id')
                  ->constrained()
                  ->cascadeOnDelete()
                  ->unique();

            
            $table->decimal('amount', 10, 2);

            
            $table->enum('payment_method', ['qris', 'cash'])
                  ->default('qris');

            
            $table->enum('status', ['pending', 'paid', 'failed'])
                  ->default('pending');

            
            $table->string('transaction_code')->unique();

            
            $table->timestamp('paid_at')->nullable();

            
            $table->index('booking_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};