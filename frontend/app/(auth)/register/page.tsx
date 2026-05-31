'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { notify } from '@/lib/notifications';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
        if (!name || !email || !password) {
            notify.auth.fieldRequired();
            return;
        }
        if (password.length < 6) {
            notify.auth.passwordTooWeak();
            return;
        }
        if (!agree) {
            notify.auth.accessDenied(); 
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/register', { 
                name, 
                email, 
                password,
                password_confirmation: password,
                role: 'user'
            });

            notify.auth.registerSuccess();
            router.push('/login');

        } catch (error: any) {
            if (error.response?.status === 422) {
                
                const errors = error.response?.data?.errors;
                if (errors) {
                    const firstErrorKey = Object.keys(errors)[0];
                    const firstErrorMessage = errors[firstErrorKey][0];
                    toast.error(firstErrorMessage);
                } else {
                    toast.error(error.response?.data?.message || 'Registrasi gagal. Periksa data Anda.');
                }
            } else if (error.response?.status) {
                notify.api.fromStatus(error.response.status);
            } else {
                notify.api.serverError();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 font-sans text-gray-800">
            <div className="w-full max-w-md flex flex-col justify-between min-h-[85vh]">

                {}
                <div className="flex-grow">
                    <div className="text-center mt-6 mb-10">
                        <h1 className="text-4xl font-semibold mb-3 tracking-wide">Daftar Akun</h1>
                        <p className="text-[#A7A7A7] text-[13px] font-medium tracking-wide">
                            Silahkan isi detail Anda di bawah ini!
                        </p>
                    </div>

                    <form className="w-full" onSubmit={handleRegister}>

                        {}
                        <div className="mb-5">
                            <label htmlFor="register-name" className="block text-xs font-bold text-gray-800 mb-2">
                                Nama
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                placeholder="nama"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#FFFDF0] px-4 py-3.5 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                required
                                autoComplete="name"
                            />
                        </div>

                        {}
                        <div className="mb-5">
                            <label htmlFor="register-email" className="block text-xs font-bold text-gray-800 mb-2">
                                Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                placeholder="email@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#FFFDF0] px-4 py-3.5 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {}
                        <div className="mb-4 relative">
                            <label htmlFor="register-password" className="block text-xs font-bold text-gray-800 mb-2">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="*************"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#FFFDF0] px-4 py-3.5 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer focus:outline-none"
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showPassword ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="flex justify-end items-center mb-8">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    className="w-3.5 h-3.5 border-gray-300 rounded text-[#D4AF8B] focus:ring-[#D4AF8B] checked:bg-[#D4AF8B] cursor-pointer"
                                />
                                <span className="text-[11px] font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                                    Setuju dengan{' '}
                                    <span className="text-[#D4AF8B] underline underline-offset-2">Syarat &amp; Ketentuan</span>
                                </span>
                            </label>
                        </div>

                        {}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#9DA884] text-white font-bold text-sm py-4 rounded-xl hover:bg-[#86926e] transition-shadow shadow-sm active:scale-[0.99] mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Mendaftar...' : 'Daftar'}
                        </button>

                        <div className="text-center text-[13px] font-bold text-black mt-2">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-[#D4AF8B] hover:underline underline-offset-2 ml-1">
                                Masuk
                            </Link>
                        </div>
                    </form>
                </div>

                {}
                <div className="flex justify-center items-end pb-4 pt-10">
                    <div className="relative w-72 h-16 opacity-90">
                        <Image
                            src="/images/logo-putih.png"
                            alt="Restify Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
