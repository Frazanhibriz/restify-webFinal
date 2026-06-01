'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { notify } from '@/lib/notifications';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            notify.auth.passwordMismatch();
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Kata sandi minimal harus 8 karakter");
            return;
        }

        setIsLoading(true);

        const email = typeof window !== 'undefined' ? sessionStorage.getItem('reset_email') || '' : '';

        try {
            await api.post('/reset-password', {
                email,
                token,
                password: newPassword,
                password_confirmation: confirmPassword
            });
            
            notify.auth.passwordResetSuccess();
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('reset_email');
            }
            router.push('/login');
        } catch (error: any) {
            const message = error.response?.data?.message || "Gagal mereset kata sandi. Pastikan token dan kata sandi baru memenuhi syarat (mengandung huruf besar, kecil, dan angka).";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-gray-800">
            <div className="w-full max-w-md flex flex-col justify-between min-h-[85vh] relative">
                
                {}
                <button 
                    onClick={() => router.push('/login')}
                    className="absolute top-2 left-0 text-xl text-black focus:outline-none"
                    aria-label="Kembali ke Login"
                >
                    <FiChevronLeft className="text-3xl" />
                </button>

                {}
                <div className="flex-grow mt-20">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold mb-3 tracking-wide">Reset Kata Sandi</h1>
                        <p className="text-[#A7A7A7] text-[13px] font-medium tracking-wide max-w-[280px] mx-auto leading-relaxed">
                            Masukkan kata sandi baru untuk akun Anda
                        </p>
                    </div>

                    <form className="w-full" onSubmit={handleResetPassword}>

                        <div className="mb-5">
                            <label htmlFor="reset-token" className="block text-xs font-bold text-gray-800 mb-2">
                                Token Reset
                            </label>
                            <input
                                id="reset-token"
                                type="text"
                                placeholder="Masukkan token reset..."
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full bg-[#FFFDF0] px-4 py-4 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                required
                            />
                        </div>

                        <div className="mb-5 relative">
                            <label htmlFor="new-password" className="block text-xs font-bold text-gray-800 mb-2">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="*************"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-[#FFFDF0] px-4 py-4 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer focus:outline-none"
                                    aria-label={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showNewPassword ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="mb-8 relative">
                            <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-800 mb-2">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="*************"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#FFFDF0] px-4 py-4 rounded-[12px] text-sm text-gray-800 outline-none placeholder-gray-300 focus:ring-1 focus:ring-[#9FA682] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer focus:outline-none"
                                    aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                                </button>
                            </div>
                        </div>

                        {}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#9DA884] text-white font-bold text-sm py-4 rounded-xl hover:bg-[#86926e] transition-shadow shadow-sm active:scale-[0.99] mb-8 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Memuat...' : 'Simpan Kata Sandi'}
                        </button>
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
