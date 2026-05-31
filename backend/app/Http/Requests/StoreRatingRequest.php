<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ];
    }

    public function messages(): array
    {
        return [
            'booking_id.required' => 'Booking wajib diisi',
            'booking_id.exists' => 'Booking tidak ditemukan',

            'rating.required' => 'Rating wajib diisi',
            'rating.integer' => 'Rating harus berupa angka',
            'rating.min' => 'Rating minimal 1',
            'rating.max' => 'Rating maksimal 5',

            'review.string' => 'Review harus berupa teks',
            'review.max' => 'Review maksimal 1000 karakter',

            
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format harus jpg, jpeg, png',
            'image.max' => 'Ukuran maksimal 2MB'
        ];
    }
}