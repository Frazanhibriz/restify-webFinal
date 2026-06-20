<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Hotel;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Return favorited hotels with average_rating and lowest_price
        $favorites = Favorite::where('user_id', $user->id)
            ->with(['hotel' => function ($query) {
                $query->withAvg('ratings', 'rating')
                      ->withMin('rooms', 'price');
            }])
            ->get()
            ->map(function ($fav) {
                $hotel = $fav->hotel;
                if ($hotel) {
                    return [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                        'city' => $hotel->city,
                        'address' => $hotel->address,
                        'latitude' => $hotel->latitude,
                        'longitude' => $hotel->longitude,
                        'description' => $hotel->description,
                        'facilities' => $hotel->facilities,
                        'image_url' => $hotel->image_url,
                        'lowest_price' => $hotel->rooms_min_price ?? 0,
                        'average_rating' => round($hotel->ratings_avg_rating ?? 0, 1),
                    ];
                }
                return null;
            })
            ->filter()
            ->values();
            
        return response()->json($favorites);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id'
        ]);

        $user = auth()->user();
        $hotelId = $request->hotel_id;

        $favorite = Favorite::where('user_id', $user->id)
            ->where('hotel_id', $hotelId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'message' => 'Hotel dihapus dari daftar favorit',
                'is_favorite' => false
            ]);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'hotel_id' => $hotelId
            ]);
            return response()->json([
                'message' => 'Hotel ditambahkan ke daftar favorit',
                'is_favorite' => true
            ]);
        }
    }
}
