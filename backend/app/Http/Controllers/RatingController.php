<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRatingRequest;

class RatingController extends Controller
{
    
    public function store(StoreRatingRequest $request)
    {
        $user = auth()->user();

        $booking = Booking::with('room.hotel')
            ->where('id', $request->booking_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        if ($booking->status !== 'completed') {
            return response()->json([
                'message' => 'Rating hanya dapat diberikan setelah checkout selesai'
            ], 403);
        }

        if (!$booking->room || !$booking->room->hotel) {
            return response()->json([
                'message' => 'Data hotel tidak valid'
            ], 500);
        }

        $rating = Rating::where('booking_id', $booking->id)->first();
        $imagePath = $rating ? $rating->image : null;

        if ($request->hasFile('image')) {
            if ($rating && $rating->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($rating->image);
            }
            $imagePath = $request
                ->file('image')
                ->store('ratings', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($rating && $rating->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($rating->image);
            }
            $imagePath = null;
        }

        if ($rating) {
            $rating->update([
                'rating' => $request->rating,
                'review' => $request->review,
                'image' => $imagePath
            ]);
            $message = 'Rating berhasil diperbarui';
            $statusCode = 200;
        } else {
            $rating = Rating::create([
                'user_id' => $user->id,
                'hotel_id' => $booking->room->hotel->id,
                'booking_id' => $booking->id,
                'rating' => $request->rating,
                'review' => $request->review,
                'image' => $imagePath
            ]);
            $message = 'Rating berhasil ditambahkan';
            $statusCode = 201;
        }

        return response()->json([
            'message' => $message,
            'data' => $rating->load([
                'user:id,name,profile_picture',
                'hotel:id,name',
                'booking:id'
            ])
        ], $statusCode);
    }


    
    public function hotelRatings(Request $request, $hotel_id)
    {
        $perPage = $request->get('per_page', 10);

        $ratings = Rating::where('hotel_id', $hotel_id)
            ->with([
                'user:id,name,profile_picture',
                'booking:id'
            ])
            ->latest()
            ->paginate($perPage);

        return response()->json($ratings);
    }
}