<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hotel_id' => 'required|exists:hotels,id',
            'room_type' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,booked,maintenance',
            'description' => 'nullable|string',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ];
    }

    public function messages(): array
    {
        return [
            'hotel_id.required' => 'Hotel wajib dipilih',
            'hotel_id.exists' => 'Hotel tidak ditemukan',

            'room_type.required' => 'Tipe kamar wajib diisi',

            'price.required' => 'Harga wajib diisi',
            'price.numeric' => 'Harga harus berupa angka',
            'price.min' => 'Harga tidak boleh kurang dari 0',

            'capacity.required' => 'Kapasitas wajib diisi',
            'capacity.integer' => 'Kapasitas harus berupa angka',
            'capacity.min' => 'Kapasitas minimal 1 orang',

            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status harus: available, booked, atau maintenance',

            'description.string' => 'Deskripsi harus berupa teks',

           
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus jpg, jpeg, atau png',
            'image.max' => 'Ukuran gambar maksimal 2MB'
        ];
    }
}