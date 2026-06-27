








export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  hotelName: string;
  roomType: string;
  checkIn: string;        
  checkOut: string;       
  bookedAt: string;       
  guestCount: number;
  extraBed: number;
  subtotal: number;       
  taxAndFee: number;      
  total: number;          
  transactionCode: string;
  status: BookingStatus;  
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    hotelName: 'Puteri Gunung Hotel',
    roomType: 'Deluxe Room',
    checkIn: '2026-11-10',
    checkOut: '2026-12-04',
    bookedAt: '2026-04-24T14:00:00Z',
    guestCount: 2,
    extraBed: 1,
    subtotal: 2325000,
    taxAndFee: 775000,
    total: 2480000,
    transactionCode: 'TRX-2026-BK001',
    status: 'active',
  },
  {
    id: 'BK002',
    hotelName: 'Aryaduta Bandung',
    roomType: 'Superior Room',
    checkIn: '2026-08-15',
    checkOut: '2026-08-20',
    bookedAt: '2026-04-10T09:30:00Z',
    guestCount: 1,
    extraBed: 0,
    subtotal: 3711340,
    taxAndFee: 1237113,
    total: 4148780,
    transactionCode: 'TRX-2026-BK002',
    status: 'completed',
  },
  {
    id: 'BK003',
    hotelName: 'The Trans Luxury Hotel',
    roomType: 'Suite Room',
    checkIn: '2026-06-01',
    checkOut: '2026-06-05',
    bookedAt: '2026-03-20T11:00:00Z',
    guestCount: 2,
    extraBed: 0,
    subtotal: 5964000,
    taxAndFee: 1988000,
    total: 7952000,
    transactionCode: 'TRX-2026-BK003',
    status: 'completed',
  },
];




const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggal(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getDate()} ${BULAN_ID[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatTanggalSingkat(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getDate()} - ${BULAN_ID[date.getMonth()]} - ${date.getFullYear()}`;
}

export function formatJam(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
