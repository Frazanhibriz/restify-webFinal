<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'bookings:cancel-expired';

    protected $description = 'Cancel expired pending bookings';

    public function handle()
    {
        // Get IDs of expired bookings before updating
        $expiredBookingIds = Booking::where('payment_status', 'pending')
            ->where('expired_at', '<=', Carbon::now())
            ->pluck('id');

        if ($expiredBookingIds->isEmpty()) {
            $this->info('No expired bookings found.');
            return;
        }

        // Batch update bookings
        Booking::whereIn('id', $expiredBookingIds)
            ->update([
                'status' => 'cancelled',
                'payment_status' => 'failed'
            ]);

        // Batch update related payments
        Payment::whereIn('booking_id', $expiredBookingIds)
            ->where('status', 'pending')
            ->update(['status' => 'failed']);

        $this->info("Cancelled {$expiredBookingIds->count()} expired bookings.");
    }
}