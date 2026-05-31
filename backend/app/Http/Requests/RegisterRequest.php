<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
                'confirmed',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 255 karakter',

            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',

            'phone.string' => 'Nomor telepon harus berupa teks',
            'phone.min' => 'Nomor telepon minimal 10 karakter',
            'phone.max' => 'Nomor telepon maksimal 13 karakter',

            'password.required' => 'Kata sandi wajib diisi',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok',
            'password.min' => 'Kata sandi minimal 8 karakter',
            'password.regex' => 'Kata sandi wajib mengandung huruf besar, huruf kecil, dan angka',
        ];
    }
}