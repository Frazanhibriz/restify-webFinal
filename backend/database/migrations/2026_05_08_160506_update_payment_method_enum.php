<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE payments
            DROP CONSTRAINT payments_payment_method_check
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT payments_payment_method_check
            CHECK (payment_method IN ('qris', 'cash', 'midtrans'))
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE payments
            DROP CONSTRAINT payments_payment_method_check
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT payments_payment_method_check
            CHECK (payment_method IN ('qris', 'cash'))
        ");
    }
};