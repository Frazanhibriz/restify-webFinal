'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RiHome5Fill, RiUser3Line, RiHeartFill, RiHeartLine, RiFileTextLine, RiFileTextFill } from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Client-side role guard — redirect non-user roles to their correct panel
  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (!user) {
      // Not logged in at all → go to login
      router.replace('/login');
      return;
    }

    if (user.role === 'admin') {
      router.replace('/admin');
      return;
    }

    if (user.role === 'receptionist') {
      router.replace('/receptionist');
      return;
    }
  }, [user, isLoading, router]);

  // Show nothing while loading or if wrong role (prevent flash of content)
  if (isLoading || !user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#657657] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto relative min-h-screen bg-white px-6 md:px-12 lg:px-20 pb-20">
        {/* Page content */}
        {children}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50">
          <div className="w-full max-w-[1400px] mx-auto flex justify-center gap-12 md:gap-20 lg:gap-28 items-center px-8 py-3 pb-6">
            <Link href="/home" className="flex flex-col items-center gap-1">
              <RiHome5Fill className={`text-2xl ${pathname === '/home' ? 'text-[#c68a47]' : 'text-gray-400'}`} />
              <span className={`text-[12px] font-bold ${pathname === '/home' ? 'text-[#c68a47]' : 'text-gray-400'}`}>Beranda</span>
            </Link>

            <Link href="/home/riwayat" className="flex flex-col items-center gap-1">
              {pathname === '/home/riwayat' ? (
                <RiFileTextFill className="text-2xl text-[#c68a47]" />
              ) : (
                <RiFileTextLine className="text-2xl text-gray-400" />
              )}
              <span className={`text-[12px] font-bold ${pathname === '/home/riwayat' ? 'text-[#c68a47]' : 'text-gray-400'}`}>Riwayat</span>
            </Link>

            <Link href="/home/favorites" className="flex flex-col items-center gap-1">
              {pathname === '/home/favorites' ? (
                <RiHeartFill className="text-2xl text-[#c68a47]" />
              ) : (
                <RiHeartLine className="text-2xl text-gray-400" />
              )}
              <span className={`text-[12px] font-bold ${pathname === '/home/favorites' ? 'text-[#c68a47]' : 'text-gray-400'}`}>Favorit</span>
            </Link>
            
            <Link href="/home/profile" className="flex flex-col items-center gap-1">
              {user?.profile_picture_url ? (
                <div className={`w-6 h-6 rounded-full overflow-hidden border ${pathname === '/home/profile' ? 'border-[#c68a47] ring-2 ring-[#c68a47]/20' : 'border-gray-300'}`}>
                  <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <RiUser3Line className={`text-2xl ${pathname === '/home/profile' ? 'text-[#c68a47]' : 'text-gray-400'}`} />
              )}
              <span className={`text-[12px] font-bold ${pathname === '/home/profile' ? 'text-[#c68a47]' : 'text-gray-400'}`}>Profil</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
