'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiFileText, FiChevronLeft, FiMinus, FiCheckCircle, FiSearch } from 'react-icons/fi';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function AdminHotelsPage() {
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

    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/home');
            }
        }
    }, [user, isLoading, router]);

    const [view, setView] = useState<'list' | 'add' | 'edit' | 'room_list' | 'room_add' | 'room_edit'>('list');
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [hotelSearchQuery, setHotelSearchQuery] = useState('');
    
    
    const [hotelName, setHotelName] = useState('');
    const [hotelCity, setHotelCity] = useState('');
    const [hotelLocation, setHotelLocation] = useState('');
    const [hotelDescription, setHotelDescription] = useState('');
    const [hotelLatitude, setHotelLatitude] = useState('');
    const [hotelLongitude, setHotelLongitude] = useState('');
    const [hotelImage, setHotelImage] = useState<File | null>(null);
    const [hotelQris, setHotelQris] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    
    const [roomType, setRoomType] = useState('');
    const [roomPrice, setRoomPrice] = useState('');
    const [roomCapacity, setRoomCapacity] = useState(2);
    const [roomDesc, setRoomDesc] = useState('');
    const [roomSize, setRoomSize] = useState('3 × 3 Meter');
    const [roomBedrooms, setRoomBedrooms] = useState(2);
    const [roomImage, setRoomImage] = useState<File | null>(null);
    const [roomImagePreview, setRoomImagePreview] = useState<string | null>(null);
    
    // Custom facilities states
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [availableFacilities, setAvailableFacilities] = useState<Array<{ key: string, label: string, emoji: string }>>([
        { key: 'sarapan', label: 'Sarapan', emoji: '🍳' },
        { key: 'makanSiang', label: 'Makan Siang', emoji: '🍲' },
        { key: 'makanMalam', label: 'Makan Malam', emoji: '🍱' },
        { key: 'ekstraBed', label: 'Ekstra Bed', emoji: '🛏️' },
        { key: 'tv', label: 'Tv', emoji: '📺' },
        { key: 'ac', label: 'AC', emoji: '❄️' },
        { key: 'wifi', label: 'Wifi', emoji: '📶' },
    ]);
    const [customFacilityName, setCustomFacilityName] = useState('');
    
    const [editRoomData, setEditRoomData] = useState<any>(null);

    // Custom hotel facilities states
    const [selectedHotelFacilities, setSelectedHotelFacilities] = useState<string[]>([]);
    const [availableHotelFacilities, setAvailableHotelFacilities] = useState<Array<{ key: string, label: string, emoji: string }>>([
        { key: 'kolam_renang', label: 'Kolam Renang', emoji: '🏊' },
        { key: 'restoran', label: 'Restoran', emoji: '🍳' },
        { key: 'ruang_serbaguna', label: 'Ruang Serba Guna', emoji: '🏢' },
        { key: 'wifi', label: 'Wifi', emoji: '📶' },
        { key: 'gym', label: 'Gym', emoji: '🏋️' },
        { key: 'parking_area', label: 'Parking Area', emoji: '🚗' },
        { key: 'spa', label: 'Spa', emoji: '💆' },
    ]);
    const [customHotelFacilityName, setCustomHotelFacilityName] = useState('');

    
    useEffect(() => {
        if (view === 'add') {
            setHotelName('');
            setHotelCity('');
            setHotelLocation('');
            setHotelDescription('');
            setHotelLatitude('');
            setHotelLongitude('');
            setHotelImage(null);
            setHotelQris(null);
            setSelectedHotelFacilities([]);
            setAvailableHotelFacilities([
                { key: 'kolam_renang', label: 'Kolam Renang', emoji: '🏊' },
                { key: 'restoran', label: 'Restoran', emoji: '🍳' },
                { key: 'ruang_serbaguna', label: 'Ruang Serba Guna', emoji: '🏢' },
                { key: 'wifi', label: 'Wifi', emoji: '📶' },
                { key: 'gym', label: 'Gym', emoji: '🏋️' },
                { key: 'parking_area', label: 'Parking Area', emoji: '🚗' },
                { key: 'spa', label: 'Spa', emoji: '💆' },
            ]);
            setCustomHotelFacilityName('');
            setEditData(null);
        } else if (view === 'edit' && editData) {
            setHotelName(editData.name || '');
            setHotelCity(editData.city || '');
            setHotelLocation(editData.address || '');
            setHotelDescription(editData.description || '');
            setHotelLatitude(editData.latitude !== undefined && editData.latitude !== null ? String(editData.latitude) : '');
            setHotelLongitude(editData.longitude !== undefined && editData.longitude !== null ? String(editData.longitude) : '');

            const facilitiesArray = Array.isArray(editData.facilities) ? editData.facilities : [];
            setSelectedHotelFacilities(facilitiesArray);

            const defaultLabels = ['Kolam Renang', 'Restoran', 'Ruang Serba Guna', 'Wifi', 'Gym', 'Parking Area', 'Spa'];
            const newAvailable = [
                { key: 'kolam_renang', label: 'Kolam Renang', emoji: '🏊' },
                { key: 'restoran', label: 'Restoran', emoji: '🍳' },
                { key: 'ruang_serbaguna', label: 'Ruang Serba Guna', emoji: '🏢' },
                { key: 'wifi', label: 'Wifi', emoji: '📶' },
                { key: 'gym', label: 'Gym', emoji: '🏋️' },
                { key: 'parking_area', label: 'Parking Area', emoji: '🚗' },
                { key: 'spa', label: 'Spa', emoji: '💆' },
            ];

            facilitiesArray.forEach((f: string) => {
                const isDefault = defaultLabels.some(l => l.toLowerCase() === f.toLowerCase());
                if (!isDefault) {
                    const key = f.toLowerCase().replace(/\s+/g, '_');
                    const emojis: Record<string, string> = {
                        wifi: '📶',
                        kolam_renang: '🏊',
                        restoran: '🍳',
                        ruang_serbaguna: '🏢',
                        gym: '🏋️',
                        parking_area: '🚗',
                        spa: '💆',
                        meeting_room: '💼',
                        bar: '🍷'
                    };
                    const emoji = emojis[f.toLowerCase()] || '✨';
                    newAvailable.push({ key, label: f, emoji });
                }
            });
            setAvailableHotelFacilities(newAvailable);
            setCustomHotelFacilityName('');
        } else if (view === 'room_add') {
            setRoomType('');
            setRoomPrice('');
            setRoomCapacity(2);
            setRoomDesc('');
            setRoomSize('3 × 3 Meter');
            setRoomBedrooms(2);
            setRoomImage(null);
            setRoomImagePreview(null);
            setSelectedFacilities([]);
            setAvailableFacilities([
                { key: 'sarapan', label: 'Sarapan', emoji: '🍳' },
                { key: 'makanSiang', label: 'Makan Siang', emoji: '🍲' },
                { key: 'makanMalam', label: 'Makan Malam', emoji: '🍱' },
                { key: 'ekstraBed', label: 'Ekstra Bed', emoji: '🛏️' },
                { key: 'tv', label: 'Tv', emoji: '📺' },
                { key: 'ac', label: 'AC', emoji: '❄️' },
                { key: 'wifi', label: 'Wifi', emoji: '📶' },
            ]);
            setCustomFacilityName('');
            setEditRoomData(null);
        } else if (view === 'room_edit' && editRoomData) {
            setRoomType(editRoomData.room_type || '');
            setRoomPrice(editRoomData.price || '');
            setRoomCapacity(editRoomData.capacity || 2);
            setRoomDesc(editRoomData.description || '');
            setRoomImage(null);
            setRoomImagePreview(editRoomData.image_url || null);

            const facilitiesArray = Array.isArray(editRoomData.facilities) ? editRoomData.facilities : [];
            const sizeStr = facilitiesArray.find((f: string) => f.startsWith("Ukuran:"))?.replace("Ukuran:", "").trim() || '3 × 3 Meter';
            const bedVal = parseInt(facilitiesArray.find((f: string) => f.startsWith("Kamar Tidur:"))?.replace("Kamar Tidur:", "").trim() || '2', 10);
            
            setRoomSize(sizeStr);
            setRoomBedrooms(isNaN(bedVal) ? 2 : bedVal);
            
            const selFacs = facilitiesArray.filter((f: string) => !f.startsWith("Ukuran:") && !f.startsWith("Kamar Tidur:"));
            setSelectedFacilities(selFacs);

            const defaultLabels = ['Sarapan', 'Makan Siang', 'Makan Malam', 'Ekstra Bed', 'Tv', 'AC', 'Wifi'];
            const newAvailable = [
                { key: 'sarapan', label: 'Sarapan', emoji: '🍳' },
                { key: 'makanSiang', label: 'Makan Siang', emoji: '🍲' },
                { key: 'makanMalam', label: 'Makan Malam', emoji: '🍱' },
                { key: 'ekstraBed', label: 'Ekstra Bed', emoji: '🛏️' },
                { key: 'tv', label: 'Tv', emoji: '📺' },
                { key: 'ac', label: 'AC', emoji: '❄️' },
                { key: 'wifi', label: 'Wifi', emoji: '📶' },
            ];

            selFacs.forEach((f: string) => {
                const isDefault = defaultLabels.some(l => l.toLowerCase() === f.toLowerCase());
                if (!isDefault) {
                    const key = f.toLowerCase().replace(/\s+/g, '_');
                    const emojis: Record<string, string> = {
                        bathtub: '🛁',
                        jacuzzi: '🛁',
                        netflix: '🎬',
                        youtube: '📺',
                        bar: '🍷',
                        minibar: '🍷',
                        kulkas: '🧴',
                        balkon: '🌇',
                        pemandangan: '🌇',
                        brankas: '🔒',
                        kopi: '☕',
                        teh: '☕'
                    };
                    const emoji = emojis[f.toLowerCase()] || '✨';
                    newAvailable.push({ key, label: f, emoji });
                }
            });
            setAvailableFacilities(newAvailable);
            setCustomFacilityName('');
        }
    }, [view, editData, editRoomData]);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/hotels?per_page=100');
            setHotels(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil data hotel:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (hotelId: number) => {
        try {
            const response = await api.get(`/hotels/${hotelId}/rooms?per_page=100`);
            setRooms(response.data.data || response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data kamar:", error);
        }
    };

    const handleDeleteHotel = async (id: number) => {
        try {
            await api.delete(`/admin/hotels/${id}`);
            setHotels(hotels.filter(h => h.id !== id));
            setDeleteId(null);
            toast.success("Hotel berhasil dihapus");
        } catch (error: any) {
            console.error("Gagal menghapus hotel:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus hotel");
        }
    };

    const handleBack = () => {
        if (view === 'list') {
            router.push('/admin');
        } else if (view === 'room_list') {
            setView('list');
            setSelectedHotel(null);
        } else if (view === 'room_add' || view === 'room_edit') {
            setView('room_list');
        } else {
            setView('list');
            setDeleteId(null);
            setEditData(null);
        }
    };

    const handleAddCustomHotelFacility = () => {
        const name = customHotelFacilityName.trim();
        if (!name) return;

        const exists = availableHotelFacilities.some(f => f.label.toLowerCase() === name.toLowerCase());
        if (exists) {
            toast.warning("Fasilitas ini sudah ada dalam daftar");
            return;
        }

        const key = name.toLowerCase().replace(/\s+/g, '_');
        const emojis: Record<string, string> = {
            wifi: '📶',
            kolam_renang: '🏊',
            restoran: '🍳',
            ruang_serbaguna: '🏢',
            gym: '🏋️',
            parking_area: '🚗',
            spa: '💆',
            meeting_room: '💼',
            bar: '🍷'
        };
        const emoji = emojis[name.toLowerCase()] || '✨';

        setAvailableHotelFacilities([...availableHotelFacilities, { key, label: name, emoji }]);
        setSelectedHotelFacilities([...selectedHotelFacilities, name]);
        setCustomHotelFacilityName('');
        toast.success(`Fasilitas "${name}" berhasil ditambahkan`);
    };

    const handleSubmitHotel = async () => {
        if (!hotelName.trim() || !hotelCity.trim() || !hotelLocation.trim() || !hotelDescription.trim() || !String(hotelLatitude).trim() || !String(hotelLongitude).trim()) {
            toast.warning("Mohon lengkapi semua bidang wajib (Nama, Kota, Alamat, Deskripsi, Latitude, Longitude)");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', hotelName);
            formData.append('city', hotelCity);
            formData.append('address', hotelLocation);
            formData.append('description', hotelDescription);
            
            formData.append('latitude', hotelLatitude);
            formData.append('longitude', hotelLongitude);

            if (hotelImage) formData.append('image', hotelImage);
            if (hotelQris) formData.append('qris_image', hotelQris);

            selectedHotelFacilities.forEach((fac) => {
                formData.append('facilities[]', fac);
            });

            if (view === 'edit' && editData) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/hotels/${editData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Hotel berhasil diperbarui");
            } else {
                await api.post('/admin/hotels', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Hotel berhasil ditambahkan");
            }

            fetchHotels();
            setView('list');
        } catch (error: any) {
            console.error("Gagal menyimpan hotel:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan data hotel.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCustomFacility = () => {
        const name = customFacilityName.trim();
        if (!name) return;

        const exists = availableFacilities.some(f => f.label.toLowerCase() === name.toLowerCase());
        if (exists) {
            toast.warning("Fasilitas ini sudah ada dalam daftar");
            return;
        }

        const key = name.toLowerCase().replace(/\s+/g, '_');
        const emojis: Record<string, string> = {
            bathtub: '🛁',
            jacuzzi: '🛁',
            netflix: '🎬',
            youtube: '📺',
            bar: '🍷',
            minibar: '🍷',
            kulkas: '🧴',
            balkon: '🌇',
            pemandangan: '🌇',
            brankas: '🔒',
            kopi: '☕',
            teh: '☕'
        };
        const emoji = emojis[name.toLowerCase()] || '✨';

        setAvailableFacilities([...availableFacilities, { key, label: name, emoji }]);
        setSelectedFacilities([...selectedFacilities, name]);
        setCustomFacilityName('');
        toast.success(`Fasilitas "${name}" berhasil ditambahkan`);
    };

    const handleSubmitRoom = async () => {
        if (!roomType.trim() || !roomPrice || !roomDesc.trim()) {
            toast.warning("Mohon lengkapi semua bidang tipe kamar (Tipe, Harga, Deskripsi)");
            return;
        }

        if (Number(roomPrice) <= 0) {
            toast.warning("Harga kamar harus lebih besar dari 0");
            return;
        }

        setIsSubmitting(true);
        try {
            const facList: string[] = [];
            facList.push(`Ukuran: ${roomSize}`);
            facList.push(`Kamar Tidur: ${roomBedrooms}`);

            selectedFacilities.forEach(f => facList.push(f));

            const formData = new FormData();
            formData.append('hotel_id', selectedHotel.id.toString());
            formData.append('room_type', roomType);
            formData.append('price', roomPrice);
            formData.append('capacity', roomCapacity.toString());
            formData.append('description', roomDesc);
            formData.append('status', 'available');
            facList.forEach(f => formData.append('facilities[]', f));

            if (roomImage) {
                formData.append('image', roomImage);
            }

            if (view === 'room_edit' && editRoomData) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/rooms/${editRoomData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Tipe kamar berhasil diperbarui");
            } else {
                await api.post('/admin/rooms', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Tipe kamar berhasil ditambahkan");
            }

            fetchRooms(selectedHotel.id);
            setView('room_list');
        } catch (error: any) {
            console.error("Gagal menyimpan kamar:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan data kamar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRoom = async (id: number) => {
        if (!confirm("Hapus kamar ini?")) return;
        try {
            await api.delete(`/admin/rooms/${id}`);
            toast.success("Tipe kamar berhasil dihapus");
            fetchRooms(selectedHotel.id);
        } catch (error: any) {
            console.error("Gagal menghapus kamar:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus kamar");
        }
    };

    const getHeaderTitle = () => {
        if (view === 'edit') return `Edit "${hotelName || 'Hotel'}"`;
        if (view === 'add') return "Tambah Hotel Baru";
        if (view === 'room_list' || view === 'room_add' || view === 'room_edit') {
            return `Kamar: ${selectedHotel?.name || 'Hotel'}`;
        }
        return 'Manajemen Hotel';
    };

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const filteredHotels = useMemo(() => {
        if (!hotelSearchQuery.trim()) return hotels;
        const q = hotelSearchQuery.toLowerCase();
        return hotels.filter((h) => 
            h.name?.toLowerCase().includes(q) || 
            h.city?.toLowerCase().includes(q) ||
            h.address?.toLowerCase().includes(q)
        );
    }, [hotels, hotelSearchQuery]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-20">
            {}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
               <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                   <div className="w-1/4">
                        <button onClick={handleBack} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all">
                            <FiChevronLeft /> Kembali
                        </button>
                   </div>
                   <div className="w-1/2 text-center">
                       <h1 className="text-xl font-black tracking-tight text-restify-dark uppercase">
                           {getHeaderTitle()}
                       </h1>
                   </div>
                   <div className="w-1/4 flex justify-end">
                        {view === 'list' && (
                            <button 
                                onClick={() => setView('add')}
                                className="bg-restify-olive text-white px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-restify-olive/20 flex items-center gap-2 hover:opacity-90 transition-all"
                            >
                                <FiPlus /> Hotel Baru
                            </button>
                        )}
                   </div>
               </div>
            </header>

            <main className="max-w-6xl mx-auto py-10 px-6 animate-fade-in">
                {}
                {view === 'list' && (
                    <>
                    <div className="mb-8 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari hotel berdasarkan nama atau lokasi..."
                                value={hotelSearchQuery}
                                onChange={(e) => setHotelSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-sm font-medium focus:border-restify-olive focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-restify-olive font-bold">Memuat data hotel...</div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                                {hotelSearchQuery ? `Tidak ada hotel untuk "${hotelSearchQuery}"` : 'Belum ada hotel. Silakan tambah hotel baru.'}
                            </div>
                        ) : filteredHotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                {deleteId === hotel.id ? (
                                    <div className="flex-1 flex flex-col justify-center items-center p-8 bg-red-50">
                                        <p className="font-bold text-center mb-6">Hapus hotel "{hotel.name}"?</p>
                                        <div className="flex gap-4">
                                            <button onClick={() => setDeleteId(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold">Batal</button>
                                            <button onClick={() => handleDeleteHotel(hotel.id)} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold">Hapus</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative h-40 bg-gray-100">
                                            <img 
                                                src={hotel.image_url} 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = getFallbackImage(hotel.id);
                                                }}
                                                className="w-full h-full object-cover" 
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-restify-olive">
                                                {hotel.city}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="font-black text-lg mb-4 line-clamp-1">{hotel.name}</h3>
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                <button onClick={() => { setEditData(hotel); setView('edit'); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1">
                                                    <FiEdit /> Edit
                                                </button>
                                                <button onClick={() => { setSelectedHotel(hotel); fetchRooms(hotel.id); setView('room_list'); }} className="flex-1 bg-green-50 text-green-600 py-2 rounded-xl text-[11px] font-black hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-1">
                                                    <FiFileText /> Kamar
                                                </button>
                                                <button onClick={() => setDeleteId(hotel.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-[11px] font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1">
                                                    <FiTrash2 /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    </>
                )}

                {}
                {(view === 'add' || view === 'edit') && (
                    <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-10 shadow-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Nama Hotel</label>
                                    <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="Nama Hotel" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Kota</label>
                                    <input type="text" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} placeholder="Contoh: Bandung" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Latitude</label>
                                        <input type="text" value={hotelLatitude} onChange={(e) => setHotelLatitude(e.target.value)} placeholder="Contoh: -6.917464" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Longitude</label>
                                        <input type="text" value={hotelLongitude} onChange={(e) => setHotelLongitude(e.target.value)} placeholder="Contoh: 107.619123" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Alamat Lengkap</label>
                                    <input type="text" value={hotelLocation} onChange={(e) => setHotelLocation(e.target.value)} placeholder="Jl. Contoh No. 123" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Deskripsi</label>
                                    <textarea value={hotelDescription} onChange={(e) => setHotelDescription(e.target.value)} placeholder="Deskripsi Hotel" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive h-32 resize-none transition-all"></textarea>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-restify-olive transition-all group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-restify-olive"><FiImage /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-tighter">Foto Hotel</span>
                                            <span className="text-[10px] text-gray-400 line-clamp-1">{hotelImage ? hotelImage.name : 'Belum ada file'}</span>
                                        </div>
                                        <input type="file" className="hidden" onChange={(e) => setHotelImage(e.target.files?.[0] || null)} accept="image/*" />
                                    </label>
                                    <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-restify-olive transition-all group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-restify-olive"><FiImage /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-tighter">QRIS Payment</span>
                                            <span className="text-[10px] text-gray-400 line-clamp-1">{hotelQris ? hotelQris.name : 'Belum ada file'}</span>
                                        </div>
                                        <input type="file" className="hidden" onChange={(e) => setHotelQris(e.target.files?.[0] || null)} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <label className="block text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Fasilitas Hotel</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                                {availableHotelFacilities.map((fac) => {
                                    const isChecked = selectedHotelFacilities.includes(fac.label);
                                    return (
                                        <label 
                                            key={fac.key} 
                                            className={`flex items-center justify-between p-3 px-4 bg-gray-50 border-2 rounded-2xl cursor-pointer select-none transition-all hover:bg-gray-100/50 ${
                                                isChecked 
                                                    ? 'border-restify-olive bg-restify-olive/5' 
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                                <span>{fac.emoji}</span>
                                                <span>{fac.label}</span>
                                            </span>
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked} 
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedHotelFacilities([...selectedHotelFacilities, fac.label]);
                                                    } else {
                                                        setSelectedHotelFacilities(selectedHotelFacilities.filter(f => f !== fac.label));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-restify-olive focus:ring-restify-olive h-4 w-4 accent-restify-olive cursor-pointer"
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex gap-2 max-w-md">
                                <input 
                                    type="text" 
                                    value={customHotelFacilityName}
                                    onChange={(e) => setCustomHotelFacilityName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCustomHotelFacility();
                                        }
                                    }}
                                    placeholder="Ketik fasilitas hotel kustom... (cth: Parkir Valet)" 
                                    className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" 
                                />
                                <button 
                                    type="button"
                                    onClick={handleAddCustomHotelFacility}
                                    className="bg-restify-olive text-white px-4 rounded-2xl font-black text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0"
                                >
                                    + Tambah
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button 
                                onClick={handleSubmitHotel}
                                disabled={isSubmitting}
                                className="bg-restify-dark text-white font-black text-lg px-20 py-4 rounded-3xl hover:shadow-2xl transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Memproses...' : (view === 'add' ? 'Tambah Hotel' : 'Simpan Perubahan')}
                            </button>
                        </div>
                    </div>
                )}

                {}
                {view === 'room_list' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-black uppercase tracking-widest">Daftar Tipe Kamar</h2>
                            <button onClick={() => setView('room_add')} className="bg-restify-olive text-white px-6 py-2.5 rounded-full font-black text-xs shadow-lg shadow-restify-olive/20 flex items-center gap-2">
                                <FiPlus /> Tambah Tipe
                            </button>
                        </div>

                        <div className="p-8">
                            {rooms.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 italic">Belum ada data kamar untuk hotel ini.</div>
                            ) : (
                                <div className="space-y-4">
                                    {rooms.map(room => (
                                        <div key={room.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                                            <div>
                                                <h4 className="font-black text-lg">{room.room_type}</h4>
                                                <p className="text-sm font-bold text-restify-olive">Rp {parseFloat(room.price).toLocaleString('id-ID')} <span className="text-[10px] text-gray-400 font-normal uppercase">/ malam</span></p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Kapasitas: {room.capacity} Orang</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditRoomData(room); setView('room_edit'); }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                                                    <FiEdit />
                                                </button>
                                                <button onClick={() => handleDeleteRoom(room.id)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {}
                {(view === 'room_add' || view === 'room_edit') && (
                    <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Tipe Kamar</label>
                                    <input type="text" value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder="Contoh: Deluxe King Ocean" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Harga / Malam</label>
                                        <input type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} placeholder="Rp 0" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Ukuran Kamar</label>
                                        <input type="text" value={roomSize} onChange={(e) => setRoomSize(e.target.value)} placeholder="Contoh: 3 × 3 Meter" className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Kapasitas Tamu</label>
                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-3 border border-transparent">
                                            <button type="button" onClick={() => setRoomCapacity(Math.max(1, roomCapacity - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-restify-olive shadow-sm active:scale-95 transition-all"><FiMinus /></button>
                                            <span className="font-black text-lg">{roomCapacity}</span>
                                            <button type="button" onClick={() => setRoomCapacity(roomCapacity + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-restify-olive shadow-sm active:scale-95 transition-all"><FiPlus /></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Kamar Tidur</label>
                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-3 border border-transparent">
                                            <button type="button" onClick={() => setRoomBedrooms(Math.max(1, roomBedrooms - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-restify-olive shadow-sm active:scale-95 transition-all"><FiMinus /></button>
                                            <span className="font-black text-lg">{roomBedrooms}</span>
                                            <button type="button" onClick={() => setRoomBedrooms(roomBedrooms + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-restify-olive shadow-sm active:scale-95 transition-all"><FiPlus /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Deskripsi Fasilitas</label>
                                    <textarea value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} placeholder="Sebutkan deskripsi fasilitas kamar..." className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-restify-olive h-32 resize-none transition-all"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Foto Kamar</label>
                                    <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-restify-olive transition-all group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-restify-olive"><FiImage /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-tighter">Upload Foto</span>
                                            <span className="text-[10px] text-gray-400 line-clamp-1">{roomImage ? roomImage.name : (roomImagePreview ? 'Foto saat ini tersimpan' : 'Belum ada file')}</span>
                                        </div>
                                        <input type="file" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setRoomImage(file);
                                            if (file) {
                                                setRoomImagePreview(URL.createObjectURL(file));
                                            }
                                        }} accept="image/*" />
                                    </label>
                                    {roomImagePreview && (
                                        <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-200">
                                            <img src={roomImagePreview} alt="Preview foto kamar" className="w-full h-40 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setRoomImage(null); setRoomImagePreview(null); }}
                                                className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Fasilitas Kamar</label>
                                    <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                                        {availableFacilities.map((fac) => {
                                            const isChecked = selectedFacilities.includes(fac.label);
                                            return (
                                                <label 
                                                    key={fac.key} 
                                                    className={`flex items-center justify-between p-3 px-4 bg-gray-50 border-2 rounded-2xl cursor-pointer select-none transition-all hover:bg-gray-100/50 ${
                                                        isChecked 
                                                            ? 'border-restify-olive bg-restify-olive/5' 
                                                            : 'border-transparent'
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                                        <span>{fac.emoji}</span>
                                                        <span>{fac.label}</span>
                                                    </span>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isChecked} 
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedFacilities([...selectedFacilities, fac.label]);
                                                            } else {
                                                                setSelectedFacilities(selectedFacilities.filter(f => f !== fac.label));
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-restify-olive focus:ring-restify-olive h-4 w-4 accent-restify-olive cursor-pointer"
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <input 
                                            type="text" 
                                            value={customFacilityName}
                                            onChange={(e) => setCustomFacilityName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddCustomFacility();
                                                }
                                            }}
                                            placeholder="Ketik fasilitas kustom... (cth: Bathtub)" 
                                            className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-restify-olive transition-all" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleAddCustomFacility}
                                            className="bg-restify-olive text-white px-4 rounded-2xl font-black text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0"
                                        >
                                            + Tambah
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button 
                                onClick={handleSubmitRoom}
                                disabled={isSubmitting}
                                className="bg-restify-dark text-white font-black text-lg px-20 py-4 rounded-3xl hover:shadow-2xl transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Memproses...' : (view === 'room_add' ? 'Tambah Kamar' : 'Simpan Perubahan')}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
