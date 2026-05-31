<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreRoomRequest;

class RoomController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Room::with('hotel');

        
        if ($request->filled('search')) {

            $query->where(
                'room_type',
                'like',
                '%' . $request->search . '%'
            );
        }

        
        if ($request->filled('hotel_id')) {

            $query->where(
                'hotel_id',
                $request->hotel_id
            );
        }

        
        if ($request->filled('status')) {

            $query->where(
                'status',
                $request->status
            );
        }

        
        if ($request->filled('room_type')) {

            $query->where(
                'room_type',
                $request->room_type
            );
        }

        
        if ($request->filled('min_price')) {

            $query->where(
                'price',
                '>=',
                $request->min_price
            );
        }

        if ($request->filled('max_price')) {

            $query->where(
                'price',
                '<=',
                $request->max_price
            );
        }

        
        switch ($request->sort) {

            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;

            case 'latest':
                $query->latest();
                break;

            default:
                $query->latest();
                break;
        }

        
        $perPage = $request->get('per_page', 10);

        $rooms = $query->paginate($perPage);

        return response()->json($rooms);
    }


    
    public function store(StoreRoomRequest $request)
    {
        $data = $request->validated();

        
        if ($request->hasFile('image')) {

            $data['image'] = $request
                ->file('image')
                ->store('rooms', 'public');
        }

        $room = Room::create($data);

        return response()->json([
            'message' => 'Room berhasil dibuat',
            'data' => $room
        ], 201);
    }


    
    public function show($id)
    {
        $room = Room::with('hotel')->find($id);

        if (!$room) {

            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        return response()->json($room);
    }


    
    public function roomsByHotel(Request $request, $id)
    {
        $query = Room::where('hotel_id', $id)
            ->with('hotel');

        
        if ($request->filled('status')) {

            $query->where(
                'status',
                $request->status
            );
        }

        
        if ($request->filled('room_type')) {

            $query->where(
                'room_type',
                $request->room_type
            );
        }

        
        if ($request->filled('min_price')) {

            $query->where(
                'price',
                '>=',
                $request->min_price
            );
        }

        if ($request->filled('max_price')) {

            $query->where(
                'price',
                '<=',
                $request->max_price
            );
        }

        
        switch ($request->sort) {

            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;

            default:
                $query->latest();
                break;
        }

        
        $perPage = $request->get('per_page', 10);

        $rooms = $query->paginate($perPage);

        return response()->json($rooms);
    }


    
    public function update(StoreRoomRequest $request, $id)
    {
        $room = Room::find($id);

        if (!$room) {

            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        $validated = $request->validated();

        
        if ($request->hasFile('image')) {

            
            if ($room->image) {

                Storage::disk('public')->delete($room->image);
            }

            $validated['image'] = $request
                ->file('image')
                ->store('rooms', 'public');
        }

        $room->update($validated);

        return response()->json([
            'message' => 'Room berhasil diupdate',
            'data' => $room->fresh()
        ]);
    }


    
    public function destroy($id)
    {
        $room = Room::find($id);

        if (!$room) {

            return response()->json([
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        
        if ($room->image) {

            Storage::disk('public')->delete($room->image);
        }

        $room->delete();

        return response()->json([
            'message' => 'Room berhasil dihapus'
        ]);
    }
}