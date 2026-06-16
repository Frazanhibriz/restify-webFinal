<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Requests\StoreBookingRequest;
use Midtrans\Config;
use Midtrans\Snap;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request)
    {
        $user = auth()->user();

        return DB::transaction(function () use ($request, $user) {

            
            $room = Room::where('id', $request->room_id)
                ->lockForUpdate()
                ->first();

            
            
            if (!$room) {
                return response()->json([
                    'message' => 'Room tidak ditemukan'
                ], 404);
            }

            
            if ($room->status === 'maintenance') {
                return response()->json([
                    'message' => 'Kamar sedang dalam pemeliharaan'
                ], 400);
            }

            
            if (
                Carbon::parse($request->check_in_date)
                    ->startOfDay()
                    ->lt(now()->startOfDay())
            ) {
                return response()->json([
                    'message' => 'Tanggal check in tidak valid'
                ], 422);
            }

            
            $isBooked = Booking::where('room_id', $room->id)
                ->whereNotIn('status', ['cancelled', 'completed'])
                ->where(function ($query) {

                    $query->where('payment_status', 'paid')

                        ->orWhere(function ($q) {

                            $q->where('payment_status', 'pending')
                                ->where('expired_at', '>', now());

                        });

                })

                
                ->where(function ($query) use ($request) {

                    $query->where(
                        'check_in_date',
                        '<',
                        $request->check_out_date
                    )
                    ->where(
                        'check_out_date',
                        '>',
                        $request->check_in_date
                    );

                })

                ->exists();

            
            
            if ($isBooked) {
                return response()->json([
                    'message' => 'Kamar sudah dibooking pada tanggal tersebut'
                ], 422);
            }

            
            
            $nights = Carbon::parse($request->check_in_date)
                ->diffInDays(
                    Carbon::parse($request->check_out_date)
                );

            
            
            if ($nights < 1) {
                return response()->json([
                    'message' => 'Minimal booking 1 malam'
                ], 422);
            }

            
            $maxCapacity = $room->capacity;

            if ($request->extra_bed) {
                $maxCapacity += 1;
            }

            if ($request->guests > $maxCapacity) {
                return response()->json([
                    'message' => 'Jumlah tamu melebihi kapasitas kamar'
                ], 422);
            }

            
            $totalPrice = $room->price * $nights;

            
            if ($request->extra_bed) {
                $totalPrice += 100000 * $nights;
            }

            
            do {

                $transactionCode =
                    'TRX-' . strtoupper(Str::random(8));

            } while (

                Payment::where(
                    'transaction_code',
                    $transactionCode
                )->exists()

            );

            
            $booking = Booking::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
                'check_in_date' => $request->check_in_date,
                'check_out_date' => $request->check_out_date,
                'nights' => $nights,
                'total_price' => $totalPrice,
                'guests' => $request->guests,
                'extra_bed' => $request->extra_bed,
                
                'status' => 'pending',
                
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
                
                'expired_at' => now()->addMinutes(15)
            ]);


            
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $totalPrice,
                'payment_method' => 'midtrans',
                'status' => 'pending',
                'transaction_code' => $transactionCode
            ]);


            
            return response()->json([

                'message' => 'Booking berhasil dibuat',

                'data' => [
                    'booking_id' => $booking->id,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'expired_at' => $booking->expired_at,
                    'total_price' => $booking->total_price,
                    'room_id' => $booking->room_id,
                ]

            ], 201);

        });
    }


    
    public function history(Request $request)
    {
        $user = auth()->user();

        $query = Booking::with([
                'room.hotel',
                'payment',
                'rating'
            ])
            ->where('user_id', $user->id);
        
        
        if ($request->filled('search')) {

            $query->whereHas('payment', function ($q) use ($request) {

                $q->where(
                    'transaction_code',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        
        if ($request->filled('status')) {

            $query->where(
                'status',
                $request->status
            );
        }

        
        if ($request->filled('payment_status')) {

            $query->where(
                'payment_status',
                $request->payment_status
            );
        }

        
        $query->latest();
        
        
        $perPage = $request->get('per_page', 10);

        $bookings = $query->paginate($perPage);

        return response()->json($bookings);
    }


    
    public function show($id)
    {
        $booking = Booking::with([
            'room.hotel',
            'payment',
            'rating'
        ])
        ->where('id', $id)
        ->where('user_id', auth()->id())
        ->first();

        if (!$booking) {

            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail booking berhasil diambil',
            'data' => $booking
        ]);
    }


    
    public function allBookings(Request $request)
    {
        $query = Booking::with([
                'user:id,name,email',
                'room.hotel',
                'payment'
            ]);

        
        if ($request->filled('search')) {

            $query->where(function ($q) use ($request) {

                
                $q->whereHas('user', function ($userQuery) use ($request) {

                    $userQuery->where(
                        'name',
                        'like',
                        '%' . $request->search . '%'
                    );

                })

                
                ->orWhereHas('payment', function ($paymentQuery) use ($request) {

                    $paymentQuery->where(
                        'transaction_code',
                        'like',
                        '%' . $request->search . '%'
                    );

                });

            });
        }

        
        
        if ($request->filled('status')) {

            $query->where(
                'status',
                $request->status
            );
        }

        
        if ($request->filled('payment_status')) {

            $query->where(
                'payment_status',
                $request->payment_status
            );
        }

        
        if ($request->filled('hotel_id')) {

            $query->whereHas('room', function ($q) use ($request) {

                $q->where(
                    'hotel_id',
                    $request->hotel_id
                );

            });
        }

        
        switch ($request->sort) {

            case 'oldest':
                $query->oldest();
                break;

            default:
                $query->latest();
                break;
        }

        
        $perPage = $request->get('per_page', 10);

        $bookings = $query->paginate($perPage);

        return response()->json($bookings);
    }


    
    public function pay(Request $request, $id)
    {
        $user = auth()->user();

        $booking = Booking::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        
        if ($booking->payment_status === 'paid') {
            return response()->json([
                'message' => 'Sudah dibayar'
            ], 400);
        }

        
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
        Config::$curlOptions = [
            CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
            CURLOPT_SSL_VERIFYPEER => !app()->environment('local'),
            CURLOPT_HTTPHEADER => [], // Prevent Midtrans SDK "Undefined array key 10023" bug
        ];




        
        $payment = $booking->payment;

        
        if (!$payment) {
            return response()->json([
                'message' => 'Data payment tidak ditemukan'
            ], 404);
        }

        
        $params = [
            'transaction_details' => [
                'order_id' => $payment->transaction_code . '-' . time(),
                'gross_amount' => (int) $payment->amount,
            ],

            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],

            'enabled_payments' => [
                'qris',
                'bank_transfer',
                'gopay'
            ],
        ];

        
        $snapToken = Snap::getSnapToken($params);

        
        $booking->update([
            'payment_method' => 'midtrans',
            'payment_token' => $snapToken
        ]);

        return response()->json([
            'message' => 'Snap token berhasil dibuat',
            'snap_token' => $snapToken,
            'transaction_code' => $payment->transaction_code,
            'booking_id' => $booking->id,
            'gross_amount' => $payment->amount
        ]);
    }

    
    public function midtransCallback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        $calculatedSignature = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($calculatedSignature !== $request->signature_key) {
            return response()->json([
                'message' => 'Invalid signature key'
            ], 403);
        }

        $transactionStatus = $request->transaction_status;
        $orderId = $request->order_id;

        // Ekstrak kode transaksi dasar jika menggunakan akhiran timestamp
        $baseTransactionCode = $orderId;
        if (str_contains($orderId, '-')) {
            $lastHyphenPos = strrpos($orderId, '-');
            $suffix = substr($orderId, $lastHyphenPos + 1);
            if (is_numeric($suffix)) {
                $baseTransactionCode = substr($orderId, 0, $lastHyphenPos);
            }
        }

        $payment = Payment::where('transaction_code', $baseTransactionCode)->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Payment tidak ditemukan (Ping Uji Coba Berhasil)'
            ], 200);
        }

        // Idempotency: jika payment sudah dalam status final, skip processing
        if ($payment->status === 'paid' || $payment->status === 'failed') {
            return response()->json([
                'message' => 'Callback sudah diproses sebelumnya'
            ]);
        }

        
        $booking = $payment->booking;

        
        if (
            $transactionStatus == 'settlement' ||
            $transactionStatus == 'capture'
        ) {

            
            $payment->update([
                'status' => 'paid',
                'paid_at' => now()
            ]);

            
            $booking->update([
                'payment_status' => 'paid',
            ]);
        }

        
        else if (
            $transactionStatus == 'deny' ||
            $transactionStatus == 'expire' ||
            $transactionStatus == 'cancel'
        ) {

            $payment->update([
                'status' => 'failed'
            ]);

            $booking->update([
                'payment_status' => 'failed'
            ]);
        }

        
        else if ($transactionStatus == 'pending') {

            $payment->update([
                'status' => 'pending'
            ]);

            $booking->update([
                'payment_status' => 'pending'
            ]);
        }

        return response()->json([
            'message' => 'Callback berhasil diproses'
        ]);
    }


    
    public function checkout($id)
    {
        $user = auth()->user();

        $booking = \App\Models\Booking::with('room')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        
        if ($booking->status !== 'checked_in') {
            return response()->json([
                'message' => 'Status tidak valid untuk checkout'
            ], 400);
        }   

        
        $booking->update([
            'status' => 'completed'
        ]);

         
        $booking->room->update([
            'status' => 'available'
        ]);

        return response()->json([
            'message' => 'Checkout berhasil',
            'data' => $booking
        ]);
    }

    
    public function cancel($id)
    {
        $user = auth()->user();

        $booking = Booking::with('payment')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        
        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        
        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Booking tidak bisa dibatalkan'
            ], 400);
        }

        
        $booking->update([
            'status' => 'cancelled',
            'payment_status' => 'failed'
        ]);

        
        if ($booking->payment) {

            $booking->payment->update([
                'status' => 'failed'
            ]);
        }

        return response()->json([
            'message' => 'Booking berhasil dibatalkan'
        ]);
    }

    
    public function paymentDetail($id)
    {
        $booking = Booking::with(['room.hotel', 'payment'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        if (!$booking->payment) {
            return response()->json([
                'message' => 'Data payment tidak ditemukan'
            ], 404);
        }

        return response()->json([

            
            'booking_id' => $booking->id,
            'amount' => $booking->total_price,

            
            'payment_method' => $booking->payment->payment_method,
            'payment_status' => $booking->payment_status,
            'snap_token' => $booking->payment_token,

            
            'hotel_name' => $booking->room->hotel->name,

            
            'qris_image_url' => $booking->room->hotel->qris_image
                ? asset('storage/' . $booking->room->hotel->qris_image)
                : null,

            
            'transaction_code' => $booking->payment->transaction_code
        ]);
    }
}