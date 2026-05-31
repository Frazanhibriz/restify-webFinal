<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Payment;
use Illuminate\Http\Request;

class ReceptionistController extends Controller
{
    
    public function bookingList()
    {
        $hotelId = auth()->user()->hotel_id;

        $bookings = Booking::whereHas('room', function ($query) use ($hotelId) {
                $query->where('hotel_id', $hotelId);
            })
            ->with(['user', 'room.hotel', 'payment'])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    
    public function confirm(Request $request)
    {
        $request->validate([
            'transaction_code' => 'required|exists:payments,transaction_code'
        ]);

        
        $payment = Payment::where('transaction_code', $request->transaction_code)
            ->with('booking.room')
            ->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan'
            ], 404);
        }

        
        $booking = $payment->booking;

        
        if ($booking->room->hotel_id != auth()->user()->hotel_id) {
            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        
        if ($booking->payment_status !== 'paid') {
            return response()->json([
                'message' => 'Pembayaran belum selesai'
            ], 400);
        }

        
        if ($booking->status === 'confirmed') {
            return response()->json([
                'message' => 'Booking sudah dikonfirmasi'
            ], 400);
        }

        
        $booking->update([
            'status' => 'confirmed'
        ]);

        return response()->json([
            'message' => 'Booking berhasil dikonfirmasi',
            'data' => $booking
        ]);
    }

    
    public function checkIn(Request $request)
    {
        $request->validate([
            'transaction_code' => 'required|exists:payments,transaction_code'
        ]);

        
        $payment = Payment::where('transaction_code', $request->transaction_code)
            ->with('booking.room')
            ->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan'
            ], 404);
        }

        
        $booking = $payment->booking;

        
        if ($booking->room->hotel_id != auth()->user()->hotel_id) {
            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        
        if ($booking->status !== 'confirmed') {
            return response()->json([
                'message' => 'Booking belum dikonfirmasi'
            ], 400);
        }

        
        $booking->update([
            'status' => 'checked_in'
        ]);

        
        $booking->room->update([
            'status' => 'booked'
        ]);

        return response()->json([
            'message' => 'Check-in berhasil',
            'data' => $booking
        ]);
    }

    
    public function decline(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::with('room')->find($request->booking_id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        
        if ($booking->room->hotel_id != auth()->user()->hotel_id) {
            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        
        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Booking sudah dibatalkan'
            ], 400);
        }

        
        $booking->update([
            'status' => 'cancelled'
        ]);

        
        $booking->room->update([
            'status' => 'available'
        ]);

        return response()->json([
            'message' => 'Booking ditolak',
            'data' => $booking
        ]);
    }

    
    public function updateRoomStatus(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'status' => 'required|in:available,booked,maintenance'
        ]);

        $room = Room::find($request->room_id);

        if (!$room) {
            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        
        if ($room->hotel_id != auth()->user()->hotel_id) {
            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        
        $room->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Status kamar berhasil diupdate',
            'data' => $room
        ]);
    }

    
    public function checkOut(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::with('room')->find($request->booking_id);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        
        if ($booking->room->hotel_id != auth()->user()->hotel_id) {
            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        
        if ($booking->status !== 'checked_in') {
            return response()->json([
                'message' => 'Booking belum check-in atau sudah selesai'
            ], 400);
        }

        
        $booking->update([
            'status' => 'completed'
        ]);

        
        $booking->room->update([
            'status' => 'available'
        ]);

        return response()->json([
            'message' => 'Check-out berhasil',
            'data' => $booking
        ]);
    }
}