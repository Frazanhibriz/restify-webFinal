<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreHotelRequest;

class HotelController extends Controller
{
    //GET ALL HOTELS by admin 
    public function index(Request $request)
    {
        $query = Hotel::query()
            ->withAvg('ratings', 'rating')
            ->withMin('rooms', 'price');

        //SEARCH
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('city', 'like', '%' . $request->search . '%')
                  ->orWhere('address', 'like', '%' . $request->search . '%');
            });
        }

        //FILTER CITY
        if ($request->filled('city')) {

            $query->where(
                'city',
                $request->city
            );
        }

        //FILTER PRICE
        if ($request->filled('min_price')) {

            $query->whereHas('rooms', function ($q) use ($request) {

                $q->where(
                    'price',
                    '>=',
                    $request->min_price
                );
            });
        }

        if ($request->filled('max_price')) {

            $query->whereHas('rooms', function ($q) use ($request) {

                $q->where(
                    'price',
                    '<=',
                    $request->max_price
                );
            });
        }

        //SORTING
        switch ($request->sort) {

            case 'price_asc':
                $query->orderBy('rooms_min_price', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('rooms_min_price', 'desc');
                break;

            case 'rating_desc':
                $query->orderBy('ratings_avg_rating', 'desc');
                break;

            default:
                $query->latest();
                break;
        }

        //PAGINATION
        $perPage = $request->get('per_page', 10);

        $hotels = $query->paginate($perPage);

        //MENERJEMAHKAN RESPONSE
        $hotels->getCollection()->transform(function ($hotel) {

            return [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'city' => $hotel->city,
                'address' => $hotel->address,
                'description' => $hotel->description,

                'facilities' => $hotel->facilities,

                'image_url' => $hotel->image_url,

                'lowest_price' => $hotel->rooms_min_price,

                'average_rating' => round(
                    $hotel->ratings_avg_rating ?? 0,
                    1
                ),
            ];
        });

        return response()->json($hotels);
    }


    //HOTEL DETAIL by admin 
    public function show($id)
    {
        $hotel = Hotel::with([
                'rooms',
                'ratings.user'
            ])
            ->withAvg('ratings', 'rating')
            ->find($id);

        if (!$hotel) {

            return response()->json([
                'message' => 'Hotel tidak ditemukan'
            ], 404);
        }

        return response()->json([

            'id' => $hotel->id,
            'name' => $hotel->name,
            'address' => $hotel->address,
            'city' => $hotel->city,

            'description' => $hotel->description,

            'facilities' => $hotel->facilities,

            'image_url' => $hotel->image_url,

            'qris_image_url' => $hotel->qris_image_url,

            'average_rating' => round(
                $hotel->ratings_avg_rating ?? 0,
                1
            ),

            'lowest_price' => $hotel->rooms->min('price'),

            //ROOMS
            'rooms' => $hotel->rooms->map(function ($room) {

                return [

                    'id' => $room->id,
                    'room_type' => $room->room_type,
                    'price' => $room->price,
                    'capacity' => $room->capacity,
                    'status' => $room->status,

                    'description' => $room->description,

                    'facilities' => $room->facilities,

                    'image_url' => $room->image_url,
                ];
            }),

            //RATING
            'ratings' => $hotel->ratings
        ]);
    }


   //CREATE HOTEL by admin 
    public function store(StoreHotelRequest $request)
    {
        $data = $request->validated();

        //UPLOAD HTOEL IMAGE
        if ($request->hasFile('image')) {

            $data['image'] = $request
                ->file('image')
                ->store('hotels', 'public');
        }

        //UPLOAD QRIS
        if ($request->hasFile('qris_image')) {

            $data['qris_image'] = $request
                ->file('qris_image')
                ->store('hotels/qris', 'public');
        }

        $hotel = Hotel::create($data);

        return response()->json([
            'message' => 'Hotel berhasil dibuat',
            'data' => $hotel
        ], 201);
    }

    
    //UPDATE HOTEL by admin 
    public function update(StoreHotelRequest $request, $id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {

            return response()->json([
                'message' => 'Hotel tidak ditemukan'
            ], 404);
        }

        $data = $request->validated();

        //UPDATE IMAGE
        if ($request->hasFile('image')) {

            // hapus image lama
            if ($hotel->image) {

                Storage::disk('public')
                    ->delete($hotel->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('hotels', 'public');
        }

        //UPDATE QRIS
        if ($request->hasFile('qris_image')) {

            // hapus qris lama
            if ($hotel->qris_image) {

                Storage::disk('public')
                    ->delete($hotel->qris_image);
            }

            $data['qris_image'] = $request
                ->file('qris_image')
                ->store('hotels/qris', 'public');
        }

        $hotel->update($data);

        return response()->json([
            'message' => 'Hotel berhasil diupdate',
            'data' => $hotel->fresh()
        ]);
    }

    
   //DELETE HOTEL by admin 
    public function destroy($id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {

            return response()->json([
                'message' => 'Hotel tidak ditemukan'
            ], 404);
        }

        //DELETE IMAGE
        if ($hotel->image) {

            Storage::disk('public')
                ->delete($hotel->image);
        }

        //DELETE QRIS
        if ($hotel->qris_image) {

            Storage::disk('public')
                ->delete($hotel->qris_image);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel berhasil dihapus'
        ]);
    }
}