"use client";

import { useState, useEffect } from "react";
import styles from "./DataKamar.module.css";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'receptionist') {
        router.push('/home');
      }
    }
  }, [user, authLoading, router]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      
      const hotelId = user?.hotel_id;
      if (!hotelId) return;

      const response = await api.get(`/hotels/${hotelId}/rooms?per_page=100`);
      setRooms(response.data.data || response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user && user.role === 'receptionist') {
        fetchRooms();

        interval = setInterval(() => {
            fetchRooms();
        }, 5000);
    }

    return () => {
        if (interval) clearInterval(interval);
    };
  }, [user]);

  const handleUpdateStatus = async (roomId: number, newStatus: string) => {
    try {
      await api.post(`/receptionist/update-room-status`, {
        room_id: roomId,
        status: newStatus
      });
      
      fetchRooms(); 
    } catch (error) {
      console.error("Gagal memperbarui status kamar:", error);
      alert("Gagal memperbarui status kamar.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/receptionist")}>Kembali</button>
        <h2 className={styles.title}>{user?.hotel?.name || "Hotel Anda"}</h2>
      </div>

      <h3 className={styles.subtitle}>Data Kamar</h3>

      {isLoading ? (
        <div className="text-center py-10">Memuat data kamar...</div>
      ) : (
        <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Tipe Kamar</span>
              <span>Harga</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            {rooms.length > 0 ? rooms.map((room) => (
              <div className={styles.tableRow} key={room.id}>
                <span>{room.room_type}</span>
                <span>Rp {parseFloat(room.price).toLocaleString('id-ID')}</span>
                <span className={`font-bold ${room.status === 'available' ? 'text-green-600' : room.status === 'booked' ? 'text-blue-600' : 'text-red-600'}`}>
                    {room.status.toUpperCase()}
                </span>

                <span className={styles.actions}>
                  <select
                    className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 font-semibold outline-none cursor-pointer focus:border-[#657657] hover:bg-gray-50 transition-colors"
                    value={room.status}
                    onChange={(e) => handleUpdateStatus(room.id, e.target.value)}
                  >
                    <option value="available">Set Available</option>
                    <option value="booked">Set Booked</option>
                    <option value="maintenance">Set Maintenance</option>
                  </select>
                </span>
              </div>
            )) : (
                <div className="text-center py-5 text-gray-500 italic">Belum ada data kamar.</div>
            )}
          </div>
      )}
    </div>
  );
}