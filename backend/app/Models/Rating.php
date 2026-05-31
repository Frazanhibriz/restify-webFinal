<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'hotel_id',
        'booking_id',
        'rating',
        'review',
        'image' 
    ];

    protected $appends = ['image_url']; 

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    
    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }
}