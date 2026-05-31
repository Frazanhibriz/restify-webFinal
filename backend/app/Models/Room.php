<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'hotel_id',
        'room_type',
        'price',
        'capacity',
        'status',
        'description',
        'facilities',
        'image', 
    ];

    protected $casts = [
    'facilities' => 'array'
    ];

    protected $appends = ['image_url']; 

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

 
    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }
}