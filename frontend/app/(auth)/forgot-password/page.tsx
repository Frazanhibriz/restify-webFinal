'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiChevronLeft } from 'react-icons/fi';
import { notify } from '@/lib/notifications';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        try {
            await api.post('/forgot-password', { email });
            sessionStorage.setItem('reset_email', email);
            notify.auth.resetLinkSent();
            router.push('/reset-password');
        } catch (error: any) {
            const message = error.response?.data?.message || "Email tidak ditemukan atau terjadi kesalahan.";
            notify.api.serverError();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-gray-800">
            <div className="w-full max-w-md flex flex-col justify-between min-h-[85vh] relative">
                
                {}
                <button 
                    onClick={() => router.back()}
                    className="absolute top-2 left-0 text-xl text-black focus:outline-none"
                    aria-label="Kembali"
                >
                    <FiChevronLeft className="text-3xl" />
                </button>

                {}
                <div className="flex-grow mt-20">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold mb-3 tracking-wide">Lupa Kata Sandi</h1>
                        <p className="text-[#A7A7A7] text-[13px] font-medium tracking-wide max-w-[280px] mx-auto leading-relaxed">
                            Masukkan email Anda untuk menerima link reset password
                        </p>
                    </div>

                    <form className="w-full" onSubmit={handleSendLink}>

                        {}
                        <div className="mb-6">
                            <label htmlFor="reset-email" className="block text-xs font-bold text-gray-800 mb-2">
                                Email
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                placeholder="nama@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#FFFDF0] px-4 py-4 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#9DA884] text-white font-bold text-sm py-4 rounded-xl hover:bg-[#86926e] transition-shadow shadow-sm active:scale-[0.99] mb-8 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Memuat...' : 'Kirim Link Reset'}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="text-[13px] font-semibold text-[#D4AF8B] hover:text-[#b89574] hover:underline underline-offset-2 transition-colors">
                                Kembali ke Login
                            </Link>
                        </div>
                    </form>
                </div>

                {}
                <div className="flex justify-center items-end mt-12 pb-4">
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
