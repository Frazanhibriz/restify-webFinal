<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',

            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',

            'description' => 'nullable|string|max:1000',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'qris_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama hotel wajib diisi',
            'address.required' => 'Alamat wajib diisi',
            'city.required' => 'Kota wajib diisi',

            'latitude.numeric' => 'Latitude harus berupa angka',
            'longitude.numeric' => 'Longitude harus berupa angka',

            'latitude.between' => 'Latitude tidak valid',
            'longitude.between' => 'Longitude tidak valid',

            'description.max' => 'Deskripsi maksimal 1000 karakter',

            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus jpg, jpeg, atau png',
            'image.max' => 'Ukuran gambar maksimal 2MB',
            'qris_image.max' => 'Ukuran QRIS maksimal 2MB',
        ];
    }
}