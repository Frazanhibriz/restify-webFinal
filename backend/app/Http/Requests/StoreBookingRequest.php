<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests' => 'required|integer|min:1|max:10',
            'extra_bed' => 'required|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'Kamar wajib dipilih',
            'room_id.exists' => 'Kamar tidak ditemukan',

            'check_in_date.required' => 'Tanggal check-in wajib diisi',
            'check_in_date.after_or_equal' => 'Check-in tidak boleh sebelum hari ini',

            'check_out_date.required' => 'Tanggal check-out wajib diisi',
            'check_out_date.after' => 'Check-out harus setelah check-in',

            'guests.required' => 'Jumlah tamu wajib diisi',
            'guests.integer' => 'Jumlah tamu harus angka',
            'guests.min' => 'Minimal 1 tamu',
            'guests.max' => 'Maksimal 10 tamu',

            'extra_bed.required' => 'Pilihan extra bed wajib diisi',
            'extra_bed.boolean' => 'Extra bed harus true atau false'
        ];
    }
}