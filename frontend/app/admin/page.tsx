'use client';

import React, { useState, useEffect } from 'react';
import styles from './AdminPage.module.css';
import { 
    FiHome, FiUsers, FiMenu, FiSearch, FiPlus, FiEdit3, 
    FiTrash2, FiMapPin, FiFileText, FiArrowLeft, FiUploadCloud, FiX, FiSave, FiMinus, FiInfo, FiEye, FiEyeOff, FiCheckSquare
} from 'react-icons/fi';
import { BiBuildingHouse } from 'react-icons/bi';
import { MdOutlineBed } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';

export default function AdminPage() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    
    const [totalHotel, setTotalHotel] = useState<number | string>("...");
    const [totalKamar, setTotalKamar] = useState<number | string>("...");
    const [totalPengguna, setTotalPengguna] = useState<number | string>("...");

    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            const fetchedUsers = Array.isArray(response.data) ? response.data : (response.data.data || []);
            const mapped = fetchedUsers.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone || '',
                role: u.role_id === 1 ? 'Admin' : (u.role_id === 3 ? 'Resepsionis' : 'Tamu'),
                status: 'Aktif',
                hotelId: u.hotel_id || '',
                hotelName: u.hotel?.name || ''
            }));
            setUsers(mapped);
            setTotalPengguna(mapped.length);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
        }
    };

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                
                const hotelRes = await api.get('/admin/hotels');
                const hotelCount = hotelRes.data.total !== undefined ? hotelRes.data.total : (hotelRes.data.data?.length || hotelRes.data.length || 0);
                setTotalHotel(hotelCount);

                
                const roomRes = await api.get('/admin/rooms');
                const roomCount = roomRes.data.total !== undefined ? roomRes.data.total : (roomRes.data.data?.length || roomRes.data.length || 0);
                setTotalKamar(roomCount);

                
                await fetchUsers();
            } catch (error) {
                console.error("Gagal memuat statistik dashboard:", error);
                setTotalHotel(0);
                setTotalKamar(0);
                setTotalPengguna(0);
            }
        };

        let interval: NodeJS.Timeout;

        if (user && user.role === 'admin') {
            fetchDashboardStats();

            
            interval = setInterval(() => {
                fetchDashboardStats();
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [user, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role === 'receptionist') {
                router.push('/receptionist');
            } else if (user.role === 'user') {
                router.push('/home');
            }
        }
    }, [user, isLoading, router]);

    const [activeTab, setActiveTab] = useState('dashboard'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [editingHotel, setEditingHotel] = useState<any>(null);

    
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [editingRoom, setEditingRoom] = useState<any>(null);

    
    const [editingUser, setEditingUser] = useState<any>(null);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    
    const [namaPengguna, setNamaPengguna] = useState('');
    const [emailPengguna, setEmailPengguna] = useState('');
    const [noTelpPengguna, setNoTelpPengguna] = useState('');
    const [passwordPengguna, setPasswordPengguna] = useState('');
    const [peranPengguna, setPeranPengguna] = useState('Tamu'); 
    const [statusPengguna, setStatusPengguna] = useState('Aktif');
    const [idHotelPengguna, setIdHotelPengguna] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    
    const resetFormPengguna = () => {
        setNamaPengguna('');
        setEmailPengguna('');
        setNoTelpPengguna('');
        setPasswordPengguna('');
        setPeranPengguna('Tamu');
        setStatusPengguna('Aktif');
        setIdHotelPengguna('');
        setShowPassword(false);
        setEditingUser(null);
    };

    const handleEditPengguna = (user: any) => {
        setEditingUser(user);
        setNamaPengguna(user.name);
        setEmailPengguna(user.email);
        setNoTelpPengguna(user.phone);
        setPasswordPengguna('********');
        setPeranPengguna(user.role);
        setStatusPengguna(user.status);
        setIdHotelPengguna(user.hotelId || '');
        setActiveTab('tambahPengguna');
    };

    const handleHapusPengguna = async (userId: any) => {
        if(confirm("Apakah Anda yakin ingin menghapus akun pengguna ini?")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                fetchUsers();
                toast.success("Pengguna berhasil dihapus");
            } catch (error: any) {
                console.error("Gagal menghapus pengguna:", error);
                toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
            }
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSimpanPengguna = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload: any = {
            name: namaPengguna,
            email: emailPengguna,
            phone: noTelpPengguna,
            role_id: peranPengguna === 'Admin' ? 1 : (peranPengguna === 'Resepsionis' ? 3 : 2),
        };

        if (peranPengguna === 'Resepsionis') {
            payload.hotel_id = idHotelPengguna;
        }

        if (!editingUser || (passwordPengguna && passwordPengguna !== '********')) {
            payload.password = passwordPengguna || 'User1234';
            payload.password_confirmation = payload.password;
        }

        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, payload);
                toast.success("Pengguna berhasil diupdate");
            } else {
                await api.post(`/admin/users`, payload);
                toast.success("Pengguna berhasil ditambahkan");
            }
            fetchUsers();
            resetFormPengguna();
            setActiveTab('pengguna');
        } catch (error: any) {
            console.error("Gagal menyimpan pengguna:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan data pengguna.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    
    const [namaKamar, setNamaKamar] = useState('');
    const [hargaKamar, setHargaKamar] = useState('');
    const [ukuranKamar, setUkuranKamar] = useState('');
    const [deskripsiKamar, setDeskripsiKamar] = useState('');
    const [jumlahKamarMandi, setJumlahKamarMandi] = useState(1);
    const [jumlahKamarTidur, setJumlahKamarTidur] = useState(1);
    const [jumlahKamarTersediaForm, setJumlahKamarTersediaForm] = useState(1);
    const [fasilitasKamar, setFasilitasKamar] = useState({
        sarapan: false, tv: false, makanSiang: false, penyejukUdara: false,
        makanMalam: false, wifi: false, kulkas: false, tempatTidurTambahan: false
    });
    const [roomImage, setRoomImage] = useState<File | null>(null);
    const [roomImagePreview, setRoomImagePreview] = useState<string | null>(null);
    
        const [hotels, setHotels] = useState<any[]>([
            { 
                id: 1, name: 'Hotel Grand Serela', location: 'Bandung, Indonesia', rating: '4.5', image: '/images/Restify_BG2.png',
                rooms: [
                    { id: 101, name: 'Kamar Suite', available: 3, image: '/images/Restify_BG2.png', price: 1200000, size: 36, description: 'Kamar mewah dengan fasilitas premium.', facilities: { sarapan: true, tv: true }, kamarMandi: 1, kamarTidur: 1 },
                    { id: 102, name: 'Kamar Superior Flat', available: 5, image: '/images/Restify_BG2.png', price: 850000, size: 28, description: 'Kamar flat nyaman minimalis.', facilities: { wifi: true, penyejukUdara: true }, kamarMandi: 1, kamarTidur: 1 },
                    { id: 103, name: 'Kamar Grand Deluxe', available: 7, image: '/images/Restify_BG2.png', price: 1050000, size: 32, description: 'Kamar deluxe dengan space luas.', facilities: { sarapan: true, wifi: true, penyejukUdara: true }, kamarMandi: 1, kamarTidur: 1 },
                    { id: 104, name: 'Kamar Superior Terrace', available: 4, image: '/images/Restify_BG2.png', price: 950000, size: 30, description: 'Kamar nyaman terhubung dengan teras luar.', facilities: { tv: true, wifi: true }, kamarMandi: 1, kamarTidur: 1 }
                ]
            },
            { id: 2, name: 'Hotel Aston Tropicana', location: 'Bandung, Indonesia', rating: '4.7', image: '/images/Restify_BG2.png', rooms: [] },
            { id: 3, name: 'Hotel Swiss-Belresort', location: 'Bandung, Indonesia', rating: '4.6', image: '/images/Restify_BG2.png', rooms: [] },
            { id: 4, name: 'Hotel Harris Ciumbuleuit', location: 'Bandung, Indonesia', rating: '4.4', image: '/images/Restify_BG2.png', rooms: [] },
        ]);

    
    const [namaHotel, setNamaHotel] = useState('');
    const [lokasiHotel, setLokasiHotel] = useState('');
    const [deskripsiHotel, setDeskripsiHotel] = useState('');
    
    const [showFasilitas, setShowFasilitas] = useState(false);
    const [fasilitas, setFasilitas] = useState({
        kolamRenang: false,
        restoran: false,
        ruangSerbaGuna: false
    });

    
    const handleCheckboxChange = (e: any) => {
        const { name, checked } = e.target;
        setFasilitas(prev => ({ ...prev, [name]: checked }));
    };

    const handleEdit = (hotel: any) => {
        setEditingHotel(hotel); 
        setNamaHotel(hotel.name || hotel.nama);
        setLokasiHotel(hotel.location || hotel.lokasi);
        setActiveTab('tambahHotel'); 
    };

    
    const resetForm = () => {
        setNamaHotel('');
        setLokasiHotel('');
        setDeskripsiHotel('');
        setShowFasilitas(false);
        setFasilitas({ kolamRenang: false, restoran: false, ruangSerbaGuna: false });
        setEditingHotel(null); 
    };

    const handleSimpanHotel = (e: any) => {
        e.preventDefault();
        
        if (!namaHotel || !lokasiHotel || !deskripsiHotel) {
            toast.warning('Mohon lengkapi semua bidang yang bertanda bintang (*)!');
            return;
        }

        if (editingHotel) {
            
            setHotels(hotels.map(hotel => {
                if (hotel.id === editingHotel.id) {
                    return {
                        ...hotel,
                        name: namaHotel,
                        location: lokasiHotel,
                        
                    };
                }
                return hotel;
            }));
            toast.success("Hotel berhasil diperbarui");
        } else {
            
            const newHotel = {
                id: Date.now(),
                name: namaHotel,
                location: lokasiHotel,
                rating: '4.5',
                image: '/images/Restify_BG2.png',
                rooms: []
            };

            setHotels([newHotel, ...hotels]); 
            toast.success("Hotel berhasil ditambahkan");
        }

        resetForm();
        setActiveTab('hotel'); 
    };

    
    const handleDeleteHotel = (id: any) => {
        setHotels(hotels.filter(hotel => hotel.id !== id));
        toast.success("Hotel berhasil dihapus");
    };


    const handleBukaDataKamar = (hotel: any) => {
        setSelectedHotel(hotel);
        setActiveTab('dataKamar');
    };

    const handleUbahKamarTersedia = (roomId: any, increment: any) => {
        setHotels(hotels.map(h => {
            if (h.id === selectedHotel.id) {
                const updatedRooms = h.rooms.map((r: any) => {
                    if (r.id === roomId) {
                        const newVal = r.available + (increment ? 1 : -1);
                        return { ...r, available: newVal < 0 ? 0 : newVal };
                    }
                    return r;
                });
                setSelectedHotel({ ...h, rooms: updatedRooms });
                return { ...h, rooms: updatedRooms };
            }
            return h;
        }));
    };

    const handleHapusKamar = (roomId: any) => {
        if(confirm("Apakah Anda yakin ingin menghapus tipe kamar ini?")) {
            setHotels(hotels.map(h => {
                if (h.id === selectedHotel.id) {
                    const updatedRooms = h.rooms.filter((r: any) => r.id !== roomId);
                    setSelectedHotel({ ...h, rooms: updatedRooms });
                    toast.success("Tipe kamar berhasil dihapus");
                    return { ...h, rooms: updatedRooms };
                }
                return h;
            }));
        }
    };

    const resetFormKamar = () => {
        setNamaKamar('');
        setHargaKamar('');
        setUkuranKamar('');
        setDeskripsiKamar('');
        setJumlahKamarMandi(1);
        setJumlahKamarTidur(1);
        setJumlahKamarTersediaForm(1);
        setFasilitasKamar({
            sarapan: false, tv: false, makanSiang: false, penyejukUdara: false,
            makanMalam: false, wifi: false, kulkas: false, tempatTidurTambahan: false
        });
        setRoomImage(null);
        setRoomImagePreview(null);
        setEditingRoom(null);
    };

    const handleEditKamar = (room: any) => {
        setEditingRoom(room);
        setNamaKamar(room.name);
        setHargaKamar(room.price || '');
        setUkuranKamar(room.size || '');
        setDeskripsiKamar(room.description || '');
        setJumlahKamarMandi(room.kamarMandi || 1);
        setJumlahKamarTidur(room.kamarTidur || 1);
        setJumlahKamarTersediaForm(room.available || 1);
        setFasilitasKamar({ ...room.facilities });
        setRoomImage(null);
        setRoomImagePreview(room.image || null);
        setActiveTab('tambahKamar');
    };

    const handleSimpanKamar = (e: any) => {
        e.preventDefault();
        
        setHotels(hotels.map(h => {
            if (h.id === selectedHotel.id) {
                let updatedRooms;
                if (editingRoom) {
                    updatedRooms = h.rooms.map((r: any) => r.id === editingRoom.id ? {
                        ...r, name: namaKamar, price: Number(hargaKamar), size: Number(ukuranKamar),
                        description: deskripsiKamar, available: jumlahKamarTersediaForm,
                        kamarMandi: jumlahKamarMandi, kamarTidur: jumlahKamarTidur, facilities: fasilitasKamar,
                        image: roomImagePreview || r.image
                    } : r);
                    toast.success("Kamar berhasil diperbarui");
                } else {
                    const newRoom = {
                        id: Date.now(), name: namaKamar, price: Number(hargaKamar), size: Number(ukuranKamar),
                        description: deskripsiKamar, available: jumlahKamarTersediaForm,
                        kamarMandi: jumlahKamarMandi, kamarTidur: jumlahKamarTidur, facilities: fasilitasKamar,
                        image: roomImagePreview || '/images/Restify_BG2.png'
                    };
                    updatedRooms = [...h.rooms, newRoom];
                    toast.success("Kamar berhasil ditambahkan");
                }
                setSelectedHotel({ ...h, rooms: updatedRooms });
                return { ...h, rooms: updatedRooms };
            }
            return h;
        }));

        resetFormKamar();
        setActiveTab('dataKamar');
    };
    
    
    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.adminContainer}>
            
            {}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoArea}>
                        <BiBuildingHouse className={styles.logoIcon} />
                        <span className={styles.logoText}>RESTIFY</span>
                    </div>
                </div>

                <div className={styles.sidebarMenu}>
                    <p className={styles.menuTitle}>Menu Utama</p>
                    
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`${styles.menuItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                    >
                        <FiHome /> Dashboard
                    </button>

                    <button 
                        onClick={() => router.push('/admin/hotels')}
                        className={`${styles.menuItem}`}
                    >
                        <BiBuildingHouse /> Data Hotel
                    </button>

                    <button 
                        onClick={() => router.push('/admin/dataPengguna')}
                        className={`${styles.menuItem}`}
                    >
                        <FiUsers /> Data Pengguna
                    </button>
                </div>

                <div className={styles.sidebarFooter}>
                    <button 
                        onClick={async () => {
                            await logout();
                            notify.auth.logoutSuccess();
                            router.push('/login');
                        }} 
                        className={styles.logoutBtn}
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            {}
            <main className={styles.mainContent}>
                <header className={styles.navbar}>
                    <button className={styles.toggleBtn}>
                        <FiMenu />
                    </button>
                    <h1 className={styles.navbarTitle}>ADMIN</h1>
                    <div className={styles.spacer}></div>
                </header>

                <div className={styles.contentArea}>
                    
                {}
                {activeTab === 'dashboard' && (
                    <div className={styles.dashboardViewSection}>
                        
                        {}
                        <div className={styles.welcomeBannerBox}>
                            <h2 className={styles.welcomeBannerTitle}>Selamat datang, Admin! 👋</h2>
                            <p className={styles.welcomeBannerSubtitle}>Kelola data hotel, kamar, dan pengguna.</p>
                        </div>

                        {}
                        <div className={styles.statsCardsWrapper}>
                            
                            {}
                            <div className={styles.statsCardsRowTop}>
                                
                                {}
                                <div className={styles.summaryStatCard}>
                                    <div className={`${styles.statCircleBadge} ${styles.colorMutedGreen}`}>
                                        {}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                                            <path d="M7 22V14h10v8"></path>
                                            <path d="M9 7h2v2H9z"></path>
                                            <path d="M13 7h2v2h-2z"></path>
                                            <path d="M9 11h2v2H9z"></path>
                                            <path d="M13 11h2v2h-2z"></path>
                                        </svg>
                                    </div>
                                    <div className={styles.statCardContent}>
                                        <span className={styles.statLabelHeading}>Total Hotel</span>
                                        <span className={styles.statDisplayNumber}>{totalHotel}</span>
                                    </div>
                                </div>

                                {}
                                <div className={styles.summaryStatCard}>
                                    <div className={`${styles.statCircleBadge} ${styles.colorSoftYellow}`}>
                                        {}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 4v16M22 4v16M2 8h20M2 14h20M6 8v6M10 8v6M14 8v6M18 8v6"></path>
                                        </svg>
                                    </div>
                                    <div className={styles.statCardContent}>
                                        <span className={styles.statLabelHeading}>Total Kamar</span>
                                        <span className={styles.statDisplayNumber}>{totalKamar}</span>
                                    </div>
                                </div>

                            </div>

                            {}
                            <div className={styles.statsCardsRowBottom}>
                                
                                {}
                                <div className={styles.summaryStatCard}>
                                    <div className={`${styles.statCircleBadge} ${styles.colorSoftBlue}`}>
                                        {}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <div className={styles.statCardContent}>
                                        <span className={styles.statLabelHeading}>Total Pengguna</span>
                                        <span className={styles.statDisplayNumber}>{totalPengguna}</span>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                )}

                    {}
                    {activeTab === 'hotel' && (
                        <div className={styles.hotelViewSection}>
                            <div className={styles.hotelControlsBar}>
                                <h2 className={styles.viewTitleText}>Data Hotel</h2>
                                
                                <div className={styles.searchBarWrapper}>
                                    <FiSearch className={styles.searchIconInside} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari Data Hotel" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.hotelSearchInput}
                                    />
                                </div>

                                <button 
                                    onClick={() => { setEditingHotel(null); resetForm(); setActiveTab('tambahHotel'); }} 
                                    className={styles.addHotelBtn}
                                >
                                    <FiPlus /> Tambah Hotel
                                </button>
                            </div>

                            <div className={styles.hotelGridContainer}>
                                {filteredHotels.length > 0 ? (
                                    filteredHotels.map((hotel) => (
                                        <div key={hotel.id} className={styles.hotelCardItem}>
                                            <div className={styles.hotelImageThumbnail}>
                                                <div className={styles.actualImgPlaceholder} style={{ backgroundImage: `url(${hotel.image})` }} />
                                            </div>

                                            <div className={styles.hotelDetailsWrapper}>
                                                <div className={styles.hotelCardTopRow}>
                                                    <div>
                                                        <h3 className={styles.hotelNameText}>{hotel.name}</h3>
                                                        <p className={styles.hotelLocationText}>
                                                            <FiMapPin className={styles.pinIcon} /> {hotel.location}
                                                        </p>
                                                    </div>
                                                    <span className={styles.ratingBadgeText}>⭐ {hotel.rating}</span>
                                                </div>

                                                <div className={styles.hotelActionButtonsGroup}>
                                                    <button 
                                                        onClick={() => handleEdit(hotel)} 
                                                        className={`${styles.actionBtnOutline} ${styles.btnUbah}`}
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button onClick={() => handleBukaDataKamar(hotel)} className={`${styles.actionBtnOutline} ${styles.btnKamar}`}>
                                                        <FiFileText size={12} /> Data Kamar
                                                    </button>
                                                    <button onClick={() => handleDeleteHotel(hotel.id)} className={`${styles.actionBtnOutline} ${styles.btnHapus}`}>
                                                        <FiTrash2 size={12} /> Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyStateNotice}>Tidak ada data hotel.</div>
                                )}
                            </div>
                        </div>
                    )}
                    

                    {}
                    {activeTab === 'tambahHotel' && (
                        <div className={styles.formContainerSection}>
                            
                            <div className={styles.formHeaderRow}>
                                <div>
                                    <h2 className={styles.formMainTitle}>
                                        {editingHotel ? 'Ubah Data Hotel' : 'Tambah Hotel Baru'}
                                    </h2>
                                    <p className={styles.formSubTitle}>Lengkapi informasi hotel dengan tepat</p>
                                </div>
                                <button type="button" onClick={() => { resetForm(); setActiveTab('hotel'); }} className={styles.backBtnOutline}>
                                    <FiArrowLeft size={14} /> Kembali
                                </button>
                            </div>

                            <form onSubmit={handleSimpanHotel}>
                                {}
                                <div className={styles.formCardBox}>
                                    <h3 className={styles.boxSectionTitle}>
                                        <BiBuildingHouse /> Informasi Hotel
                                    </h3>
                                    
                                    <div className={styles.inputsResponsiveGrid}>
                                        <div className={styles.inputFieldGroup}>
                                            <label>Nama Hotel <span className={styles.requiredStar}>*</span></label>
                                            <input 
                                                type="text" 
                                                placeholder="Masukkan nama hotel" 
                                                value={namaHotel}
                                                onChange={(e) => setNamaHotel(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className={styles.inputFieldGroup}>
                                            <label>Lokasi <span className={styles.requiredStar}>*</span></label>
                                            <div className={styles.inputIconWrapper}>
                                                <FiMapPin className={styles.innerFieldIcon} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Masukkan lokasi hotel" 
                                                    value={lokasiHotel}
                                                    onChange={(e) => setLokasiHotel(e.target.value)}
                                                    required
                                                    style={{ paddingLeft: '36px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.inputsResponsiveGrid}>
                                        <div className={styles.inputFieldGroup}>
                                            <label>Deskripsi Hotel <span className={styles.requiredStar}>*</span></label>
                                            <textarea 
                                                rows={5} 
                                                placeholder="Masukkan deskripsi hotel" 
                                                value={deskripsiHotel}
                                                onChange={(e) => setDeskripsiHotel(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className={styles.inputFieldGroup}>
                                            {}
                                            <div className={styles.mainFasilitasHeaderWrapper}>
                                                <span className={styles.labelTitleText}>Fasilitas Hotel</span>
                                                <input 
                                                    type="checkbox" 
                                                    id="toggleFasilitas"
                                                    checked={showFasilitas} 
                                                    onChange={(e) => {
                                                        setShowFasilitas(e.target.checked);
                                                        if (!e.target.checked) {
                                                            
                                                            setFasilitas({ kolamRenang: false, restoran: false, ruangSerbaGuna: false });
                                                        }
                                                    }}
                                                    className={styles.mainToggleCheckbox}
                                                />
                                                <label htmlFor="toggleFasilitas" className={styles.mainToggleBoxVisual}></label>
                                            </div>

                                            {}
                                            {showFasilitas ? (
                                                <div className={`${styles.checkboxListWrapper} ${styles.fadeInAnimation}`}>
                                                    <label className={styles.checkboxCustomLabel}>
                                                        <input type="checkbox" name="kolamRenang" checked={fasilitas.kolamRenang} onChange={handleCheckboxChange} />
                                                        <span>Kolam Renang</span>
                                                    </label>
                                                    <label className={styles.checkboxCustomLabel}>
                                                        <input type="checkbox" name="restoran" checked={fasilitas.restoran} onChange={handleCheckboxChange} />
                                                        <span>Restoran</span>
                                                    </label>
                                                    <label className={styles.checkboxCustomLabel}>
                                                        <input type="checkbox" name="ruangSerbaGuna" checked={fasilitas.ruangSerbaGuna} onChange={handleCheckboxChange} />
                                                        <span>Ruang Serba Guna</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className={styles.disabledFasilitasNotice}>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className={styles.formCardBox}>
                                    <h3 className={styles.boxSectionTitle}>
                                        <FiFileText /> Media & Kamar
                                    </h3>

                                    <div className={styles.mediaTripleGrid}>
                                        <div className={styles.subMediaCard}>
                                            <h4>Foto Hotel</h4>
                                            <div className={styles.dragDropZoneBox}>
                                                <FiUploadCloud className={styles.uploadCloudIcon} />
                                                <p className={styles.mainUploadText}>Klik atau drag file ke sini</p>
                                                <p className={styles.subUploadText}>Format: JPG, PNG (Max, 10MB)</p>
                                                <button type="button" className={styles.miniSelectFileBtn}>Pilih File</button>
                                            </div>
                                        </div>

                                        <div className={styles.subMediaCard}>
                                            <h4>Lokasi di Peta</h4>
                                            <div className={styles.mapZoneBox}>
                                                <div className={styles.mockMapPinIndicator}>📍</div>
                                                <button type="button" className={styles.miniSelectFileBtn}>Pilih Lokasi di peta</button>
                                            </div>
                                        </div>

                                        <div className={styles.subMediaCard}>
                                            <h4>Data Kamar</h4>
                                            <div className={styles.roomZoneBox}>
                                                <MdOutlineBed className={styles.roomIconEmpty} />
                                                <p className={styles.mainUploadText}>Belum ada data kamar</p>
                                                <p className={styles.subUploadText}>Tambah data kamar untuk hotel ini</p>
                                                <button type="button" className={styles.miniSelectFileBtn}>Tambah Data Kamar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className={styles.formActionFooterRow}>
                                    <button type="button" onClick={() => { resetForm(); setActiveTab('hotel'); }} className={styles.btnFooterBatal}>
                                        <FiX size={14} /> Batal
                                    </button>
                                    <button type="submit" className={styles.btnFooterSimpan}>
                                        <FiSave size={14} /> Simpan Hotel
                                    </button>
                                </div>
                            </form>

                        </div>
                    )}

                    {}
                    {activeTab === 'dataKamar' && selectedHotel && (
                        <div className={styles.roomViewSection}>
                            <div className={styles.roomControlsBar}>
                                <div>
                                    <h2 className={styles.viewTitleText}>Data Kamar</h2>
                                    <p className={styles.roomSubHotelTitle}>Hotel: <span className={styles.hotelHighlightText}>"{selectedHotel.name}"</span></p>
                                </div>
                                <div className={styles.roomActionTopGroup}>
                                    <button onClick={() => setActiveTab('hotel')} className={styles.backBtnOutlineRed}>
                                        ← Kembali
                                    </button>
                                    <button onClick={() => { resetFormKamar(); setActiveTab('tambahKamar'); }} className={styles.addRoomBtn}>
                                        + Tambah Tipe Kamar
                                    </button>
                                </div>
                            </div>

                            <div className={styles.roomTableContainer}>
                                <table className={styles.roomTable}>
                                    <thead>
                                        <tr>
                                            <th>Tipe Kamar</th>
                                            <th>Kamar Tersedia</th>
                                            <th>Perbarui</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                                            selectedHotel.rooms.map((room: any) => (
                                                <tr key={room.id}>
                                                    <td>
                                                        <div className={styles.roomTypeCell}>
                                                            <div className={styles.roomMiniImg} style={{ backgroundImage: `url(${room.image})` }} />
                                                            <span className={styles.roomTypeName}>{room.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className={styles.centerText}>
                                                        <div className={styles.availableCountText}>{room.available}</div>
                                                        <div className={styles.availableSubText}>Kamar Tersedia</div>
                                                    </td>
                                                    <td>
                                                        <div className={styles.roomUpdateActions}>
                                                            <button onClick={() => handleUbahKamarTersedia(room.id, true)} className={`${styles.iconGridBtn} ${styles.bgGreenIcon}`} title="Tambah Tersedia">
                                                                <FiPlus size={16} />
                                                            </button>
                                                            <button onClick={() => handleUbahKamarTersedia(room.id, false)} className={`${styles.iconGridBtn} ${styles.bgYellowIcon}`} title="Kurangi Tersedia">
                                                                <FiMinus size={16} />
                                                            </button>
                                                            <button onClick={() => handleEditKamar(room)} className={`${styles.iconGridBtn} ${styles.bgNavyIcon}`} title="Ubah Detail">
                                                                <FiEdit3 size={14} />
                                                            </button>
                                                            <button onClick={() => handleHapusKamar(room.id)} className={`${styles.iconGridBtn} ${styles.bgRedIcon}`} title="Hapus Kamar">
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className={styles.emptyTableRow}>Belum ada data tipe kamar untuk hotel ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.roomTotalBanner}>
                                <FiInfo className={styles.infoIconBanner} />
                                <span>Total seluruh kamar tersedia: {selectedHotel.rooms ? selectedHotel.rooms.reduce((acc: number, curr: any) => acc + curr.available, 0) : 0} kamar</span>
                            </div>
                        </div>
                    )}

                    {}
                    {activeTab === 'tambahKamar' && selectedHotel && (
                        <div className={styles.formContainerSection}>
                            <div className={styles.formHeaderRow}>
                                <div>
                                    <h2 className={styles.formMainTitle}>
                                        {editingRoom ? 'Ubah Data Kamar' : 'Tambah Data Kamar'} <span className={styles.hotelHighlightTextForm}>"{selectedHotel.name}"</span>
                                    </h2>
                                    <p className={styles.formSubTitle}>Lengkapi informasi kamar dengan tepat</p>
                                </div>
                                <button type="button" onClick={() => { resetFormKamar(); setActiveTab('dataKamar'); }} className={styles.backBtnOutlineRed}>
                                    ← Kembali
                                </button>
                            </div>

                            <form onSubmit={handleSimpanKamar}>
                                <div className={styles.formCardBox}>
                                    <h3 className={styles.boxSectionTitle}>
                                        📝 Informasi Kamar
                                    </h3>
                                    <div className={styles.inputsResponsiveGrid}>
                                        <div className={styles.inputFieldLeftLayout}>
                                            <div className={styles.inputFieldGroup}>
                                                <label>Tipe Kamar <span className={styles.requiredStar}>*</span></label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Contoh: Kamar Suite" 
                                                    value={namaKamar}
                                                    onChange={(e) => setNamaKamar(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.inputFieldGroup} style={{ marginTop: '12px' }}>
                                                <label>Harga per malam <span className={styles.requiredStar}>*</span> </label>
                                                <div className={styles.inputPrefixWrapper}>
                                                    <span className={styles.prefixLabel}>Rp.</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Contoh: 123.456" 
                                                        value={hargaKamar}
                                                        onChange={(e) => setHargaKamar(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.inputFieldGroup} style={{ marginTop: '12px' }}>
                                                <label>Ukuran Kamar (m²) <span className={styles.requiredStar}>*</span></label>
                                                <input 
                                                    type="number" 
                                                    placeholder="Contoh: 3" 
                                                    value={ukuranKamar}
                                                    onChange={(e) => setUkuranKamar(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.inputFieldGroup}>
                                            <label>Deskripsi Kamar <span className={styles.requiredStar}>*</span></label>
                                            <div className={styles.textareaCounterWrapper}>
                                                <textarea 
                                                    rows={8} 
                                                    maxLength={300}
                                                    placeholder="Deskripsi kamar, fasilitas utama dan keunggulan lainnya..." 
                                                    value={deskripsiKamar}
                                                    onChange={(e) => setDeskripsiKamar(e.target.value)}
                                                    required
                                                ></textarea>
                                                <div className={styles.charCounterText}>{deskripsiKamar.length} / 300</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.mediaTripleGrid} style={{ alignItems: 'start' }}>
                                    {}
                                    <div className={styles.subMediaCard} style={{ gridColumn: 'span 2' }}>
                                        <h3 className={styles.boxSectionTitle} style={{ marginBottom: '14px' }}>
                                            ✅ Fasilitas Kamar
                                        </h3>
                                        <div className={styles.facilitiesGridList}>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.sarapan} onChange={(e) => setFasilitasKamar({...fasilitasKamar, sarapan: e.target.checked})} />
                                                <span>Sarapan</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.tv} onChange={(e) => setFasilitasKamar({...fasilitasKamar, tv: e.target.checked})} />
                                                <span>TV</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.makanSiang} onChange={(e) => setFasilitasKamar({...fasilitasKamar, makanSiang: e.target.checked})} />
                                                <span>Makan Siang</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.penyejukUdara} onChange={(e) => setFasilitasKamar({...fasilitasKamar, penyejukUdara: e.target.checked})} />
                                                <span>Penyejuk Udara</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.makanMalam} onChange={(e) => setFasilitasKamar({...fasilitasKamar, makanMalam: e.target.checked})} />
                                                <span>Makan Malam</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.wifi} onChange={(e) => setFasilitasKamar({...fasilitasKamar, wifi: e.target.checked})} />
                                                <span>Wifi</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.kulkas} onChange={(e) => setFasilitasKamar({...fasilitasKamar, kulkas: e.target.checked})} />
                                                <span>Kulkas</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <label className={styles.facilityCheckItem}>
                                                <input type="checkbox" checked={fasilitasKamar.tempatTidurTambahan} onChange={(e) => setFasilitasKamar({...fasilitasKamar, tempatTidurTambahan: e.target.checked})} />
                                                <span>Tempat Tidur Tambahan</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                        </div>

                                        {}
                                        <div className={styles.stepperRowItem}>
                                            <label className={styles.facilityCheckItem} style={{ flex: 1, margin: 0 }}>
                                                <input type="checkbox" defaultChecked />
                                                <span>Kamar Mandi</span> <span className={styles.facilityIconRight}></span>
                                            </label>
                                            <div className={styles.stepperActionBox}>
                                                <button type="button" onClick={() => setJumlahKamarMandi(prev => prev > 1 ? prev - 1 : 1)}><FiMinus /></button>
                                                <span>{jumlahKamarMandi}</span>
                                                <button type="button" onClick={() => setJumlahKamarMandi(prev => prev + 1)}><FiPlus /></button>
                                            </div>
                                        </div>

                                        {}
                                        <div className={styles.dualFormStepperRow}>
                                            <div className={styles.stepperBoxCard}>
                                                <span className={styles.stepperCardTitle}>Kamar Tidur</span>
                                                <div className={styles.stepperActionBox}>
                                                    <button type="button" onClick={() => setJumlahKamarTidur(prev => prev > 1 ? prev - 1 : 1)}><FiMinus /></button>
                                                    <span>{jumlahKamarTidur}</span>
                                                    <button type="button" onClick={() => setJumlahKamarTidur(prev => prev + 1)}><FiPlus /></button>
                                                </div>
                                            </div>
                                            <div className={`${styles.stepperBoxCard} ${styles.orangeBorderHighlight}`}>
                                                <span className={styles.stepperCardTitle}>Kamar Tersedia</span>
                                                <div className={styles.stepperActionBox}>
                                                    <button type="button" onClick={() => setJumlahKamarTersediaForm(prev => prev > 1 ? prev - 1 : 1)}><FiMinus /></button>
                                                    <span>{jumlahKamarTersediaForm}</span>
                                                    <button type="button" onClick={() => setJumlahKamarTersediaForm(prev => prev + 1)}><FiPlus /></button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.formBottomWarningBanner}>
                                            <FiInfo /> <span>Pilih fasilitas yang tersedia di kamar ini</span>
                                        </div>
                                    </div>

                                    {}
                                    <div className={styles.subMediaCard}>
                                        <h3 className={styles.boxSectionTitle} style={{ marginBottom: '14px' }}>
                                            🖼️ Media Kamar
                                        </h3>
                                        <label className={styles.dragDropZoneBox} style={{ minHeight: '230px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <FiUploadCloud className={styles.uploadCloudIcon} />
                                            <p className={styles.mainUploadText}>Klik untuk upload file</p>
                                            <p className={styles.subUploadText}>Format: JPG, PNG (Max, 10MB)</p>
                                            <span className="text-[10px] text-gray-500 mt-2">
                                                {roomImage ? roomImage.name : (roomImagePreview ? 'Foto terpilih' : 'Belum ada file')}
                                            </span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setRoomImage(file);
                                                    if (file) {
                                                        setRoomImagePreview(URL.createObjectURL(file));
                                                    }
                                                }} 
                                                accept="image/*" 
                                            />
                                        </label>
                                        {roomImagePreview && (
                                            <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-200" style={{ position: 'relative' }}>
                                                <img src={roomImagePreview} alt="Preview foto kamar" className="w-full h-40 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setRoomImage(null); setRoomImagePreview(null); }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
                                                    style={{ position: 'absolute', top: '8px', right: '8px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formActionFooterRow}>
                                    <button type="button" onClick={() => { resetFormKamar(); setActiveTab('dataKamar'); }} className={styles.btnFooterBatal}>
                                        X Batal
                                    </button>
                                    <button type="submit" className={styles.btnFooterSimpan}>
                                         Simpan Hotel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {}
                    {activeTab === 'pengguna' && (
                        <div className={styles.roomViewSection}>
                            <div className={styles.roomControlsBar}>
                                <div>
                                    <h2 className={styles.viewTitleText}>Data Pengguna</h2>
                                    <p className={styles.roomSubHotelTitle}>Kelola akun pengguna yang terdaftar dalam sistem.</p>
                                </div>
                                <button onClick={() => { resetFormPengguna(); setActiveTab('tambahPengguna'); }} className={styles.addRoomBtn}>
                                    + Tambah Pengguna
                                </button>
                            </div>

                            {}
                            <div className={styles.searchBarWrapperUsers}>
                                <FiSearch className={styles.searchIconUsers} />
                                <input 
                                    type="text" 
                                    placeholder="Cari Nama, Email, atau Peran"
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className={styles.userSearchInput}
                                />
                            </div>

                            {}
                            <div className={styles.roomTableContainer}>
                                <table className={styles.roomTable}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px' }}>No.</th>
                                            <th style={{ width: '60px' }}>PP</th>
                                            <th>Nama</th>
                                            <th>Email</th>
                                            <th>Peran</th>
                                            <th>Status</th>
                                            <th style={{ width: '120px' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className={styles.userAvatarCircle}>
                                                            <FiUsers size={16} />
                                                        </div>
                                                    </td>
                                                    <td className={styles.roomTypeName}>{user.name}</td>
                                                    <td style={{ color: '#555555', fontSize: '13px' }}>{user.email}</td>
                                                    <td>
                                                        <span className={`${styles.roleBadge} ${
                                                            user.role === 'Admin' ? styles.badgeAdmin : 
                                                            user.role === 'Resepsionis' ? styles.badgeRecep : styles.badgeTamu
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${user.status === 'Aktif' ? styles.statusAktif : styles.statusNonAktif}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className={styles.roomUpdateActions}>
                                                            <button onClick={() => handleEditPengguna(user)} className={`${styles.iconGridBtn} ${styles.bgNavyIcon}`} title="Ubah Pengguna">
                                                                <FiEdit3 size={14} />
                                                            </button>
                                                            <button onClick={() => handleHapusPengguna(user.id)} className={`${styles.iconGridBtn} ${styles.bgRedIcon}`} title="Hapus Pengguna">
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className={styles.emptyTableRow}>Data pengguna tidak ditemukan.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {}
                    {activeTab === 'tambahPengguna' && (
                        <div className={styles.formContainerWrapper}>
                            <div className={styles.formHeaderFlexRow}>
                                <div>
                                    <h2 className={styles.formSectionMainTitle}>
                                        {editingUser ? 'Ubah Data Pengguna' : 'Tambah Pengguna'}
                                    </h2>
                                    <p className={styles.formSectionSubTitle}>
                                        {editingUser ? 'Lengkapi informasi pengguna dengan benar' : 'Lengkapi informasi pengguna baru dengan benar'}
                                    </p>
                                </div>
                                <button type="button" onClick={() => { resetFormPengguna(); setActiveTab('pengguna'); }} className={styles.btnOutlineBackRed}>
                                    ← Kembali
                                </button>
                            </div>

                            <form onSubmit={handleSimpanPengguna}>
                                <div className={styles.formTwoColumnGrid}>
                                    
                                    {}
                                    <div className={styles.whiteFormBoxCard}>
                                        <h3 className={styles.boxGroupTitle}>
                                            <FiUsers style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Informasi Akun
                                        </h3>
                                        
                                        <div className={styles.formInputWrapperItem}>
                                            <label>Nama <span className={styles.redStarMark}>*</span></label>
                                            <input type="text" placeholder="Masukkan nama" value={namaPengguna} onChange={(e) => setNamaPengguna(e.target.value)} required />
                                        </div>

                                        <div className={styles.formInputWrapperItem}>
                                            <label>Email <span className={styles.redStarMark}>*</span></label>
                                            <input type="email" placeholder="Masukkan email" value={emailPengguna} onChange={(e) => setEmailPengguna(e.target.value)} required />
                                        </div>

                                        <div className={styles.formInputWrapperItem}>
                                            <label>Nomor Telepon <span className={styles.redStarMark}>*</span></label>
                                            <div style={{ position: 'relative' }}>
                                                <input type="tel" placeholder="Masukkan nomor telepon" value={noTelpPengguna} onChange={(e) => setNoTelpPengguna(e.target.value)} required />
                                                <button type="button" className={styles.inputAdornmentIconBtn}></button>
                                            </div>
                                        </div>

                                        <div className={styles.formInputWrapperItem}>
                                            <label>Kata Sandi <span className={styles.redStarMark}>*</span></label>
                                            <div style={{ position: 'relative' }}>
                                                <input type={showPassword ? "text" : "password"} placeholder="Masukkan Kata Sandi" value={passwordPengguna} onChange={(e) => setPasswordPengguna(e.target.value)} required style={{ paddingRight: '40px' }} />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.inputAdornmentIconBtn}>
                                                    {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {}
                                        {editingUser && (
                                            <div className={styles.formInputWrapperItem}>
                                                <label>Status Akun</label>
                                                <select value={statusPengguna} onChange={(e) => setStatusPengguna(e.target.value)} className={styles.customSelectDropdown}>
                                                    <option value="Aktif">Aktif</option>
                                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {}
                                    <div className={styles.whiteFormBoxCard}>
                                        <h3 className={styles.boxGroupTitle}>
                                            <FiCheckSquare style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Peran ( Role )
                                        </h3>
                                        <p className={styles.boxGroupSubHintText}>Pilih peran yang sesuai untuk pengguna ini.</p>
                                        
                                        <div className={styles.roleSelectionFlexStack}>
                                            
                                            {}
                                            <div className={`${styles.roleRadioSelectCard} ${peranPengguna === 'Tamu' ? styles.cardRoleSelected : ''}`} onClick={() => setPeranPengguna('Tamu')}>
                                                <div className={styles.roleAvatarCircleIcon}><FiUsers size={18} /></div>
                                                <div style={{ flex: 1, marginLeft: '12px' }}>
                                                    <h4 className={styles.roleNameLabelText}>Tamu</h4>
                                                    <p className={styles.roleDescriptionText}>Dapat mengakses sistem sesuai dengan hak akses sebagai pengguna.</p>
                                                </div>
                                                <div className={`${styles.radioCircleOuter} ${peranPengguna === 'Tamu' ? styles.radioCircleActive : ''}`}>
                                                    <div className={styles.radioCircleInner} />
                                                </div>
                                            </div>

                                            {}
                                            <div className={`${styles.roleRadioSelectCard} ${peranPengguna === 'Resepsionis' ? styles.cardRoleSelected : ''}`} onClick={() => setPeranPengguna('Resepsionis')}>
                                                <div className={styles.roleAvatarCircleIcon}><FiUsers size={18} /></div>
                                                <div style={{ flex: 1, marginLeft: '12px' }}>
                                                    <h4 className={styles.roleNameLabelText}>Resepsionis</h4>
                                                    <p className={styles.roleDescriptionText}>Dapat mengelola reservasi, tamu, dan data check-in / out.</p>
                                                </div>
                                                <div className={`${styles.radioCircleOuter} ${peranPengguna === 'Resepsionis' ? styles.radioCircleActive : ''}`}>
                                                    <div className={styles.radioCircleInner} />
                                                </div>
                                            </div>

                                            {}
                                            {peranPengguna === 'Resepsionis' && (
                                                <div className={styles.subConditionalInputCard}>
                                                    <label>Tetapkan Hotel <span style={{ fontWeight: 'normal', color: '#888', fontSize: '11px' }}>(via ID Hotel)</span></label>
                                                    <input type="text" placeholder="Masukkan ID Hotel" value={idHotelPengguna} onChange={(e) => setIdHotelPengguna(e.target.value)} required />
                                                </div>
                                            )}

                                            {}
                                            {peranPengguna === 'Admin' && (
                                                <div className={`${styles.roleRadioSelectCard} ${styles.cardRoleSelected}`}>
                                                    <div className={styles.roleAvatarCircleIcon}><FiUsers size={18} /></div>
                                                    <div style={{ flex: 1, marginLeft: '12px' }}>
                                                        <h4 className={styles.roleNameLabelText}>Admin</h4>
                                                        <p className={styles.roleDescriptionText}>Memiliki kontrol penuh terhadap semua konfigurasi dan manajemen sistem Restify.</p>
                                                    </div>
                                                    <div className={`${styles.radioCircleOuter} ${styles.radioCircleActive}`}>
                                                        <div className={styles.radioCircleInner} />
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        {}
                                        <div className={styles.bottomStatusNoticeBanner}>
                                            <FiInfo size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
                                            <span>Pastikan data yang dimasukkan sudah benar sebelum menyimpan</span>
                                        </div>
                                    </div>

                                </div>

                                {}
                                <div className={styles.formFooterActionFlexBar}>
                                    <button type="button" onClick={() => { resetFormPengguna(); setActiveTab('pengguna'); }} className={styles.btnActionFooterCancel}>
                                        X Batal
                                    </button>
                                    <button type="submit" className={styles.btnActionFooterSave}>
                                        💾 Simpan Pengguna
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}