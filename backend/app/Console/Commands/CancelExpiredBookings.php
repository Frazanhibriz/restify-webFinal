<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Booking;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'bookings:cancel-expired';

    protected $description = 'Cancel expired pending bookings';

    public function handle()
    {
        $expiredBookings = Booking::where('payment_status', 'pending')
            ->where('expired_at', '<=', Carbon::now())
            ->get();

        foreach ($expiredBookings as $booking) {

            
            $booking->update([
                'status' => 'cancelled',
                'payment_status' => 'failed'
            ]);

            
            if ($booking->payment) {
                $booking->payment->update([
                    'status' => 'failed'
                ]);
            }
        }

        $this->info('Expired bookings cancelled successfully.');
    }
}