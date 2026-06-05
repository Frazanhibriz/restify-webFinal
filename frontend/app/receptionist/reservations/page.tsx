'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCheckCircle, FiXCircle, FiLogOut, FiLogIn } from 'react-icons/fi';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function ReservationPage() {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedRes, setSelectedRes] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionCodeInput, setTransactionCodeInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'receptionist') {
                router.push('/home');
            }
        }
    }, [user, authLoading, router]);

    const fetchBookings = async (showLoading = false) => {
        try {
            if (showLoading) setIsLoading(true);
            const res = await api.get('/receptionist/bookings');
            setBookings(res.data || []);
            
            // Silently update the selected reservation detail if user is viewing one
            setSelectedRes((prev: any) => {
                if (!prev) return prev;
                const updated = (res.data || []).find((b: any) => b.id === prev.id);
                return updated || prev;
            });
        } catch (error) {
            console.error("Gagal mengambil data booking:", error);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (user && user.role === 'receptionist') {
            fetchBookings(true); // Initial load with spinner

            // Background polling — no loading spinner
            interval = setInterval(() => {
                fetchBookings(false);
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [user]);

    const handleAction = async (action: 'confirm' | 'check-in' | 'decline' | 'check-out') => {
        try {
            let endpoint = '';
            let data: any = {};

            if (action === 'confirm') {
                endpoint = '/receptionist/confirm-booking';
                data = { transaction_code: transactionCodeInput || selectedRes?.payment?.transaction_code };
            } else if (action === 'check-in') {
                endpoint = '/receptionist/check-in';
                data = { transaction_code: transactionCodeInput || selectedRes?.payment?.transaction_code };
            } else if (action === 'decline') {
                endpoint = '/receptionist/decline-booking';
                data = { booking_id: selectedRes?.id };
            } else if (action === 'check-out') {
                endpoint = '/receptionist/check-out';
                data = { booking_id: selectedRes?.id };
            }

            const res = await api.post(endpoint, data);
            toast.success(res.data.message || "Berhasil!");
            fetchBookings();
            setView('list');
            setTransactionCodeInput('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal melakukan aksi.");
        }
    };

    const handleBack = () => {
        if (view === 'list') {
            router.push('/receptionist');
        } else {
            setView('list');
            setSelectedRes(null);
            setTransactionCodeInput('');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="text-blue-600">Dikonfirmasi</span>;
            case 'checked_in': return <span className="text-green-600">Sudah Check-in</span>;
            case 'cancelled': return <span className="text-red-600">Dibatalkan</span>;
            case 'pending': return <span className="text-yellow-600">Menunggu</span>;
            case 'completed': return <span className="text-purple-600">Selesai</span>;
            default: return <span>{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-12 px-6">
            <header className="w-full border-b border-gray-200">
               <div className="max-w-5xl mx-auto py-5 flex items-center justify-between">
                    <div className="w-1/3">
                         <button onClick={handleBack} className="bg-restify-olive text-white font-bold text-[15px] px-10 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                             Kembali
                         </button>
                    </div>
                   <div className="w-1/3 flex flex-col items-center">
                       <div className="relative w-36 h-12 mb-2">
                            <Image src="/images/logo-putih.png" alt="Restify Logo" fill sizes="(max-width: 768px) 100vw, 144px" className="object-contain opacity-90" priority />
                       </div>
                       <h1 className="text-[22px] font-medium tracking-wide">
                           {view === 'list' ? 'Daftar Reservasi' : `Detail Reservasi`}
                       </h1>
                   </div>
                   <div className="w-1/3 flex justify-end">
                       {view === 'list' && (
                           <div className="relative">
                               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                               <input
                                   type="text"
                                   placeholder="Cari nama tamu..."
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-restify-olive focus:ring-1 focus:ring-restify-olive/30 transition-all w-56 bg-white"
                               />
                           </div>
                       )}
                   </div>
               </div>
            </header>

            <main className="max-w-5xl mx-auto py-8">
                {isLoading ? (
                    <div className="text-center py-20">Memuat data reservasi...</div>
                ) : view === 'list' ? (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50 text-center">
                                    <th className="border border-gray-200 py-4 font-bold">No.</th>
                                    <th className="border border-gray-200 py-4 font-bold">Nama Tamu</th>
                                    <th className="border border-gray-200 py-4 font-bold">Check-In</th>
                                    <th className="border border-gray-200 py-4 font-bold">Status</th>
                                    <th className="border border-gray-200 py-4 font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings
                                    .filter((b) => b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((res, idx) => (
                                    <tr key={res.id} className="hover:bg-gray-50 transition-colors text-center">
                                        <td className="border border-gray-200 py-4 font-bold">{idx + 1}</td>
                                        <td className="border border-gray-200 py-4 pl-4 text-left font-bold">{res.user?.name}</td>
                                        <td className="border border-gray-200 py-4 text-sm font-bold">{formatDate(res.check_in_date)}</td>
                                        <td className="border border-gray-200 py-4 font-bold text-sm">
                                            {getStatusBadge(res.status)}
                                        </td>
                                        <td className="border border-gray-200 py-4">
                                            <button 
                                                onClick={() => { setSelectedRes(res); setView('detail'); }}
                                                className="bg-restify-olive text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.filter((b) => b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                    <tr><td colSpan={5} className="py-10 text-gray-500 italic">
                                        {searchQuery ? 'Tidak ada reservasi yang cocok.' : 'Belum ada reservasi masuk.'}
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-fade-in">
                        <div className="w-full max-w-[850px] bg-[#F4F5F6] border border-gray-300 rounded-xl p-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Tamu</label>
                                        <p className="text-xl font-bold">{selectedRes.user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tipe Kamar</label>
                                        <p className="text-lg font-semibold">{selectedRes.room?.room_type}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Check In</label>
                                            <p className="font-bold">{formatDate(selectedRes.check_in_date)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Check Out</label>
                                            <p className="font-bold">{formatDate(selectedRes.check_out_date)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kode Transaksi (Pembayaran)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Masukkan kode..." 
                                                value={transactionCodeInput || selectedRes.payment?.transaction_code || ''}
                                                onChange={(e) => setTransactionCodeInput(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-lg bg-white outline-none focus:border-restify-olive"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 italic">*Gunakan kode dari user jika belum terisi otomatis</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Status Saat Ini</label>
                                        <div className="text-lg font-bold uppercase">{getStatusBadge(selectedRes.status)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-wrap gap-4 justify-center">
                                {selectedRes.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleAction('confirm')} className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:bg-blue-700 flex items-center gap-2">
                                            <FiCheckCircle /> Konfirmasi Booking
                                        </button>
                                        <button onClick={() => handleAction('decline')} className="bg-red-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:bg-red-700 flex items-center gap-2">
                                            <FiXCircle /> Tolak
                                        </button>
                                    </>
                                )}
                                {selectedRes.status === 'confirmed' && (
                                    <button onClick={() => handleAction('check-in')} className="bg-green-600 text-white px-10 py-2.5 rounded-full font-bold shadow-md hover:bg-green-700 flex items-center gap-2">
                                        <FiLogIn /> Check In Sekarang
                                    </button>
                                )}
                                {selectedRes.status === 'checked_in' && (
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-green-600 font-bold flex items-center gap-2 bg-green-50 px-6 py-2 rounded-full border border-green-200">
                                            <FiCheckCircle /> Tamu Sudah Berada di Kamar
                                        </p>
                                        <button onClick={() => handleAction('check-out')} className="bg-orange-600 text-white px-10 py-2.5 rounded-full font-bold shadow-md hover:bg-orange-700 flex items-center gap-2 transition-colors">
                                            <FiLogOut /> Check Out Tamu
                                        </button>
                                    </div>
                                )}
                                {selectedRes.status === 'completed' && (
                                    <p className="text-purple-600 font-bold flex items-center gap-2 bg-purple-50 px-6 py-2 rounded-full border border-purple-200">
                                        <FiCheckCircle /> Transaksi Selesai (Sudah Check-out)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
