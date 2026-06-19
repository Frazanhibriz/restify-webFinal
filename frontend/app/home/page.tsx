'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiChevronDown, FiBell, FiSearch, FiFilter } from 'react-icons/fi';
import NotificationPanel from '@/app/components/NotificationPanel';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { calculateDistance, getCityCenter } from '@/lib/distance';
import { getFallbackImage } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, '');
    if (!numberString) return '';
    return parseInt(numberString, 10).toLocaleString('id-ID');
};

const parseRupiah = (value: string): number | null => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : null;
};

export default function HomePage() {
    const { user } = useAuth();

    const [searchInput, setSearchInput] = useState('');
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Bandung');
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    useEffect(() => {
        const storedCity = localStorage.getItem('selectedCity');
        if (storedCity) {
            setSelectedCity(storedCity);
        }
    }, []);

    const handleSelectCity = (city: string) => {
        setSelectedCity(city);
        localStorage.setItem('selectedCity', city);
        setShowCityDropdown(false);
    };

    const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [hasGps, setHasGps] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setHasGps(true);
                },
                (error) => {
                    console.log("Geolocation error:", error);
                    setHasGps(false);
                    setUserCoords(getCityCenter(selectedCity));
                }
            );
        } else {
            setHasGps(false);
            setUserCoords(getCityCenter(selectedCity));
        }
    }, []);

    useEffect(() => {
        if (!hasGps) {
            setUserCoords(getCityCenter(selectedCity));
        }
    }, [selectedCity, hasGps]);
    
    const { favorites, toggleFavorite } = useFavorites();
    
    const [unreadCount, setUnreadCount] = useState(0);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedMin, setAppliedMin] = useState<number | null>(null);
    const [appliedMax, setAppliedMax] = useState<number | null>(null);

    const [hotels, setHotels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedSearchQuery(searchInput);
    };

    const handleApplyFilter = () => {
        setAppliedMin(parseRupiah(minPrice));
        setAppliedMax(parseRupiah(maxPrice));
        setShowFilter(false);
    };

    const isSearching = appliedSearchQuery.trim() !== '';

    const filteredHotels = hotels.filter((hotel: any) => {
        if (selectedCity && hotel.location.toLowerCase() !== selectedCity.toLowerCase()) {
            if (isSearching) {
                const q = appliedSearchQuery.toLowerCase();
                if (!hotel.location.toLowerCase().includes(q)) return false;
            } else {
                return false;
            }
        }

        if (appliedMin !== null && hotel.pricePerDay < appliedMin) return false;
        if (appliedMax !== null && hotel.pricePerDay > appliedMax) return false;

        if (isSearching) {
            const q = appliedSearchQuery.toLowerCase();
            const matchName = hotel.name?.toLowerCase().includes(q);
            const matchLoc = hotel.location?.toLowerCase().includes(q);
            const matchAddr = hotel.address?.toLowerCase().includes(q);
            if (!matchName && !matchLoc && !matchAddr) return false;
        }

        return true;
    });

    return (
        <>
        <main className="min-h-screen bg-white pb-20 text-restify-dark font-sans">
            {}
            <div className="sticky top-0 z-50 glass shadow-sm px-6">
                <header className="max-w-6xl mx-auto flex items-center justify-between py-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-restify-olive/10 p-2 rounded-xl">
                            <FaMapMarkerAlt className="text-2xl text-restify-olive" />
                        </div>
                        <div className="flex flex-col relative">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Lokasi</span>
                            <div 
                                onClick={() => setShowCityDropdown(!showCityDropdown)} 
                                className="flex items-center gap-1 cursor-pointer select-none"
                            >
                                <h2 className="text-sm font-bold text-black">
                                    {selectedCity}, Indonesia
                                </h2>
                                <FiChevronDown className="text-sm text-restify-olive" />
                            </div>
                            
                            {showCityDropdown && (
                                <div className="absolute top-12 left-0 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 w-48 z-[60] animate-fade-in">
                                    <button 
                                        onClick={() => handleSelectCity('Bandung')}
                                        className={`w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${selectedCity === 'Bandung' ? 'text-restify-olive' : 'text-gray-700'}`}
                                    >
                                        Bandung, Indonesia
                                    </button>
                                    <button 
                                        onClick={() => handleSelectCity('Jakarta')}
                                        className={`w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${selectedCity === 'Jakarta' ? 'text-restify-olive' : 'text-gray-700'}`}
                                    >
                                        Jakarta, Indonesia
                                    </button>
                                    <button 
                                        onClick={() => handleSelectCity('Bali')}
                                        className={`w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${selectedCity === 'Bali' ? 'text-restify-olive' : 'text-gray-700'}`}
                                    >
                                        Bali, Indonesia
                                    </button>
                                    <button 
                                        onClick={() => handleSelectCity('Yogyakarta')}
                                        className={`w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${selectedCity === 'Yogyakarta' ? 'text-restify-olive' : 'text-gray-700'}`}
                                    >
                                        Yogyakarta, Indonesia
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="relative w-32 h-8">
                            <Image src="/images/logo-putih.png" alt="Restify Logo" fill sizes="(max-width: 768px) 100vw, 128px" className="object-contain" priority />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            id="btn-notification"
                            onClick={() => setShowNotif(true)}
                            className="relative flex items-center justify-center w-10 h-10 bg-white border border-gray-100 rounded-full hover:shadow-md transition-all duration-300"
                        >
                            <FiBell className="text-xl text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                        </button>
                        <Link 
                            href="/home/profile" 
                            className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 flex items-center justify-center bg-gray-50 shrink-0"
                        >
                            {user?.profile_picture_url ? (
                                <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#5E6B52] text-white flex items-center justify-center font-bold text-xs uppercase">
                                    {user?.name?.[0] || 'U'}
                                </div>
                            )}
                        </Link>
                    </div>
                </header>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {}
                <section className="mt-10 mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                        Temukan Penginapan <br />
                        <span className="text-restify-olive italic">Terbaik Anda.</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-lg">
                        Pesan hotel impian Anda dengan harga terbaik dan pelayanan yang tak terlupakan hanya di Restify.
                    </p>
                </section>

                {}
                <section className="mb-12 sticky top-24 z-40 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex gap-3">
                        <form onSubmit={handleSearch} className="flex-1 relative group">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-restify-olive transition-colors text-xl" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau lokasi..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-[#F5F5F5] border border-transparent rounded-2xl py-4 pl-14 pr-6 text-[15px] font-medium outline-none focus:bg-white focus:border-restify-olive focus:ring-4 focus:ring-restify-olive/5 transition-all shadow-sm"
                            />
                        </form>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowFilter(!showFilter)}
                                className={`flex items-center justify-center w-[58px] h-[58px] rounded-2xl transition-all duration-300 ${showFilter ? 'bg-restify-olive text-white' : 'bg-restify-olive/10 text-restify-olive hover:bg-restify-olive/20'}`}
                            >
                                <FiFilter className="text-2xl" />
                            </button>

                            {showFilter && (
                                <div className="absolute right-0 top-20 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-fade-in">
                                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-gray-400">Filter Harga</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-700 mb-1">Min. Harga</label>
                                            <input 
                                                type="text" 
                                                placeholder="Rp 0" 
                                                value={minPrice} 
                                                onChange={(e) => setMinPrice(formatRupiah(e.target.value))} 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-restify-olive" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-700 mb-1">Max. Harga</label>
                                            <input 
                                                type="text" 
                                                placeholder="Rp 5.000.000" 
                                                value={maxPrice} 
                                                onChange={(e) => setMaxPrice(formatRupiah(e.target.value))} 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-restify-olive" 
                                            />
                                        </div>
                                        <button onClick={handleApplyFilter} className="w-full bg-restify-olive text-white font-bold py-3 rounded-xl hover:opacity-90 shadow-lg shadow-restify-olive/20 transition-all mt-2">
                                            Terapkan Filter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-extrabold flex items-center gap-2">
                            {isSearching ? `Hasil Pencarian` : "Hotel Populer"}
                            <span className="text-xs font-bold bg-restify-olive/10 text-restify-olive px-2 py-1 rounded-md">
                                {filteredHotels.length}
                            </span>
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-100 animate-pulse rounded-3xl h-[380px]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {filteredHotels.map((hotel) => (
                                <Link key={hotel.id}
                                    href={{ pathname: "/detail", query: { id: hotel.id } }}
                                    className="group flex flex-col bg-white rounded-[32px] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="relative w-full h-64 overflow-hidden">
                                        <img 
                                            src={hotel.imageUrl} 
                                            alt={hotel.name} 
                                            loading="lazy"
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
                                                {favorites.includes(hotel.id) ? (
                                                    <FaHeart className="text-xl text-red-500 animate-pulse" />
                                                ) : (
                                                    <FaRegHeart className="text-xl text-white hover:text-red-500 transition-colors" />
                                                )}
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
                            {filteredHotels.length === 0 && (
                                <div className="col-span-full py-20 text-center flex flex-col items-center">
                                    <div className="bg-gray-50 p-8 rounded-full mb-4">
                                        <FiSearch className="text-5xl text-gray-200" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Yah, hotel yang kamu cari belum ketemu nih.</p>
                                    <button 
                                        onClick={() => {
                                            setSearchInput('');
                                            setAppliedSearchQuery('');
                                            setMinPrice('');
                                            setMaxPrice('');
                                            setAppliedMin(null);
                                            setAppliedMax(null);
                                        }} 
                                        className="mt-4 text-restify-olive font-bold underline"
                                    >
                                        Lihat semua hotel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
        <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} onUnreadCountChange={setUnreadCount} />
        </>
    );
}