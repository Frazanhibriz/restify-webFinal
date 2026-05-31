<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => 'sometimes|string|max:255',

            'email' => 'sometimes|email|unique:users,email,' . $userId,

            'phone' => 'nullable|string|min:10|max:13',

            'password' => [
                'nullable',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
            ],

            'role_id' => 'sometimes|exists:roles,id',

            'hotel_id' => 'nullable|exists:hotels,id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            if ($this->role_id == 3 && empty($this->hotel_id)) {
                $validator->errors()->add(
                    'hotel_id',
                    'Receptionist wajib memiliki hotel_id'
                );
            }

        });
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Nama maksimal 255 karakter',

            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',

            'phone.min' => 'Nomor telepon minimal 10 karakter',
            'phone.max' => 'Nomor telepon maksimal 13 karakter',

            'role_id.exists' => 'Role tidak valid',
            'hotel_id.exists' => 'Hotel tidak ditemukan',
        ];
    }
}