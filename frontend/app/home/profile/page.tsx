'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiFileTextLine, RiEyeLine, RiEyeOffLine, RiStarFill, RiStarLine, RiCameraLine, RiImageAddLine, RiCloseLine } from 'react-icons/ri';
import {
  type Booking as MockBooking,
  formatTanggal,
  formatTanggalSingkat,
  formatJam,
  formatRupiah,
} from '@/data/mockBookings';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';




type ActiveTab = 'profil' | 'riwayat' | 'logout';

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
      
      // Dynamically ensure Snap script is loaded
      const snapInstance = await new Promise<any>((resolve) => {
          if ((window as any).snap) {
              if (typeof (window as any).snap.hide === 'function') {
                  try { (window as any).snap.hide(); } catch (e) {}
              }
              resolve((window as any).snap);
              return;
          }
          const script = document.createElement("script");
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute("data-client-key", "Mid-client-XxTfLCZ76GoQZj3Z");
          script.onload = () => resolve((window as any).snap);
          script.onerror = () => resolve(null);
          document.body.appendChild(script);
      });

      if (!snapInstance) {
          toast.error("Gagal memuat sistem pembayaran Midtrans. Silakan coba beberapa saat lagi.");
          setIsPaying(false);
          return;
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
        <div className="mt-4 flex flex-col items-center gap-3">
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




export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profil');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

  const selectedBookingRef = useRef<Booking | null>(null);

  useEffect(() => {
    selectedBookingRef.current = selectedBooking;
  }, [selectedBooking]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePic(user.profile_picture_url || null);
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);
    setIsUploading(true);

    try {
      const res = await api.post('/user/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newPicUrl = res.data.image_url;
      setProfilePic(newPicUrl);
      toast.success("Foto profil berhasil diperbarui!");
      
      
      const profileRes = await api.get('/profile');
      const token = localStorage.getItem("token") || "";
      login(token, profileRes.data.user);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal mengunggah foto profil.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Nama dan email tidak boleh kosong.");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      await api.post('/user/update-profile', {
        name: editName,
        email: editEmail
      });
      toast.success("Profil berhasil diperbarui!");
      
      
      const profileRes = await api.get('/profile');
      const token = localStorage.getItem("token") || "";
      login(token, profileRes.data.user);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }
    
    
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      toast.error("Kata sandi harus mengandung huruf besar, huruf kecil, dan angka.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsChangingPassword(true);
    try {
      
      const forgotRes = await api.post('/forgot-password', { email: user?.email });
      const token = forgotRes.data.token;

      if (!token) {
        throw new Error("Gagal membuat token reset.");
      }

      
      await api.post('/reset-password', {
        email: user?.email,
        token: token,
        password: newPassword,
        password_confirmation: newPasswordConfirm
      });

      toast.success("Kata sandi berhasil diubah!");
      setShowPasswordModal(false);
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error: any) {
      console.error(error);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstErrorMessage = validationErrors[firstErrorKey][0];
        toast.error(firstErrorMessage);
      } else {
        toast.error(error.response?.data?.message || "Gagal mengubah kata sandi.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fetchBookingHistory = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchBookingHistory();

    const interval = setInterval(fetchBookingHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    notify.auth.logoutSuccess();
    router.push('/login');
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] flex items-center justify-center p-4 py-8 mb-10 overflow-y-auto md:overflow-hidden">

      {}
      <div
        className="absolute inset-0 z-0 opacity-25 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/bg-doodles.jpg')` }}
      />

      {}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden md:overflow-visible h-auto md:h-[560px] relative z-10 border border-gray-50">

        {}
        {}
        {}
        <div className="w-full md:w-[35%] bg-[#FFFDF0] p-8 flex flex-col items-center">
          <div className="mb-4 mt-2">
            <Image src="/images/logo-putih.png" alt="Restify Logo" width={160} height={45} className="object-contain" priority />
          </div>
          <div className="w-full h-px bg-gray-300/60 mb-10 mt-2" />

          <div className="flex flex-col gap-5 w-full px-2">
            <button
              onClick={() => { setActiveTab('profil'); setSelectedBooking(null); }}
              className={`w-full py-3.5 rounded-full font-bold text-[14px] transition-all shadow-sm
                ${activeTab === 'profil' ? 'bg-[#5E6B52] text-white' : 'bg-[#ACB5A4] text-white hover:bg-[#8f9888]'}`}
            >
              Profil Saya
            </button>

            <button
              onClick={() => { setActiveTab('riwayat'); setSelectedBooking(null); }}
              className={`w-full py-3.5 rounded-full font-bold text-[14px] transition-all shadow-sm
                ${activeTab === 'riwayat' ? 'bg-[#5E6B52] text-white' : 'bg-[#ACB5A4] text-white hover:bg-[#8f9888]'}`}
            >
              Riwayat Pemesanan
            </button>

            <button
              onClick={() => setActiveTab('logout')}
              className={`w-full py-3.5 rounded-full font-bold text-[14px] transition-all shadow-sm
                ${activeTab === 'logout' ? 'bg-[#E34A42] text-white' : 'bg-[#F2A299] text-white hover:bg-[#de8478]'}`}
            >
              Logout
            </button>
          </div>
        </div>

        {}
        {}
        {}
        <div className="w-full md:w-[65%] p-8 md:p-10 flex flex-col overflow-y-auto">

          {}
          {activeTab === 'profil' && (
            <form onSubmit={handleUpdateProfile} className="w-full max-w-md mx-auto animate-fade-in pl-0 md:pl-4 flex flex-col justify-center flex-1">
              
              {}
              <div className="flex flex-col items-center mb-6 relative">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 group">
                  {profilePic ? (
                    <img src={profilePic} alt="Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#5E6B52] text-white font-black text-3xl uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-1 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <RiCameraLine className="text-base" />
                    <span>UBAH FOTO</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadPhoto} disabled={isUploading} />
                  </label>
                </div>
                {isUploading && (
                  <span className="text-[10px] text-gray-400 font-bold mt-2 animate-pulse">Mengunggah foto...</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-800 mb-2">Nama</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required
                  className="w-full bg-[#FFFDF0] px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#5E6B52] transition-colors" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-800 mb-2">Email</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required
                  className="w-full bg-[#FFFDF0] px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#5E6B52] transition-colors" />
              </div>
              <div className="mb-1">
                <label className="block text-xs font-bold text-gray-800 mb-2">Kata Sandi</label>
                <input type="password" value="*************" readOnly
                  className="w-full bg-gray-50 border border-transparent px-4 py-3 rounded-xl text-lg font-medium text-gray-400 outline-none tracking-widest cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-[11px] text-[#5E6B52] font-black hover:underline uppercase tracking-widest"
                >
                  Ganti Password
                </button>
                <button type="submit" disabled={isUpdatingProfile}
                  className="bg-[#5E6B52] text-white px-6 py-2.5 rounded-full text-xs font-black hover:bg-[#4a5440] transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}

          {}
          {activeTab === 'riwayat' && (
            <div className="w-full flex flex-col animate-fade-in">
              {}
              <h2 className="text-[22px] font-bold text-gray-800 text-center mb-1">Riwayat Pemesanan</h2>
              <div className="w-full h-px bg-gray-200 mb-5" />

              {}
              {selectedBooking ? (
                <BookingDetail
                  booking={selectedBooking}
                  onBack={() => setSelectedBooking(null)}
                  onActionSuccess={fetchBookingHistory}
                />
              ) : (
                
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1
                  scrollbar-thin scrollbar-thumb-[#5E6B52]/50 scrollbar-track-transparent">
                  {bookings.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-10">Belum ada riwayat pemesanan.</p>
                  ) : (
                    bookings.map((b) => (
                      <BookingCard key={b.id} booking={b} onSelect={setSelectedBooking} />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === 'logout' && (
            <div className="w-full h-full flex flex-col items-center justify-center pb-10 animate-fade-in flex-1">
              <h2 className="text-[26px] font-medium mb-12 text-center max-w-[350px] leading-snug">
                Apakah anda yakin ingin keluar?
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('profil')}
                  className="bg-[#ACB5A4] text-white font-medium text-lg px-12 py-2.5 rounded-2xl hover:bg-[#8f9888] transition-colors shadow-sm font-bold uppercase tracking-wider text-sm"
                >
                  Tidak
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#E34A42] text-white font-medium text-lg px-12 py-2.5 rounded-2xl hover:bg-red-700 transition-colors shadow-sm font-bold uppercase tracking-wider text-sm"
                >
                  Iya
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPasswordModal(false)}
        >
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-[24px] p-6 w-full max-w-sm mx-4 shadow-2xl animate-fade-in text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-black text-gray-800 mb-5 uppercase tracking-wide text-center">Ganti Kata Sandi</h4>

            <div className="mb-4 relative">
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 karakter (huruf besar, kecil, angka)"
                  required
                  className="w-full bg-[#FFFDF0] pl-4 pr-12 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-transparent focus:border-[#5E6B52] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <RiEyeOffLine className="text-[16px]" /> : <RiEyeLine className="text-[16px]" />}
                </button>
              </div>
            </div>

            <div className="mb-6 relative">
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type={showNewPasswordConfirm ? "text" : "password"}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="Masukkan kembali kata sandi"
                  required
                  className="w-full bg-[#FFFDF0] pl-4 pr-12 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-transparent focus:border-[#5E6B52] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPasswordConfirm ? <RiEyeOffLine className="text-[16px]" /> : <RiEyeLine className="text-[16px]" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex-1 py-2.5 rounded-full bg-[#5E6B52] text-white text-xs font-bold hover:bg-[#4a5440] transition-colors disabled:opacity-50"
              >
                {isChangingPassword ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
