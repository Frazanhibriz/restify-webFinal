<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email',

            'phone' => 'nullable|string|min:10|max:13',

            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
            ],

            'role_id' => 'required|exists:roles,id',

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
            'name.required' => 'Nama wajib diisi',

            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',

            'phone.min' => 'Nomor telepon minimal 10 karakter',
            'phone.max' => 'Nomor telepon maksimal 13 karakter',

            'password.required' => 'Password wajib diisi',

            'role_id.required' => 'Role wajib diisi',
            'role_id.exists' => 'Role tidak valid',

            'hotel_id.exists' => 'Hotel tidak ditemukan',
        ];
    }
}