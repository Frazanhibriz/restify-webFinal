"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./HotelDetail.module.css";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { FaMapMarkerAlt, FaStar, FaChevronLeft, FaRegHeart, FaHeart, FaWifi, FaCoffee, FaShower, FaTv, FaUserFriends } from 'react-icons/fa';
import { FiClock, FiShield, FiArrowRight } from 'react-icons/fi';
import { calculateDistance, getCityCenter } from '@/lib/distance';
import { getFallbackImage, formatRupiah } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';


function HotelDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get("id");
  const { user, token } = useAuth();

  const [hotelData, setHotelData] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setUserCoords({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  });
              },
              (error) => {
                  console.log("Geolocation error:", error);
                  if (hotelData?.city) {
                      setUserCoords(getCityCenter(hotelData.city));
                  } else {
                      setUserCoords(getCityCenter("Bandung"));
                  }
              }
          );
      } else {
          if (hotelData?.city) {
              setUserCoords(getCityCenter(hotelData.city));
          } else {
              setUserCoords(getCityCenter("Bandung"));
          }
      }
  }, [hotelData]);

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
  const [isPaying, setIsPaying] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();

  const currentRoom = rooms.find(r => r.id === selectedRoomId);

  useEffect(() => {
    if (currentRoom && guest > currentRoom.capacity) {
      setGuest(currentRoom.capacity);
      toast.info(`Jumlah tamu disesuaikan dengan kapasitas kamar (${currentRoom.capacity} orang)`);
    }
  }, [selectedRoomId, currentRoom, guest]);

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotelDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/hotels/${hotelId}`);
        setHotelData(res.data);
        setRooms(res.data.rooms || []);
        if (res.data.rooms?.length > 0) {
            const firstAvailableRoom = res.data.rooms.find((r: any) => r.status === 'available');
            if (firstAvailableRoom) {
                setSelectedRoomId(firstAvailableRoom.id);
            } else {
                setSelectedRoomId(res.data.rooms[0].id);
            }
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
    if (isPaying) return;
    
    // Guard: check if user is logged in
    if (!token || !user) {
      toast.error('Anda harus login terlebih dahulu untuk melakukan pemesanan.');
      router.push('/login');
      return;
    }
    
    // Guard: only regular users can book
    if (user.role !== 'user') {
      toast.error(`Akun ${user.role} tidak dapat melakukan pemesanan. Silakan login dengan akun tamu.`);
      return;
    }
    
    if (!selectedRoomId || !checkIn || !checkOut) {
      toast.error('Harap lengkapi data pemesanan (kamar, tanggal check-in & check-out).');
      return;
    }
    
    setIsPaying(true);
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
                setStep('success');
                setIsPaying(false);
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
        const errMsg = error.response?.data?.message || error.message || 'Gagal memproses pembayaran.';
        const yourRole = error.response?.data?.your_role;
        if (yourRole && yourRole !== 'user') {
            toast.error(`Akses ditolak: Anda login sebagai ${yourRole}. Harap login dengan akun tamu.`);
        } else {
            toast.error(errMsg);
        }
        setIsPaying(false);
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



  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 w-full z-10 px-6 py-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <FaChevronLeft />
        </button>
        <button 
            onClick={() => toggleFavorite(parseInt(hotelId || '0', 10))}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-sm"
        >
            {favorites.includes(parseInt(hotelId || '0', 10)) ? (
                <FaHeart className="text-red-500 animate-pulse text-lg" />
            ) : (
                <FaRegHeart className="text-white hover:text-red-500 text-lg" />
            )}
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
                    <p className="flex items-center gap-1.5 text-white/80 text-sm italic flex-wrap">
                        <FaMapMarkerAlt className="text-restify-olive" /> {hotelData.address}
                        {hotelData.latitude && hotelData.longitude && userCoords && (
                            <>
                                {" • "}
                                <span className="text-[#A4B396] font-semibold">
                                    {calculateDistance(userCoords.latitude, userCoords.longitude, parseFloat(hotelData.latitude), parseFloat(hotelData.longitude)).toFixed(1)} km dari Anda
                                </span>
                            </>
                        )}
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
                                {Array.isArray(hotelData.facilities) && hotelData.facilities.length > 0 ? hotelData.facilities.map((fac: string, idx: number) => {
                                    const icons: Record<string, React.ReactNode> = {
                                        "wifi": <FaWifi className="text-restify-olive text-xl" />,
                                        "kolam renang": <span className="text-xl">🏊</span>,
                                        "restoran": <FaCoffee className="text-restify-olive text-xl" />,
                                        "sarapan": <FaCoffee className="text-restify-olive text-xl" />,
                                        "ruang serba guna": <span className="text-xl">🏢</span>,
                                        "gym": <span className="text-xl">🏋️</span>,
                                        "parking area": <span className="text-xl">🚗</span>,
                                        "spa": <span className="text-xl">💆</span>,
                                        "tv kabel": <FaTv className="text-restify-olive text-xl" />,
                                        "tv": <FaTv className="text-restify-olive text-xl" />,
                                        "kamar mandi": <FaShower className="text-restify-olive text-xl" />
                                    };
                                    const icon = icons[fac.toLowerCase()] || <span className="text-xl">✨</span>;
                                    return (
                                        <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl gap-2">
                                            {icon}
                                            <span className="text-xs font-bold text-center">{fac}</span>
                                        </div>
                                    );
                                }) : (
                                    <>
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
                                    </>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-4">Deskripsi</h3>
                            <p className="text-gray-500 leading-relaxed text-[15px]">{hotelData.description || "Nikmati pengalaman menginap tak terlupakan di hotel kami yang berlokasi strategis."}</p>
                        </div>
                    )}

                    {tab === "foto" && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <img 
                                src={hotelData.image_url} 
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = getFallbackImage(hotelId || 1);
                                }}
                                className="w-full h-48 object-cover rounded-2xl shadow-sm" 
                            />
                            <div className="grid grid-cols-1 gap-4">
                                <img 
                                    src={getFallbackImage((parseInt(hotelId || '1', 10) + 1))} 
                                    alt="Detail Hotel 2"
                                    loading="lazy"
                                    className="w-full h-22 object-cover rounded-2xl shadow-sm" 
                                />
                                <img 
                                    src={getFallbackImage((parseInt(hotelId || '1', 10) + 2))} 
                                    alt="Detail Hotel 3"
                                    loading="lazy"
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
                                    <img src={r.user?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || 'User')}&background=random`} loading="lazy" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
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
                                    loading="lazy"
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

                {/* Pilihan Kamar Section */}
                <div className="space-y-6 mt-8">
                    <h3 className="text-2xl font-black text-black">Pilihan Kamar</h3>
                    {rooms.map((room) => {
                        const roomImages = [
                            room.image_url || '/images/room/room_main.jpg',
                            '/images/room/room_detail1.jpg',
                            '/images/room/room_detail2.jpg',
                            '/images/room/room_detail3.jpg',
                            '/images/room/room_detail4.jpg',
                            '/images/room/room_detail5.jpg'
                        ];

                        const fallbackRoomImages = [
                            '/images/room/room_main.jpg',
                            '/images/room/room_detail1.jpg',
                            '/images/room/room_detail2.jpg',
                            '/images/room/room_detail3.jpg',
                            '/images/room/room_detail4.jpg',
                            '/images/room/room_detail5.jpg'
                        ];

                        return (
                            <div 
                                key={room.id} 
                                onClick={() => {
                                    if (room.status !== 'maintenance') {
                                        setSelectedRoomId(room.id);
                                    }
                                }}
                                className={`bg-white rounded-[24px] border-2 overflow-hidden shadow-sm hover:shadow-md transition-all 
                                    ${room.status === 'maintenance' ? 'opacity-60 cursor-not-allowed bg-gray-50/50' : 'cursor-pointer'} 
                                    ${selectedRoomId === room.id ? 'border-restify-olive' : 'border-gray-100'}`}
                            >
                                {/* Main Card Content: Three columns */}
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-6 gap-6">
                                    
                                    {/* Column 1: Title & Gallery */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-xl font-bold text-black">{room.room_type}</h4>
                                            {room.status === 'maintenance' && (
                                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                                                    Maintenance
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Gallery Grid */}
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                {/* Large main image on left */}
                                                <div className="col-span-2 row-span-2 relative h-32 rounded-xl overflow-hidden">
                                                    <img 
                                                        src={roomImages[0]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[0];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Main Room"
                                                    />
                                                </div>
                                                {/* Stacked 2 small images on right */}
                                                <div className="relative h-[60px] rounded-lg overflow-hidden">
                                                    <img 
                                                        src={roomImages[1]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[1];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Room detail 1"
                                                    />
                                                </div>
                                                <div className="relative h-[60px] rounded-lg overflow-hidden">
                                                    <img 
                                                        src={roomImages[2]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[2];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Room detail 2"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* 3 small images below */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="relative h-[60px] rounded-lg overflow-hidden">
                                                    <img 
                                                        src={roomImages[3]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[3];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Room detail 3"
                                                    />
                                                </div>
                                                <div className="relative h-[60px] rounded-lg overflow-hidden">
                                                    <img 
                                                        src={roomImages[4]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[4];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Room detail 4"
                                                    />
                                                </div>
                                                <div className="relative h-[60px] rounded-lg overflow-hidden">
                                                    <img 
                                                        src={roomImages[5]} 
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = fallbackRoomImages[5];
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                        alt="Room detail 5"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Column 2: Fasilitas */}
                                    <div className="pl-0 md:pl-6 pt-6 md:pt-0 space-y-4">
                                        <h4 className="text-xl font-bold text-black">Fasilitas</h4>
                                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                                            {/* Size */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-restify-olive font-extrabold text-sm">📐</span>
                                                <span>{
                                                    room.facilities?.find((f: string) => f.startsWith("Ukuran:"))?.replace("Ukuran:", "").trim() || "3 × 3 Meter"
                                                }</span>
                                            </div>
                                            
                                            {/* Bedrooms */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-restify-olive font-extrabold text-sm">🛏️</span>
                                                <span>{
                                                    room.facilities?.find((f: string) => f.startsWith("Kamar Tidur:"))?.replace("Kamar Tidur:", "").trim() || "2"
                                                } Kamar tidur</span>
                                            </div>

                                            {/* Other Facilities */}
                                            {Array.isArray(room.facilities) && room.facilities.filter((f: string) => !f.startsWith("Ukuran:") && !f.startsWith("Kamar Tidur:")).map((fac: string, idx: number) => {
                                                const icons: Record<string, string> = {
                                                    "sarapan": "🍳",
                                                    "makan siang": "🍲",
                                                    "makan malam": "🍱",
                                                    "ekstra bed": "🛏️",
                                                    "tv": "📺",
                                                    "ac": "❄️",
                                                    "wifi": "📶"
                                                };
                                                const icon = icons[fac.toLowerCase()] || "✓";
                                                return (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="text-restify-olive font-extrabold text-sm">{icon}</span>
                                                        <span>{fac}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* Column 3: Deskripsi */}
                                    <div className="pl-0 md:pl-6 pt-6 md:pt-0 space-y-4">
                                        <h4 className="text-xl font-bold text-black">Deskripsi</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-6">
                                            {room.description || "Kamar superior yang nyaman dengan pemandangan indah, cocok untuk liburan keluarga atau perjalanan bisnis Anda."}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Footer Bar */}
                                <div className="bg-[#FAF8EE] px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                                        <span>Harga :</span>
                                        <span className="text-[#5E6B52] font-black text-base">{formatRupiah(room.price)}</span>
                                        <span className="text-xs text-gray-400 font-normal">/ Malam</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-gray-700">
                                            {room.status === 'maintenance' ? (
                                                <span className="text-amber-600 font-extrabold uppercase tracking-wide text-xs">Sedang Maintenance</span>
                                            ) : (
                                                <>
                                                    Tersedia : <span className="text-[#5E6B52] font-black">{room.status === 'available' ? '2' : '0'}</span> Kamar
                                                </>
                                            )}
                                        </span>
                                        {room.status !== 'maintenance' && (
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRoomId === room.id ? 'border-restify-olive' : 'border-gray-200'}`}>
                                                {selectedRoomId === room.id && <div className="w-3.5 h-3.5 bg-[#5E6B52] rounded-full" />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50 sticky top-28">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Harga Per Malam</span>
                    <div className="flex items-baseline gap-2 mb-8">
                        <h2 className="text-3xl font-black text-black">{formatRupiah(hotelData.lowest_price || hotelData.price || 0)}</h2>
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
                        onClick={() => {
                            if (!token || !user) {
                                toast.error('Silakan login terlebih dahulu untuk melakukan pemesanan.');
                                router.push('/login');
                                return;
                            }
                            if (user.role !== 'user') {
                                toast.error(`Akun ${user.role} tidak dapat melakukan pemesanan kamar. Gunakan akun tamu.`);
                                return;
                            }
                            if (!selectedRoomId) {
                                toast.warning("Silakan pilih tipe kamar terlebih dahulu di bagian Pilihan Kamar.");
                                return;
                            }
                            const selectedRoom = rooms.find(r => r.id === selectedRoomId);
                            if (selectedRoom?.status === 'maintenance') {
                                toast.warning("Tipe kamar yang Anda pilih sedang dalam perbaikan/maintenance.");
                                return;
                            }
                            setShowBooking(true);
                            setStep("form");
                        }}
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
              <div className="md:w-1/3 bg-restify-olive p-8 text-white flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-black mb-2">Pilih Detail<br/>Pemesanan</h2>
                    <p className="text-white/60 text-sm">Pastikan tanggal dan tipe kamar sudah sesuai.</p>
                </div>
                <div className="mt-20">
                    <div className="bg-white/10 p-5 rounded-[24px] flex flex-col gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                <FaUserFriends className="text-lg" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-white/50 block leading-tight">Tamu</span>
                                <p className="font-extrabold text-base whitespace-nowrap">{guest} Orang</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white/10 rounded-2xl p-1.5 border border-white/5 shadow-inner gap-2">
                            <span className="text-xs font-bold text-white/70 pl-2 select-none">Atur Tamu</span>
                            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/5 shrink-0">
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setGuest(Math.max(1, guest - 1)); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 active:scale-95 transition-all text-base font-black select-none cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="w-6 text-center font-bold text-xs select-none">{guest}</span>
                                <button 
                                    type="button"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        const maxCapacity = currentRoom?.capacity || 10;
                                        if (guest < maxCapacity) {
                                            setGuest(guest + 1);
                                        } else {
                                            toast.warning(`Kapasitas maksimum kamar ini adalah ${maxCapacity} orang`);
                                        }
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 active:scale-95 transition-all text-base font-black select-none cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
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
                    <label className="block text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Tipe Kamar yang Dipilih</label>
                    {currentRoom ? (
                        <div className="p-5 rounded-[24px] border-2 border-restify-olive bg-restify-olive/5 shadow-md flex items-center justify-between">
                            <div>
                                <p className="font-black text-base text-black">{currentRoom.room_type}</p>
                                <p className="text-sm text-restify-olive font-extrabold mt-1">
                                    {formatRupiah(currentRoom.price)} <span className="text-[11px] text-gray-400 font-normal">/ Malam</span>
                                </p>
                            </div>
                            <span className="bg-[#657657] text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                                Dipilih
                            </span>
                        </div>
                    ) : (
                        <div className="p-5 rounded-[24px] border-2 border-dashed border-red-200 bg-red-50 text-red-500 text-sm font-bold text-center">
                            Tidak ada kamar yang dipilih. Silakan pilih tipe kamar terlebih dahulu di halaman utama.
                        </div>
                    )}
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
                    <span className="text-xl font-black text-restify-olive">{formatRupiah(currentRoom?.price || 0)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handlePayment} disabled={isPaying} className={`w-full bg-restify-olive text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-restify-olive/20 hover:opacity-90 transition-all ${isPaying ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
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
