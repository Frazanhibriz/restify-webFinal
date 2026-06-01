'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiBox, FiLogOut, FiClock, FiCheckCircle, FiUserCheck } from 'react-icons/fi';
import api from '@/lib/axios';

export default function ReceptionistHomePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({ pending: 0, confirmed: 0, checkedIn: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'receptionist') {
        router.push('/home');
      }
    }
  }, [user, isLoading, router]);

  const fetchStats = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setStatsLoading(true);
      const res = await api.get('/receptionist/bookings');
      const bookings: any[] = res.data || [];
      setStats({
        pending: bookings.filter((b) => b.status === 'pending').length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        checkedIn: bookings.filter((b) => b.status === 'checked_in').length,
      });
    } catch (error) {
      console.error('Gagal mengambil statistik:', error);
    } finally {
      if (showLoading) setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'receptionist') {
      fetchStats(true);
      const interval = setInterval(() => fetchStats(false), 10000);
      return () => clearInterval(interval);
    }
  }, [user, fetchStats]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const statCards = [
    {
      label: 'Menunggu Konfirmasi',
      value: stats.pending,
      icon: <FiClock className="text-xl" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
      valueBg: 'bg-amber-100',
    },
    {
      label: 'Belum Check-in',
      value: stats.confirmed,
      icon: <FiCheckCircle className="text-xl" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      valueBg: 'bg-blue-100',
    },
    {
      label: 'Sedang Check-in',
      value: stats.checkedIn,
      icon: <FiUserCheck className="text-xl" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      valueBg: 'bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center p-6 font-sans text-gray-800 relative overflow-hidden">
      
      {}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-restify-olive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-restify-olive/5 rounded-full blur-3xl" />

      <div className="w-full max-w-lg bg-white rounded-[40px] p-10 md:p-14 shadow-2xl border border-restify-olive/10 animate-fade-in-up relative z-10">
        
        {}
        <div className="flex justify-center mb-10">
            <div className="relative w-40 h-10">
                <Image src="/images/logo-putih.png" alt="Restify Logo" fill sizes="(max-width: 768px) 100vw, 160px" className="object-contain" priority />
            </div>
        </div>
        
        {}
        <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 block">Dashboard Management</span>
            <h1 className="text-3xl font-black mb-1 text-restify-dark">Halo, Resepsionis</h1>
            <div className="inline-block bg-restify-olive/10 text-restify-olive px-4 py-1.5 rounded-full text-xs font-black mt-3">
                {user?.hotel?.name || "Memuat..."}
            </div>
        </div>

        {}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {statsLoading ? (
            <div className="col-span-3 text-center py-4 text-sm text-gray-400 font-medium">Memuat statistik...</div>
          ) : (
            statCards.map((card, i) => (
              <div key={i} className={`${card.bg} ${card.border} border rounded-2xl p-3 flex flex-col items-center text-center transition-all hover:scale-[1.03]`}>
                <div className={`${card.valueBg} ${card.text} w-10 h-10 rounded-xl flex items-center justify-center mb-2`}>
                  {card.icon}
                </div>
                <span className={`text-2xl font-black ${card.text}`}>{card.value}</span>
                <span className="text-[10px] font-bold text-gray-500 mt-1 leading-tight">{card.label}</span>
              </div>
            ))
          )}
        </div>
        
        {}
        <div className="flex flex-col gap-4 mb-12">
            <Link href="/receptionist/reservations" className="group flex items-center justify-between bg-restify-olive text-white p-6 rounded-3xl font-black text-lg hover:shadow-xl hover:shadow-restify-olive/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <FiCalendar className="text-2xl" />
                    </div>
                    <span>Data Reservasi</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </Link>

            <Link href="/receptionist/dataKamar" className="group flex items-center justify-between bg-white border border-gray-100 p-6 rounded-3xl font-black text-lg hover:border-restify-olive hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-restify-olive/10 group-hover:text-restify-olive transition-colors">
                        <FiBox className="text-2xl" />
                    </div>
                    <span>Data Kamar</span>
                </div>
                <div className="text-gray-200 group-hover:text-restify-olive group-hover:opacity-100 transition-all">→</div>
            </Link>
        </div>

        {}
        <div className="flex justify-center pt-6 border-t border-gray-50">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-widest hover:text-red-700 transition-colors"
            >
                <FiLogOut /> Keluar Aplikasi
            </button>
        </div>
      </div>

      <p className="mt-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Restify v2.0 • Secured Panel
      </p>

    </div>
  );
}
