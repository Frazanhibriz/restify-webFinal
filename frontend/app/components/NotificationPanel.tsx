'use client';



import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RiArrowRightLine, RiCheckDoubleLine } from 'react-icons/ri';
import {
  MOCK_NOTIFICATIONS,
  type Notification,
  formatNotifTime,
  groupNotifications,
} from '@/data/mockNotifications';
import api from '@/lib/axios';




interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}




export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/user/booking-history');
        const bookings = response.data.data || response.data || [];
        
        const newNotifs: Notification[] = [];
        bookings.forEach((b: any) => {
          const hotelName = b.room?.hotel?.name || 'Hotel';
          
          if (b.payment_status === 'paid' && b.status === 'pending') {
            newNotifs.push({
              id: `pay-${b.id}`,
              type: 'payment_success',
              message: `Pembayaran untuk reservasi di "${hotelName}" telah berhasil. Menunggu konfirmasi pihak hotel.`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: false,
            });
          }
          
          if (b.status === 'confirmed') {
            newNotifs.push({
              id: `conf-${b.id}`,
              type: 'booking_confirmed',
              message: `Reservasi anda di hotel "${hotelName}" telah dikonfirmasi oleh resepsionis.`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: false,
            });
          }
          
          if (b.status === 'checked_in') {
            newNotifs.push({
              id: `ci-${b.id}`,
              type: 'checkin_success',
              message: `Check-in Anda di "${hotelName}" berhasil. Selamat menikmati waktu menginap!`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: false,
            });
          }
          
          if (b.status === 'completed') {
            newNotifs.push({
              id: `co-${b.id}`,
              type: 'checkout_done',
              message: `Check-out Anda dari "${hotelName}" telah selesai. Terima kasih telah menginap!`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: true,
            });
            newNotifs.push({
              id: `rev-${b.id}`,
              type: 'review_reminder',
              message: `Bagikan pengalaman Anda di "${hotelName}" dengan menulis ulasan.`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: false,
              reviewLink: '/home/profile',
            });
          }
          
          if (b.status === 'cancelled') {
            newNotifs.push({
              id: `canc-${b.id}`,
              type: 'checkout_done',
              message: `Reservasi anda di hotel "${hotelName}" telah dibatalkan.`,
              hotelName: hotelName,
              createdAt: b.updated_at || b.created_at || new Date().toISOString(),
              isRead: true,
            });
          }
        });
        
        if (newNotifs.length === 0) {
          setNotifications(MOCK_NOTIFICATIONS);
        } else {
          newNotifs.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
          setNotifications([...newNotifs, ...MOCK_NOTIFICATIONS]);
        }
      } catch (error) {
        console.error("Gagal mengambil data notifikasi:", error);
        setNotifications(MOCK_NOTIFICATIONS);
      }
    };

    if (isOpen) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const grouped = groupNotifications(notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-x-0 top-0 bottom-[72px] z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panel Notifikasi"
        className={`fixed top-0 right-0 bottom-[72px] z-50 w-full max-w-[380px] flex flex-col
          bg-[#5E6B52] text-white shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {}
        <div className="flex items-center justify-between px-6 pt-8 pb-5">
          <h2 className="text-[22px] font-bold tracking-wide">Notifikasi</h2>
          <div className="flex items-center gap-3">
            {}
            {unreadCount > 0 && (
              <span className="bg-[#E34A42] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
            {}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Tutup panel notifikasi"
            >
              <RiArrowRightLine className="text-[18px]" />
            </button>
          </div>
        </div>

        {}
        {unreadCount > 0 && (
          <div className="px-6 pb-3">
            <button
              onClick={() => {
                
              }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70 hover:text-white transition-colors"
            >
              <RiCheckDoubleLine className="text-[15px]" />
              Tandai semua sudah dibaca
            </button>
          </div>
        )}

        {}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-60 gap-3">
              <span className="text-5xl">🔔</span>
              <p className="text-[14px]">Tidak ada notifikasi</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([groupLabel, items]) => (
              <div key={groupLabel}>
                {}
                <h3 className="text-[16px] font-bold mb-3 mt-2 px-2">{groupLabel}</h3>

                {}
                <div className="bg-[#4d5943] rounded-2xl overflow-hidden divide-y divide-white/10">
                  {items.map((notif) => (
                    <NotifItem key={notif.id} notif={notif} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}




function NotifItem({ notif }: { notif: Notification }) {
  const hasLink = notif.type === 'review_reminder' && notif.reviewLink;

  return (
    <div
      className={`px-4 py-4 flex flex-col gap-1.5 transition-colors
        ${!notif.isRead ? 'bg-white/5' : 'hover:bg-white/5'}`}
    >
      {}
      <span className="text-[11px] text-white/55 font-medium">
        {formatNotifTime(notif.createdAt)}
      </span>

      {}
      <p className="text-[13px] leading-relaxed">
        {hasLink ? (
          <>
            {}
            {notif.message.replace('ulasan.', '').trimEnd()}{' '}
            <Link
              href={notif.reviewLink!}
              className="underline underline-offset-2 font-semibold hover:opacity-80"
            >
              ulasan
            </Link>
            .
          </>
        ) : (
          notif.message
        )}
      </p>

      {}
      {!notif.isRead && (
        <div className="flex justify-end mt-0.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A42]" aria-label="Belum dibaca" />
        </div>
      )}
    </div>
  );
}
