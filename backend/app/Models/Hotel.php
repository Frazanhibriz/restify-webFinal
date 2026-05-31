<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{   
    protected $fillable = [
        'name',
        'address',
        'city',
        'latitude',
        'longitude',
        'description',
        'facilities',
        'image',
        'qris_image',
    ];

    protected $casts = [
    'facilities' => 'array'
    ];

    protected $appends = [
        'average_rating',
        'image_url',
    ];

    
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    
    public function receptionists()
    {
        return $this->hasMany(User::class, 'hotel_id');
    }

    
    public function getAverageRatingAttribute()
    {
        return round($this->ratings()->avg('rating') ?? 0, 1);
    }

    
    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        
        
        if (str_starts_with($this->image, 'images/')) {
            return '/' . $this->image;
        }

        return asset('storage/' . $this->image);
    }

    
    public function getQrisImageUrlAttribute()
    {
        return $this->qris_image
            ? asset('storage/' . $this->qris_image)
            : null;
    }

}