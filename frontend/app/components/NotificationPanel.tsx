'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  onUnreadCountChange?: (count: number) => void;
}

// Load read status from localStorage
const getReadNotifIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('restify_read_notif_ids');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Save read status to localStorage
const saveReadNotifIds = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('restify_read_notif_ids', JSON.stringify(ids));
  } catch (e) {}
};

export default function NotificationPanel({ isOpen, onClose, onUnreadCountChange }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get('/user/booking-history');
      const bookings = response.data.data || response.data || [];
      
      const readIds = getReadNotifIds();
      const newNotifs: Notification[] = [];
      
      bookings.forEach((b: any) => {
        const hotelName = b.room?.hotel?.name || 'Hotel';
        
        if (b.payment_status === 'paid' && b.status === 'pending') {
          const id = `pay-${b.id}`;
          newNotifs.push({
            id: id,
            type: 'payment_success',
            message: `Pembayaran untuk reservasi di "${hotelName}" telah berhasil. Menunggu konfirmasi pihak hotel.`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(id) ? true : false,
          });
        }
        
        if (b.status === 'confirmed') {
          const id = `conf-${b.id}`;
          newNotifs.push({
            id: id,
            type: 'booking_confirmed',
            message: `Reservasi anda di hotel "${hotelName}" telah dikonfirmasi oleh resepsionis.`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(id) ? true : false,
          });
        }
        
        if (b.status === 'checked_in') {
          const id = `ci-${b.id}`;
          newNotifs.push({
            id: id,
            type: 'checkin_success',
            message: `Check-in Anda di "${hotelName}" berhasil. Selamat menikmati waktu menginap!`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(id) ? true : false,
          });
        }
        
        if (b.status === 'completed') {
          const idCo = `co-${b.id}`;
          const idRev = `rev-${b.id}`;
          
          newNotifs.push({
            id: idCo,
            type: 'checkout_done',
            message: `Check-out Anda dari "${hotelName}" telah selesai. Terima kasih telah menginap!`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(idCo) ? true : true, // Completed status is read by default unless new
          });
          
          newNotifs.push({
            id: idRev,
            type: 'review_reminder',
            message: `Bagikan pengalaman Anda di "${hotelName}" dengan menulis ulasan.`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(idRev) ? true : false,
            reviewLink: '/home/riwayat',
          });
        }
        
        if (b.status === 'cancelled') {
          const id = `canc-${b.id}`;
          newNotifs.push({
            id: id,
            type: 'checkout_done',
            message: `Reservasi anda di hotel "${hotelName}" telah dibatalkan.`,
            hotelName: hotelName,
            createdAt: b.updated_at || b.created_at || new Date().toISOString(),
            isRead: readIds.includes(id) ? true : true, // Cancelled status is read by default unless new
          });
        }
      });
      
      const processedMock = MOCK_NOTIFICATIONS.map(n => ({
        ...n,
        isRead: readIds.includes(n.id) ? true : n.isRead
      }));

      if (newNotifs.length === 0) {
        setNotifications(processedMock);
      } else {
        newNotifs.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
        setNotifications([...newNotifs, ...processedMock]);
      }
    } catch (error) {
      console.error("Gagal mengambil data notifikasi:", error);
      const readIds = getReadNotifIds();
      const processedMock = MOCK_NOTIFICATIONS.map(n => ({
        ...n,
        isRead: readIds.includes(n.id) ? true : n.isRead
      }));
      setNotifications(processedMock);
    }
  }, []);

  // Fetch notifications on mount to populate the initial unread count
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifications();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchNotifications]);

  // Poll for notifications every 30s only when the notification panel is open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchNotifications();
      }, 0);
      const interval = setInterval(fetchNotifications, 30000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isOpen, fetchNotifications]);

  // Lock body scroll when panel is open to prevent parent page scroll leak
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Only display unread notifications in the list
  const activeNotifications = notifications.filter((n) => !n.isRead);
  const grouped = groupNotifications(activeNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      const readIds = getReadNotifIds();
      const allIds = Array.from(new Set([...readIds, ...updated.map(n => n.id)]));
      saveReadNotifIds(allIds);
      return updated;
    });
  };

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
      {/* Background Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panel Notifikasi"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[380px] flex flex-col
          bg-[#FFFDF0]/95 backdrop-blur-md text-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.08)] border-l border-gray-100/60
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-5">
          <h2 className="text-[22px] font-black text-gray-800 tracking-wide">Notifikasi</h2>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="bg-[#E34A42] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                {unreadCount}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-gray-200/80 flex items-center justify-center hover:bg-gray-100/50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Tutup panel notifikasi"
            >
              <RiArrowRightLine className="text-[18px]" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        {unreadCount > 0 && (
          <div className="px-6 pb-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#5E6B52] hover:text-[#4a5440] hover:underline transition-colors cursor-pointer"
            >
              <RiCheckDoubleLine className="text-[15px]" />
              Tandai semua sudah dibaca
            </button>
          </div>
        )}

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6
          scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

          {activeNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-60 gap-3 text-gray-400">
              <span className="text-5xl">🔔</span>
              <p className="text-[14px] font-bold">Tidak ada notifikasi</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([groupLabel, items]) => (
              <div key={groupLabel}>
                <h3 className="text-[11px] font-black text-gray-400 mb-3 mt-4 px-2 uppercase tracking-widest">{groupLabel}</h3>

                <div className="flex flex-col gap-3.5">
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

const getBorderColor = (type: string) => {
  switch (type) {
    case 'booking_confirmed': return 'border-l-[4px] border-[#5E6B52]';
    case 'booking_forwarded': return 'border-l-[4px] border-[#ACB5A4]';
    case 'payment_success': return 'border-l-[4px] border-emerald-500';
    case 'review_reminder': return 'border-l-[4px] border-[#DEAC78]';
    case 'checkout_done': return 'border-l-[4px] border-purple-500';
    case 'checkin_success': return 'border-l-[4px] border-teal-500';
    default: return 'border-l-[4px] border-gray-300';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'booking_confirmed':
      return (
        <div className="w-9 h-9 rounded-full bg-[#5E6B52]/10 text-[#5E6B52] flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-[#5E6B52]/5">
          📅
        </div>
      );
    case 'booking_forwarded':
      return (
        <div className="w-9 h-9 rounded-full bg-[#ACB5A4]/10 text-[#8f9888] flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-[#ACB5A4]/5">
          ✉️
        </div>
      );
    case 'payment_success':
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-emerald-100/50">
          💳
        </div>
      );
    case 'review_reminder':
      return (
        <div className="w-9 h-9 rounded-full bg-amber-50 text-[#DEAC78] flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-amber-100/50">
          ⭐
        </div>
      );
    case 'checkout_done':
      return (
        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-purple-100/50">
          🔑
        </div>
      );
    case 'checkin_success':
      return (
        <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-teal-100/50">
          🔑
        </div>
      );
    default:
      return (
        <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm border border-gray-100">
          🔔
        </div>
      );
  }
};

function NotifItem({ notif }: { notif: Notification }) {
  const hasLink = notif.type === 'review_reminder' && notif.reviewLink;

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-gray-800 ${getBorderColor(notif.type)} ${!notif.isRead ? 'bg-gradient-to-r from-[#FFFDF0]/40 to-white border border-[#5E6B52]/10' : 'border border-gray-100/85'}`}
    >
      {getIcon(notif.type)}
      
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
          {formatNotifTime(notif.createdAt)}
        </span>
        
        <p className="text-[13px] text-gray-600 font-semibold leading-relaxed">
          {hasLink ? (
            <>
              {notif.message.replace('ulasan.', '').trimEnd()}{' '}
              <Link
                href={notif.reviewLink!}
                className="text-[#DEAC78] font-extrabold hover:underline underline-offset-2"
              >
                ulasan
              </Link>
              .
            </>
          ) : (
            notif.message
          )}
        </p>
        
        {!notif.isRead && (
          <div className="flex justify-end mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E34A42] animate-pulse" aria-label="Belum dibaca" />
          </div>
        )}
      </div>
    </div>
  );
}
