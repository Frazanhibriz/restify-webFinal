'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiFileTextLine, RiEyeLine, RiEyeOffLine, RiStarFill, RiStarLine, RiImageAddLine, RiCloseLine } from 'react-icons/ri';
import {
  formatTanggal,
  formatTanggalSingkat,
  formatJam,
  formatRupiah,
} from '@/data/mockBookings';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface Booking {
  id: number;
  hotelName: string;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guestCount: number;
  extraBed: number;
  bookedAt: string;
  subtotal: number;
  taxAndFee: number;
  total: number;
  status: 'active' | 'completed';
  rawStatus: string;
  rawPaymentStatus: string;
  transactionCode: string;
  rating?: {
    id: number;
    rating: number;
    review: string;
    image_url: string | null;
  } | null;
}

function BookingCard({
  booking,
  onSelect,
}: {
  booking: Booking;
  onSelect: (b: Booking) => void;
}) {
  const getStatusStyle = () => {
    if (booking.rawStatus === 'cancelled' || booking.rawPaymentStatus === 'failed') {
      return { bg: 'bg-red-500/10 text-red-600 border border-red-200', text: 'Dibatalkan' };
    }
    if (booking.rawPaymentStatus === 'pending') {
      return { bg: 'bg-amber-500/10 text-amber-600 border border-amber-200', text: 'Belum Bayar' };
    }
    if (booking.rawStatus === 'pending') {
      return { bg: 'bg-blue-500/10 text-blue-600 border border-blue-200', text: 'Menunggu' };
    }
    if (booking.rawStatus === 'checked_in') {
      return { bg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200', text: 'Menginap' };
    }
    if (booking.rawStatus === 'completed') {
      return { bg: 'bg-purple-500/10 text-purple-600 border border-purple-200', text: 'Selesai' };
    }
    return { bg: 'bg-sky-500/10 text-sky-600 border border-sky-200', text: 'Dikonfirmasi' };
  };

  const statusStyle = getStatusStyle();

  return (
    <button
      onClick={() => onSelect(booking)}
      className="w-full text-left rounded-2xl px-6 py-5 flex items-center justify-between gap-4 transition-all bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-[0.98] group"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[17px] font-black text-gray-800 leading-tight truncate group-hover:text-[#5E6B52] transition-colors">
          {booking.hotelName}
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span>{formatTanggalSingkat(booking.checkIn)}</span>
          <span>→</span>
          <span>{formatTanggalSingkat(booking.checkOut)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
          {statusStyle.text}
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#5E6B52] group-hover:text-white transition-all">
          <RiFileTextLine className="text-[16px]" />
        </div>
      </div>
    </button>
  );
}

function BookingDetail({
  booking,
  onBack,
  onActionSuccess,
}: {
  booking: Booking;
  onBack: () => void;
  onActionSuccess: () => void;
}) {
  const [showCode, setShowCode] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState<File | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const { user } = useAuth();

  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank', 'width=860,height=1000');
    if (!printWindow) {
      toast.error("Gagal membuka jendela cetak. Pastikan pop-up dibolehkan.");
      return;
    }

    const checkInDate  = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    const fmtDate = (d: Date) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const fmtRp   = (n: number) => 'Rp\u00a0' + n.toLocaleString('id-ID');

    const txCode        = booking.transactionCode || '-';
    const hotelNm       = booking.hotelName || '-';
    const roomTp        = booking.roomType  || '-';
    const checkInStr    = fmtDate(checkInDate);
    const checkOutStr   = fmtDate(checkOutDate);
    const issuedStr     = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const cName         = user?.name  || '-';
    const cEmail        = user?.email || '-';
    const cPhone        = user?.phone || '-';
    const pricePerNight = nights > 0 ? Math.round(booking.subtotal / nights) : booking.subtotal;
    const guestTxt      = booking.guestCount + ' Orang' + (booking.extraBed ? ' + Extra Bed' : '');

    const html = [
      '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/>',
      '<title>Bukti Reservasi Restify - ' + txCode + '</title>',
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">',
      '<style>',
      '* { margin:0; padding:0; box-sizing:border-box; }',
      'body { font-family:"Inter",sans-serif; background:#f0f2ed; color:#2c3327; padding:32px 16px; }',
      '.page { max-width:740px; margin:0 auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.12); }',
      '.banner { background:linear-gradient(135deg,#3d4a33 0%,#5e6b52 60%,#7a8c6a 100%); padding:32px 40px 28px; display:flex; justify-content:space-between; align-items:flex-end; }',
      '.logo-text { font-size:32px; font-weight:900; color:#fff; letter-spacing:2px; }',
      '.logo-sub  { font-size:11px; color:rgba(255,255,255,.65); font-style:italic; margin-top:4px; }',
      '.tag { display:inline-block; background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.35); color:#fff; font-size:13px; font-weight:800; letter-spacing:3px; padding:5px 14px; border-radius:40px; }',
      '.code-line { font-size:11px; color:rgba(255,255,255,.7); margin-top:8px; font-weight:600; text-align:right; }',
      '.status-strip { background:#f7f8f5; border-bottom:1px solid #e4e8df; padding:14px 40px; display:flex; justify-content:space-between; align-items:center; }',
      '.badge { display:inline-flex; align-items:center; gap:7px; background:#e8f5e9; border:1.5px solid #81c784; color:#2e7d32; font-weight:800; font-size:12px; padding:5px 14px; border-radius:40px; }',
      '.dot { width:8px; height:8px; border-radius:50%; background:#2e7d32; }',
      '.body { padding:32px 40px; }',
      '.sec-head { font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#5e6b52; margin-bottom:12px; padding-bottom:6px; border-bottom:2px solid #e4e8df; }',
      '.two-col { display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-bottom:28px; }',
      '.row { display:flex; justify-content:space-between; align-items:baseline; padding:6px 0; border-bottom:1px dashed #eef0ec; font-size:12px; gap:8px; }',
      '.row:last-child { border-bottom:none; }',
      '.lbl { color:#70786c; flex-shrink:0; } .val { font-weight:700; text-align:right; word-break:break-word; }',
      '.tbl-wrap { margin-bottom:24px; border-radius:12px; overflow:hidden; border:1px solid #e4e8df; }',
      'table { width:100%; border-collapse:collapse; font-size:12px; }',
      'thead { background:#5e6b52; color:#fff; }',
      'thead th { padding:10px 14px; font-weight:700; text-align:left; font-size:11px; }',
      'thead th:last-child { text-align:right; }',
      'tbody tr:nth-child(even) { background:#f7f8f5; }',
      'tbody td { padding:11px 14px; border-bottom:1px solid #eef0ec; }',
      'tbody td:last-child { text-align:right; font-weight:700; }',
      '.totals { display:flex; flex-direction:column; align-items:flex-end; gap:6px; margin-bottom:28px; }',
      '.t-row { display:flex; gap:24px; font-size:12px; }',
      '.t-lbl { color:#70786c; } .t-val { font-weight:700; min-width:150px; text-align:right; }',
      '.t-div { width:300px; border:none; border-top:1.5px solid #e4e8df; margin:4px 0; }',
      '.grand { display:flex; align-items:center; gap:20px; background:linear-gradient(135deg,#3d4a33,#5e6b52); color:#fff; padding:14px 20px; border-radius:12px; margin-top:4px; }',
      '.grand-lbl { font-size:13px; font-weight:700; letter-spacing:1px; flex:1; }',
      '.grand-val { font-size:22px; font-weight:900; }',
      '.footer { background:#f7f8f5; border-top:1.5px solid #e4e8df; padding:20px 40px; text-align:center; }',
      '.footer .m1 { font-size:12px; font-weight:700; color:#3d4a33; margin-bottom:4px; }',
      '.footer .m2 { font-size:10px; color:#70786c; }',
      '.footer .fdiv { border:none; border-top:1px dashed #d0d6cb; margin:14px 0; }',
      '.footer .legal { font-size:9px; color:#9aa395; }',
      '@media print { body{background:#fff;padding:0;} .page{border-radius:0;box-shadow:none;max-width:100%;} }',
      '</style></head><body>',
      '<div class="page">',
      '<div class="banner">',
      '  <div><div class="logo-text">RESTIFY</div><div class="logo-sub">Your Trusted Hotel Booking Partner</div></div>',
      '  <div style="text-align:right"><div class="tag">E-RECEIPT</div><div class="code-line">No. Transaksi: ' + txCode + '</div></div>',
      '</div>',
      '<div class="status-strip">',
      '  <div>',
      '    <div style="font-size:10px;color:#70786c;font-weight:700;margin-bottom:5px;">STATUS PEMBAYARAN</div>',
      '    <div class="badge"><div class="dot"></div>LUNAS / TERBAYAR</div>',
      '  </div>',
      '  <div>',
      '    <div style="font-size:10px;color:#70786c;text-align:right;">TANGGAL DITERBITKAN</div>',
      '    <div style="font-size:12px;font-weight:700;text-align:right;">' + issuedStr + '</div>',
      '  </div>',
      '</div>',
      '<div class="body">',
      '<div class="two-col">',
      '  <div>',
      '    <div class="sec-head">Detail Pemesan</div>',
      '    <div class="row"><span class="lbl">Nama</span><span class="val">' + cName + '</span></div>',
      '    <div class="row"><span class="lbl">Email</span><span class="val">' + cEmail + '</span></div>',
      '    <div class="row"><span class="lbl">Telepon</span><span class="val">' + cPhone + '</span></div>',
      '  </div>',
      '  <div>',
      '    <div class="sec-head">Detail Reservasi</div>',
      '    <div class="row"><span class="lbl">Hotel</span><span class="val">' + hotelNm + '</span></div>',
      '    <div class="row"><span class="lbl">Tipe Kamar</span><span class="val">' + roomTp + '</span></div>',
      '    <div class="row"><span class="lbl">Check-in</span><span class="val">' + checkInStr + '</span></div>',
      '    <div class="row"><span class="lbl">Check-out</span><span class="val">' + checkOutStr + '</span></div>',
      '    <div class="row"><span class="lbl">Durasi</span><span class="val">' + nights + ' Malam</span></div>',
      '    <div class="row"><span class="lbl">Tamu</span><span class="val">' + guestTxt + '</span></div>',
      '  </div>',
      '</div>',
      '<div class="sec-head">Rincian Pembayaran</div>',
      '<div class="tbl-wrap">',
      '  <table>',
      '    <thead><tr><th>Deskripsi Layanan</th><th>Harga / Malam</th><th>Durasi</th><th>Subtotal</th></tr></thead>',
      '    <tbody><tr>',
      '      <td><strong>' + roomTp + '</strong><br><span style="color:#70786c;font-size:11px;">' + hotelNm + '</span></td>',
      '      <td>' + fmtRp(pricePerNight) + '</td>',
      '      <td>' + nights + ' Malam</td>',
      '      <td>' + fmtRp(booking.subtotal) + '</td>',
      '    </tr></tbody>',
      '  </table>',
      '</div>',
      '<div class="totals">',
      '  <div class="t-row"><span class="t-lbl">Subtotal</span><span class="t-val">' + fmtRp(booking.subtotal) + '</span></div>',
      '  <div class="t-row"><span class="t-lbl">Pajak &amp; Biaya (10%)</span><span class="t-val">' + fmtRp(booking.taxAndFee) + '</span></div>',
      '  <hr class="t-div"/>',
      '  <div class="grand"><span class="grand-lbl">GRAND TOTAL</span><span class="grand-val">' + fmtRp(booking.total) + '</span></div>',
      '</div>',
      '</div>',
      '<div class="footer">',
      '  <div class="m1">&#x1F64F; Terima kasih telah memilih Restify! Semoga menginap Anda menyenangkan.</div>',
      '  <div class="m2">Tunjukkan e-receipt ini kepada resepsionis saat check-in.</div>',
      '  <hr class="fdiv"/>',
      '  <div class="legal">Dokumen diterbitkan secara digital oleh sistem Restify. &copy; 2025 Restify. Seluruh hak cipta dilindungi.</div>',
      '</div>',
      '</div>',
      '<script>window.onload=function(){window.print();setTimeout(function(){window.close();},800);}<\/script>',
      '</body></html>'
    ].join('\n');

    printWindow.document.write(html);
    printWindow.document.close();
  };



  useEffect(() => {
    if (showReview) {
      if (booking.rating) {
        setRating(booking.rating.rating);
        setReviewText(booking.rating.review || "");
        setReviewPhotoPreview(booking.rating.image_url);
        setReviewPhoto(null);
        setRemoveImage(false);
      } else {
        setRating(5);
        setReviewText("");
        setReviewPhotoPreview(null);
        setReviewPhoto(null);
        setRemoveImage(false);
      }
    }
  }, [showReview, booking.rating]);

  const getFriendlyStatus = () => {
    if (booking.rawStatus === 'cancelled') return 'Dibatalkan';
    if (booking.rawPaymentStatus === 'failed') return 'Gagal / Kadaluarsa';
    if (booking.rawPaymentStatus === 'pending') return 'Menunggu Pembayaran';
    if (booking.rawStatus === 'pending') return 'Menunggu Konfirmasi Resepsionis';
    if (booking.rawStatus === 'confirmed') return 'Dikonfirmasi (Menunggu Check-in)';
    if (booking.rawStatus === 'checked_in') return 'Sedang Menginap';
    if (booking.rawStatus === 'completed') return 'Selesai (Checked-out)';
    return booking.rawStatus;
  };

  const handleCancel = async () => {
    try {
      await api.post(`/user/cancel-booking/${booking.id}`);
      toast.success("Booking berhasil dibatalkan!");
      onActionSuccess();
      onBack();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membatalkan booking.");
    }
  };

  const handlePay = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const payRes = await api.post(`/user/pay/${booking.id}`);
      const snapToken = payRes.data.snap_token;
      
      const snapInstance = (window as any).snap;
      if (!snapInstance) {
          toast.error("Sistem pembayaran sedang bersiap. Silakan coba sesaat lagi.");
          setIsPaying(false);
          return;
      }
      if (typeof snapInstance.hide === 'function') {
          try { snapInstance.hide(); } catch (e) {}
      }

      snapInstance.pay(snapToken, {
          onSuccess: function(){
              toast.success('Pembayaran berhasil!');
              setIsPaying(false);
              onActionSuccess();
              onBack();
          },
          onPending: function(){
              toast.info('Menunggu pembayaran Anda...');
              setIsPaying(false);
          },
          onError: function(){
              toast.error('Pembayaran gagal!');
              setIsPaying(false);
          },
          onClose: function(){
              toast.warning('Anda menutup popup tanpa menyelesaikan pembayaran');
              setIsPaying(false);
          }
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Gagal memproses pembayaran.');
      setIsPaying(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReviewPhoto(file);
    setReviewPhotoPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemovePhoto = () => {
    setReviewPhoto(null);
    setReviewPhotoPreview(null);
    setRemoveImage(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Silakan tulis komentar ulasan Anda terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', String(booking.id));
      formData.append('rating', String(rating));
      formData.append('review', reviewText);
      if (reviewPhoto) {
        formData.append('image', reviewPhoto);
      }
      if (removeImage) {
        formData.append('remove_image', '1');
      }
      await api.post('/user/ratings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(booking.rating ? "Ulasan berhasil diperbarui!" : "Ulasan berhasil dikirim!");
      setShowReview(false);
      setReviewText("");
      setRating(5);
      setReviewPhoto(null);
      setReviewPhotoPreview(null);
      setRemoveImage(false);
      onActionSuccess();
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstMsg = Object.values(errors)[0] as string[];
        toast.error(firstMsg[0] || "Validasi gagal.");
      } else {
        toast.error(error.response?.data?.message || "Gagal mengirim ulasan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Tanggal Pemesanan', value: `${formatTanggal(booking.bookedAt)} | ${formatJam(booking.bookedAt)}` },
    { label: 'Check In', value: formatTanggal(booking.checkIn) },
    { label: 'Check Out', value: formatTanggal(booking.checkOut) },
    { label: 'Tipe Kamar', value: booking.roomType },
    { label: 'Jumlah Tamu', value: `${booking.guestCount} Orang` },
    { label: 'Ekstra Kasur', value: booking.extraBed > 0 ? `${booking.extraBed} Kasur` : 'Tidak Ada' },
    { label: 'Status Reservasi', value: getFriendlyStatus() }
  ];

  const getContainerBg = () => {
    if (booking.rawStatus === 'cancelled' || booking.rawPaymentStatus === 'failed') return 'bg-[#DE8478]';
    if (booking.rawPaymentStatus === 'pending') return 'bg-[#DEAC78]';
    if (booking.rawStatus === 'checked_in') return 'bg-[#558B6E]';
    if (booking.rawStatus === 'completed') return 'bg-[#8F81A3]';
    return 'bg-[#5E6B52]';
  };

  return (
    <div className={`w-full rounded-[24px] text-white shadow-lg overflow-hidden transition-colors ${getContainerBg()}`}>
      {}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="shrink-0 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Kembali"
        >
          <RiArrowLeftLine className="text-[18px]" />
        </button>
        <h3 className="flex-1 text-center text-[16px] font-black pr-9 truncate uppercase tracking-wider">{booking.hotelName}</h3>
      </div>

      {}
      <div className="px-6 pt-5 pb-2 flex flex-col gap-2.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-xs font-medium">
            <span className="opacity-75">{label}</span>
            <span className="font-extrabold text-right">{value}</span>
          </div>
        ))}
      </div>

      {}
      <div className="mx-6 my-2.5 border-t border-white/15" />

      {}
      <div className="px-6 pb-5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="opacity-75">Subtotal</span>
          <span className="font-extrabold">{formatRupiah(booking.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="opacity-75">Pajak &amp; Biaya (10%)</span>
          <span className="font-extrabold">{formatRupiah(booking.taxAndFee)}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-black">
          <span>Total Pembayaran</span>
          <span>{formatRupiah(booking.total)}</span>
        </div>

        {}
        <div className="mt-4 flex flex-col items-center gap-3 w-full">
          {booking.rawStatus !== 'completed' && booking.rawStatus !== 'cancelled' && booking.rawPaymentStatus !== 'failed' && (
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-white/20 border border-white/30 text-white rounded-xl py-3 text-xs font-black hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <RiFileTextLine className="text-[14px]" />
              Unduh Bukti Pembayaran (PDF)
            </button>
          )}

          {}
          {booking.rawPaymentStatus === 'pending' && booking.rawStatus === 'pending' && (
            <div className="flex w-full gap-3">
              <button
                onClick={handlePay}
                disabled={isPaying}
                className={`flex-1 bg-white text-gray-800 rounded-xl py-3 text-xs font-black hover:bg-gray-50 transition-colors shadow-sm ${isPaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 bg-red-600/30 border border-red-500/50 text-white rounded-xl py-3 text-xs font-black hover:bg-red-600/50 transition-colors"
              >
                Batalkan Pesanan
              </button>
            </div>
          )}

          {}
          {booking.rawPaymentStatus === 'paid' && booking.rawStatus === 'pending' && (
            <div className="flex flex-col w-full gap-3">
              <div className="flex items-center justify-between bg-white/15 rounded-xl px-4 py-3 text-xs">
                <span className="opacity-80">Kode Transaksi:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-wider">{showCode ? booking.transactionCode : '••••••'}</span>
                  <button onClick={() => setShowCode(!showCode)}>
                    {showCode ? <RiEyeOffLine className="text-[14px]" /> : <RiEyeLine className="text-[14px]" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full bg-red-600/30 border border-red-500/50 text-white rounded-xl py-3 text-xs font-black hover:bg-red-600/50 transition-colors"
              >
                Batalkan Pesanan
              </button>
            </div>
          )}

          {}
          {booking.rawStatus === 'confirmed' && (
            <div className="flex items-center justify-between w-full bg-white/15 rounded-xl px-4 py-3 text-xs">
              <span className="opacity-80">Kode Transaksi:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider">{showCode ? booking.transactionCode : '••••••'}</span>
                <button onClick={() => setShowCode(!showCode)}>
                  {showCode ? <RiEyeOffLine className="text-[14px]" /> : <RiEyeLine className="text-[14px]" />}
                </button>
              </div>
            </div>
          )}

          {}
          {booking.rawStatus === 'completed' && (
            <>
              <button
                onClick={() => setShowReview(true)}
                className="bg-white text-gray-800 rounded-xl px-10 py-2.5 text-xs font-black hover:bg-gray-50 transition-colors shadow-sm"
              >
                {booking.rating ? "Edit Ulasan / Rating" : "Tulis Ulasan / Rating"}
              </button>

              {}
              {showReview && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowReview(false)}
                >
                  <div
                    className="bg-white rounded-[24px] p-6 w-full max-w-sm mx-4 shadow-2xl animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 className="text-base font-black text-gray-800 mb-1">
                      {booking.rating ? "Edit Ulasan / Rating" : "Tulis Ulasan / Rating"}
                    </h4>
                    <p className="text-[11px] font-bold text-gray-400 mb-5 uppercase tracking-wide">{booking.roomType}</p>

                    {}
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Peringkat (Rating)</label>
                    <div className="flex gap-1.5 mb-5 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                        >
                          {star <= rating ? (
                            <RiStarFill className="text-yellow-400" />
                          ) : (
                            <RiStarLine className="text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>

                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Komentar Ulasan</label>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Bagikan pengalaman menginap Anda di sini..."
                      className="w-full bg-[#FFFDF0] rounded-xl px-4 py-3 text-xs text-gray-700 outline-none resize-none mb-4 border border-transparent focus:border-[#5E6B52]"
                    />

                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Foto (Opsional)</label>
                    {reviewPhotoPreview ? (
                      <div className="relative mb-5">
                        <img
                          src={reviewPhotoPreview}
                          alt="Preview foto ulasan"
                          className="w-full h-36 object-cover rounded-xl"
                        />
                        <button
                          onClick={handleRemovePhoto}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                          <RiCloseLine className="text-[14px]" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 mb-5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#5E6B52] hover:bg-[#FFFDF0] transition-colors">
                        <RiImageAddLine className="text-2xl text-gray-300 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400">Tambah Foto</span>
                        <input
                          type="file"
                          accept="image/jpg,image/jpeg,image/png"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => { setShowReview(false); handleRemovePhoto(); }}
                        className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-full bg-[#5E6B52] text-white text-xs font-bold hover:bg-[#4a5440] transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Mengirim..." : (booking.rating ? "Simpan" : "Kirim")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {}
          {booking.rawStatus === 'cancelled' && (
            <span className="text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white tracking-widest">
              Pesanan Dibatalkan
            </span>
          )}
        </div>
      </div>

      {/* Kustom Premium Modal Konfirmasi Pembatalan */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 animate-fade-in-up text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl select-none">⚠️</span>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Batalkan Pesanan?</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-8">
              Apakah Anda benar-benar yakin ingin membatalkan pesanan di <span className="font-bold text-[#5E6B52]">{booking.hotelName}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowCancelConfirm(false);
                  handleCancel();
                }}
                className="flex-1 py-4 bg-[#E34A42] text-white rounded-2xl font-black text-xs hover:bg-[#c93f38] transition-colors shadow-lg shadow-red-500/20"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RiwayatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const selectedBookingRef = useRef<Booking | null>(null);

  useEffect(() => {
    selectedBookingRef.current = selectedBooking;
  }, [selectedBooking]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'user') {
        router.push('/home');
      }
    }
  }, [user, authLoading, router]);

  const fetchBookingHistory = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await api.get('/user/booking-history');
      const fetchedData = response.data.data || response.data || [];
      const mapped = fetchedData.map((b: any) => ({
        id: b.id,
        hotelName: b.room?.hotel?.name || 'Hotel',
        hotelId: b.room?.hotel?.id || b.room?.hotel_id,
        checkIn: b.check_in_date,
        checkOut: b.check_out_date,
        roomType: b.room?.room_type || 'Kamar',
        guestCount: b.guests,
        extraBed: b.extra_bed,
        bookedAt: b.created_at || b.check_in_date,
        subtotal: parseFloat(b.total_price) * 0.9,
        taxAndFee: parseFloat(b.total_price) * 0.1,
        total: parseFloat(b.total_price),
        rawStatus: b.status,
        rawPaymentStatus: b.payment_status,
        status: (b.status === 'cancelled' || b.payment_status === 'failed') ? 'completed' : 'active',
        transactionCode: b.payment?.transaction_code || 'TRX-UNKNOWN',
        rating: b.rating || null,
      }));
      
      setBookings(mapped);

      const currentSelected = selectedBookingRef.current;
      if (currentSelected) {
        const updatedDetail = mapped.find((item: Booking) => item.id === currentSelected.id);
        if (updatedDetail) {
          if (
            updatedDetail.rawStatus !== currentSelected.rawStatus ||
            updatedDetail.rawPaymentStatus !== currentSelected.rawPaymentStatus
          ) {
            setSelectedBooking(updatedDetail);
          }
        }
      }
    } catch (error) {
      console.warn("Gagal memuat riwayat booking:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchBookingHistory(true);
      const interval = setInterval(() => fetchBookingHistory(false), 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="w-full pt-6 pb-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[26px] font-black text-gray-800 tracking-tight">Riwayat Pemesanan</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Daftar semua reservasi hotel Anda</p>
        <div className="w-16 h-1 bg-[#5E6B52] rounded-full mx-auto mt-3" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Memuat riwayat pemesanan...</div>
        ) : selectedBooking ? (
          <BookingDetail
            booking={selectedBooking}
            onBack={() => setSelectedBooking(null)}
            onActionSuccess={() => fetchBookingHistory(false)}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏨</div>
                <p className="text-gray-400 text-sm font-bold">Belum ada riwayat pemesanan.</p>
                <p className="text-gray-300 text-xs mt-1">Pesan hotel pertama Anda sekarang!</p>
              </div>
            ) : (
              bookings.map((b) => (
                <BookingCard key={b.id} booking={b} onSelect={setSelectedBooking} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
