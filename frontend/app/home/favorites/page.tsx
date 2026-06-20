'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { calculateDistance, getCityCenter } from '@/lib/distance';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
    const [hotels, setHotels] = useState<any[]>([]);
    const { favorites, toggleFavorite } = useFavorites();
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
                    setUserCoords(getCityCenter("Bandung"));
                }
            );
        } else {
            setUserCoords(getCityCenter("Bandung"));
        }
    }, []);

    const getFallbackImage = (id: number) => {
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
        return images[id % images.length];
    };

    useEffect(() => {
        // Fetch hotels
        const fetchHotels = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/hotels?per_page=100');
                let fetchedHotels = response.data.data || response.data;
                
                const mappedHotels = fetchedHotels.map((h: any) => ({
                    id: h.id,
                    name: h.name,
                    location: h.city,
                    address: h.address,
                    latitude: h.latitude ? parseFloat(h.latitude) : null,
                    longitude: h.longitude ? parseFloat(h.longitude) : null,
                    pricePerDay: parseFloat(h.lowest_price || h.price || h.rooms?.[0]?.price || 0),
                    rating: h.average_rating || 0,
                    imageUrl: h.image_url || '/images/HotelImages/placeholder.jpg',
                }));

                setHotels(mappedHotels);
            } catch (error) {
                console.error("Gagal mengambil data hotel dari backend", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, []);

    // toggleFavorite is now provided by useFavorites hook

    const favoritedHotels = hotels.filter(hotel => favorites.includes(hotel.id));

    return (
        <main className="min-h-screen bg-white pb-20 text-restify-dark font-sans animate-fade-in">
            {/* Header */}
            <header className="py-8 border-b border-gray-100 flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-black flex items-center gap-3">
                        Hotel Favorit Saya
                        <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-full border border-red-100/50">
                            {favoritedHotels.length} Hotel
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xs mt-1.5 font-medium">Temukan kembali penginapan impian yang telah Anda simpan.</p>
                </div>
            </header>

            {/* Content Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-3xl h-[380px]" />
                    ))}
                </div>
            ) : (
                <>
                    {favoritedHotels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {favoritedHotels.map((hotel) => (
                                <Link key={hotel.id}
                                    href={{ pathname: "/detail", query: { id: hotel.id } }}
                                    className="group flex flex-col bg-white rounded-[32px] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-50"
                                >
                                    <div className="relative w-full h-64 overflow-hidden">
                                        <img 
                                            src={hotel.imageUrl} 
                                            alt={hotel.name} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = getFallbackImage(hotel.id);
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 right-4 z-10">
                                            <button 
                                                onClick={(e) => toggleFavorite(hotel.id, e)}
                                                className="w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                                            >
                                                <FaHeart className="text-xl text-red-500 animate-pulse" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-[12px] font-bold shadow-sm">
                                            <FaStar className="text-yellow-500" />
                                            <span>{hotel.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1 bg-white">
                                        <h4 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-restify-olive transition-colors">{hotel.name}</h4>
                                        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-6">
                                            <FaMapMarkerAlt className="text-restify-olive shrink-0" />
                                            <span className="line-clamp-1">
                                                {hotel.location}
                                                {hotel.latitude && hotel.longitude && userCoords && (
                                                    <>
                                                        {" • "}
                                                        <span className="text-restify-olive font-semibold">
                                                            {calculateDistance(userCoords.latitude, userCoords.longitude, hotel.latitude, hotel.longitude).toFixed(1)} km
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-auto flex items-center justify-between">
                                            <div>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Mulai dari</span>
                                                <p className="font-extrabold text-xl text-black">
                                                    Rp {hotel.pricePerDay.toLocaleString('id-ID')}
                                                    <span className="text-xs font-normal text-gray-400 ml-1">/malam</span>
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-restify-olive text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <FiSearch />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center max-w-md mx-auto animate-fade-in-up">
                            <div className="bg-red-50 p-8 rounded-full mb-6 border border-red-100/50 shadow-inner">
                                <FaHeart className="text-5xl text-red-400 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-2">Belum ada hotel favorit</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                Simpan hotel-hotel impian Anda untuk merencanakan liburan berikutnya dengan mudah di sini.
                            </p>
                            <Link href="/home" className="bg-[#657657] hover:bg-[#525f46] text-white font-extrabold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-restify-olive/20 transition-all text-sm uppercase tracking-wider">
                                Cari Hotel Populer
                            </Link>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
