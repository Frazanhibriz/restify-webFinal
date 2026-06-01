<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role_id',
        'hotel_id',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    protected $appends = [
        'profile_picture_url',
        'role',
    ];

    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture
            ? asset('storage/' . $this->profile_picture)
            : null;
    }

    public function getRoleAttribute()
    {
        return $this->role ? $this->role->name : null;
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}