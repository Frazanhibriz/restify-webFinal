"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./HotelDetail.module.css";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { FaMapMarkerAlt, FaStar, FaChevronLeft, FaRegHeart, FaWifi, FaCoffee, FaShower, FaTv, FaUserFriends } from 'react-icons/fa';
import { FiClock, FiShield, FiArrowRight } from 'react-icons/fi';

function HotelDetailContent() {
  const getFallbackImage = (id: number | string) => {
    const images = [
        '/images/HotelImages/Puteri-Gunung-Hotel.jpg',
        '/images/HotelImages/Hotel-Savoy-Homann-Bandung.jpg',
        '/images/HotelImages/Ivory-Hotel-Bandung.jpg',
        '/images/HotelImages/Mutiara-Hotel-and-Convention-Bandung.jpg',
        '/images/HotelImages/Urbanview-Hotel-Grand-Malabar-Bandung.jpg',
        '/images/HotelImages/aryaduta-bandung.jpg',
        '/images/HotelImages/Hilton-Bandung.jpg',
        '/images/HotelImages/Mercure-Bandung-City-Centre.jpg'
    ];
    const numId = typeof id === 'number' ? id : parseInt(id, 10) || 0;
    return images[numId % images.length];
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get("id");

  const [hotelData, setHotelData] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tab, setTab] = useState("tentang");
  const [showBooking, setShowBooking] = useState(false);
  const [step, setStep] = useState("form");

  const [guest, setGuest] = useState(1);
  const [extraBed, setExtraBed] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotelDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/hotels/${hotelId}`);
        setHotelData(res.data);
        setRooms(res.data.rooms || []);
        if (res.data.rooms?.length > 0) {
            setSelectedRoomId(res.data.rooms[0].id);
        }
      } catch (error) {
        console.error("Gagal mengambil detail hotel:", error);
        toast.error("Hotel tidak ditemukan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetail();
  }, [hotelId]);

  const handlePayment = async () => {
    if (!selectedRoomId || !checkIn || !checkOut) {
      toast.error('Harap lengkapi data pemesanan (kamar, tanggal check-in & check-out).');
      return;
    }
    
    try {
        const bookingRes = await api.post('/user/booking', {
            room_id: selectedRoomId,
            check_in_date: checkIn,
            check_out_date: checkOut,
            guests: guest,
            extra_bed: extraBed > 0 ? 1 : 0
        });
        
        const bookingId = bookingRes.data.data.booking_id || bookingRes.data.data.id;
        const payRes = await api.post(`/user/pay/${bookingId}`);
        const snapToken = payRes.data.snap_token;
        
        (window as any).snap.pay(snapToken, {
            onSuccess: function(){
                toast.success('Pembayaran berhasil!');
                setStep('success');
            },
            onPending: function(){ toast.info('Menunggu pembayaran Anda...'); },
            onError: function(){ toast.error('Pembayaran gagal!'); },
            onClose: function(){ toast.warning('Anda menutup popup tanpa menyelesaikan pembayaran'); }
        });
        
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memproses pembayaran. Pastikan Anda sudah login.');
    }
  };

  const handleSubmitReview = async () => {
    try {
        await api.post('/user/ratings', {
            hotel_id: hotelId,
            rating: rating,
            comment: reviewText
        });
        toast.success("Ulasan berhasil dikirim!");
        setShowReview(false);
        const res = await api.get(`/hotels/${hotelId}`);
        setHotelData(res.data);
    } catch (error) {
        toast.error("Gagal mengirim ulasan. Pastikan Anda sudah login dan sudah pernah menginap.");
    }
  };

  const handleOpenMap = () => {
    if (!hotelData) return;
    const name = encodeURIComponent(hotelData.name || "");
    const location = encodeURIComponent(hotelData.address || hotelData.city || "");
    const lat = hotelData.latitude || "";
    const lng = hotelData.longitude || "";
    router.push(`/map?name=${name}&location=${location}&lat=${lat}&lng=${lng}`);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-restify-olive">Memuat detail hotel...</div>;
  if (!hotelData) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Hotel tidak ditemukan</div>;

  const currentRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {}
      <div className="absolute top-0 left-0 w-full z-10 px-6 py-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <FaChevronLeft />
        </button>
        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all">
            <FaRegHeart />
        </button>
      </div>

      {}
      <div className="relative w-full h-[45vh] md:h-[55vh]">
        <img 
          src={hotelData.image_url} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage(hotelId || 1);
          }}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-10 left-0 w-full px-8 text-white animate-fade-in-up">
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-yellow-400 text-black px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-extrabold">
                            <FaStar /> {hotelData.average_rating || "0.0"}
                        </div>
                        <span className="text-xs font-medium text-white/80 tracking-widest uppercase">{hotelData.city}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-1">{hotelData.name}</h1>
                    <p className="flex items-center gap-1.5 text-white/80 text-sm italic">
                        <FaMapMarkerAlt className="text-restify-olive" /> {hotelData.address}
                    </p>
                </div>
                <button
                    onClick={handleOpenMap}
                    className="bg-[#657657] hover:bg-[#525f46] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-black/20 flex items-center gap-2 shrink-0 self-end mb-1"
                >
                    <FaMapMarkerAlt /> Lihat Map
                </button>
            </div>
        </div>
      </div>

      {}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
                        {['tentang', 'foto', 'ulasan'].map((t) => (
                            <button 
                                key={t} 
                                onClick={() => setTab(t)}
                                className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${tab === t ? 'border-restify-olive text-restify-olive' : 'border-transparent text-gray-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {tab === "tentang" && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold mb-6">Fasilitas Populer</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl gap-2">
                                    <FaWifi className="text-restify-olive text-xl" />
                                    <span className="text-xs font-bold">WiFi Gratis</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl gap-2">
                                    <FaCoffee className="text-restify-olive text-xl" />
                                    <span className="text-xs font-bold">Sarapan</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl gap-2">
                                    <FaShower className="text-restify-olive text-xl" />
                                    <span className="text-xs font-bold">Kamar Mandi</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl gap-2">
                                    <FaTv className="text-restify-olive text-xl" />
                                    <span className="text-xs font-bold">TV Kabel</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-4">Deskripsi</h3>
                            <p className="text-gray-500 leading-relaxed text-[15px]">{hotelData.description || "Nikmati pengalaman menginap tak terlupakan di hotel kami yang berlokasi strategis."}</p>
                        </div>
                    )}

                    {tab === "foto" && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <img 
                                src={hotelData.image_url} 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = getFallbackImage(hotelId || 1);
                                }}
                                className="w-full h-48 object-cover rounded-2xl shadow-sm" 
                            />
                            <div className="grid grid-cols-1 gap-4">
                                <img 
                                    src={getFallbackImage((parseInt(hotelId || '1', 10) + 1))} 
                                    alt="Detail Hotel 2"
                                    className="w-full h-22 object-cover rounded-2xl shadow-sm" 
                                />
                                <img 
                                    src={getFallbackImage((parseInt(hotelId || '1', 10) + 2))} 
                                    alt="Detail Hotel 3"
                                    className="w-full h-22 object-cover rounded-2xl shadow-sm" 
                                />
                            </div>
                        </div>
                    )}

                    {tab === "ulasan" && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">Apa Kata Tamu?</h3>
                            </div>
                            <div className="space-y-6">
                            {hotelData.ratings?.length > 0 ? hotelData.ratings.map((r: any) => (
                                <div key={r.id} className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                                <div className="flex items-center gap-4 mb-3">
                                    <img src={r.user?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || 'User')}&background=random`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                                    <div>
                                    <strong className="block text-sm">{r.user?.name}</strong>
                                    <div className="flex text-yellow-500 text-[10px]">{"★".repeat(r.rating)}</div>
                                    </div>
                                </div>
                                {r.review && (
                                    <p className="text-gray-600 text-sm italic mb-3">"{r.review}"</p>
                                )}
                                {r.image_url && (
                                    <img
                                    src={r.image_url}
                                    alt="Foto ulasan"
                                    className="w-full max-h-56 object-cover rounded-2xl mt-1 border border-gray-100"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                )}
                                </div>
                            )) : <p className="text-gray-400 italic text-center py-10">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50 sticky top-28">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Harga Per Malam</span>
                    <div className="flex items-baseline gap-2 mb-8">
                        <h2 className="text-3xl font-black text-black">Rp {parseFloat(hotelData.lowest_price || hotelData.price || 0).toLocaleString('id-ID')}</h2>
                        <span className="text-sm text-gray-400">/malam</span>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <FiClock className="text-restify-olive text-lg" />
                            <span>Check-in tersedia dari 14:00</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <FiShield className="text-restify-olive text-lg" />
                            <span>Pembayaran Aman & Terjamin</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowBooking(true); setStep("form"); }}
                        className="w-full bg-restify-olive text-white py-5 rounded-3xl font-black text-lg hover:shadow-2xl hover:shadow-restify-olive/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        Booking Sekarang <FiArrowRight />
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-400 mt-4 font-medium uppercase tracking-tighter">
                        Tanpa biaya pembatalan tersembunyi
                    </p>
                </div>
            </div>
        </div>
      </div>

      {}
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowBooking(false)} />
          
          {step === "form" && (
            <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up h-[90vh] md:h-auto overflow-y-auto">
              <div className="md:w-1/3 bg-restify-olive p-10 text-white flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-black mb-2">Pilih Detail<br/>Pemesanan</h2>
                    <p className="text-white/60 text-sm">Pastikan tanggal dan tipe kamar sudah sesuai.</p>
                </div>
                <div className="mt-20">
                    <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><FaUserFriends /></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-white/50">Tamu</span>
                            <p className="font-bold text-sm">{guest} Orang</p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="md:w-2/3 p-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2">Tanggal Check-in</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-restify-olive" />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2">Tanggal Check-out</label>
                        <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-restify-olive" />
                    </div>
                </div>

                <div className="mb-10">
                    <label className="block text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Pilih Tipe Kamar</label>
                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {rooms.map((r) => (
                            <div key={r.id} onClick={() => setSelectedRoomId(r.id)} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedRoomId === r.id ? 'border-restify-olive bg-restify-olive/5 shadow-md' : 'border-gray-50 hover:border-gray-200'}`}>
                                <div>
                                    <p className="font-black text-sm">{r.room_type}</p>
                                    <p className="text-[12px] text-restify-olive font-bold">Rp {parseFloat(r.price).toLocaleString('id-ID')}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoomId === r.id ? 'border-restify-olive' : 'border-gray-200'}`}>
                                    {selectedRoomId === r.id && <div className="w-2.5 h-2.5 bg-restify-olive rounded-full" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setShowBooking(false)} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600">Batal</button>
                    <button onClick={() => setStep("payment")} className="flex-[2] bg-restify-dark text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all">Lanjut ke Pembayaran</button>
                </div>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 animate-fade-in-up">
              <h2 className="text-2xl font-black mb-8 text-center">Ringkasan Pesanan</h2>
              
              <div className="bg-gray-50 rounded-3xl p-6 space-y-4 mb-8">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Hotel:</span> <span className="font-bold">{hotelData.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Durasi:</span> <span className="font-bold">{checkIn} s/d {checkOut}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Tipe Kamar:</span> <span className="font-bold">{currentRoom?.room_type}</span></div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                    <span className="font-bold">Total Pembayaran</span>
                    <span className="text-xl font-black text-restify-olive">Rp {parseFloat(currentRoom?.price || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handlePayment} className="w-full bg-restify-olive text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-restify-olive/20 hover:opacity-90 transition-all">Bayar Sekarang</button>
                <button onClick={() => setStep("form")} className="w-full py-4 text-gray-400 font-bold text-sm">Kembali Edit Detail</button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-12 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiShield className="text-5xl text-green-600" />
              </div>
              <h1 className="text-3xl font-black mb-4">Berhasil!</h1>
              <p className="text-gray-500 mb-10 leading-relaxed">Kamar Anda telah dipesan dengan sukses. Detail reservasi dapat dilihat pada menu Riwayat.</p>
              <button onClick={() => router.push("/home")} className="w-full bg-restify-dark text-white py-5 rounded-3xl font-black">Kembali ke Beranda</button>
            </div>
          )}
        </div>
      )}

      {showReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReview(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 animate-fade-in-up">
            <h3 className="text-xl font-black mb-2">Beri Ulasan</h3>
            <p className="text-gray-400 text-sm mb-8">Pengalaman Anda sangat berharga bagi kami.</p>
            
            <div className="flex justify-center gap-3 mb-8">
              {[1,2,3,4,5].map((i) => (
                <span key={i} onClick={() => setRating(i)} className={`text-4xl cursor-pointer transition-all ${i <= rating ? 'text-yellow-400 scale-110' : 'text-gray-100'}`}>★</span>
              ))}
            </div>

            <textarea placeholder="Ceritakan pengalaman menginapmu..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm min-h-[150px] outline-none focus:border-restify-olive mb-8" />
            
            <div className="flex gap-4">
                <button onClick={() => setShowReview(false)} className="flex-1 py-4 text-gray-400 font-bold">Batal</button>
                <button onClick={handleSubmitReview} className="flex-[2] bg-restify-olive text-white py-4 rounded-2xl font-black shadow-lg">Kirim Ulasan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelDetail() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-restify-olive">Memuat...</div>}>
            <HotelDetailContent />
        </Suspense>
    );
}
