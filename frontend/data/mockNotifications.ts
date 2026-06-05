














export type NotificationType =
  | 'booking_confirmed'   
  | 'booking_forwarded'   
  | 'payment_success'     
  | 'review_reminder'     
  | 'checkout_done'       
  | 'checkin_success';    

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  hotelName: string;
  createdAt: string;      
  isRead: boolean;
  reviewLink?: string;    
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001',
    type: 'booking_confirmed',
    message: 'Reservasi kamar Anda di "Puteri Gunung Hotel" berhasil dikonfirmasi. Selamat berlibur!',
    hotelName: 'Puteri Gunung Hotel',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 menit yang lalu
    isRead: false,
  },
  {
    id: 'N002',
    type: 'booking_forwarded',
    message: 'Detail reservasi Anda sudah kami teruskan ke pihak manajemen "Puteri Gunung Hotel".',
    hotelName: 'Puteri Gunung Hotel',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 menit yang lalu
    isRead: false,
  },
  {
    id: 'N003',
    type: 'payment_success',
    message: 'Pembayaran reservasi kamar di "Puteri Gunung Hotel" sukses diterima. Terima kasih!',
    hotelName: 'Puteri Gunung Hotel',
    createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 menit yang lalu
    isRead: false,
  },
  {
    id: 'N004',
    type: 'review_reminder',
    message: 'Bagikan pengalaman seru Anda selama menginap di "Aryaduta Bandung" dengan menulis ulasan.',
    hotelName: 'Aryaduta Bandung',
    createdAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString(), // ~1 hari yang lalu (Kemarin)
    isRead: true,
    reviewLink: '/home/riwayat',
  },
  {
    id: 'N005',
    type: 'checkout_done',
    message: 'Proses check-out dari "Aryaduta Bandung" selesai. Sampai jumpa di liburan berikutnya!',
    hotelName: 'Aryaduta Bandung',
    createdAt: new Date(Date.now() - 25 * 3600 * 1000 - 2 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'N006',
    type: 'checkin_success',
    message: 'Check-in di "Aryaduta Bandung" berhasil. Selamat menikmati waktu istirahat Anda!',
    hotelName: 'Aryaduta Bandung',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 hari yang lalu
    isRead: true,
  },
];





const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatNotifTime(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const day = d.getUTCDate();
  const month = BULAN_ID[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${hh}:${mm} · ${day} ${month} ${year}`;
}


export function getNotifGroup(isoDateTime: string): string {
  const now = new Date();
  const d = new Date(isoDateTime);

  const todayStr = now.toISOString().slice(0, 10);
  const dStr = d.toISOString().slice(0, 10);

  if (dStr === todayStr) return 'Hari ini';

  const yesterday = new Date(now);
  yesterday.setUTCDate(now.getUTCDate() - 1);
  if (dStr === yesterday.toISOString().slice(0, 10)) return 'Kemarin';

  if (d.getUTCMonth() === now.getUTCMonth() && d.getUTCFullYear() === now.getUTCFullYear()) {
    return 'Minggu Lalu';
  }

  return 'Bulan Lalu';
}


export function groupNotifications(
  notifications: Notification[],
): Map<string, Notification[]> {
  const map = new Map<string, Notification[]>();
  const order = ['Hari ini', 'Kemarin', 'Minggu Lalu', 'Bulan Lalu'];

  for (const n of notifications) {
    const group = getNotifGroup(n.createdAt);
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(n);
  }

  
  const sorted = new Map<string, Notification[]>();
  for (const label of order) {
    if (map.has(label)) sorted.set(label, map.get(label)!);
  }
  
  for (const [k, v] of map) {
    if (!sorted.has(k)) sorted.set(k, v);
  }

  return sorted;
}
