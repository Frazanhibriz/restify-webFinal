"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./DataPengguna.module.css";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Page() {
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

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) => item.name?.toLowerCase().includes(q));
  }, [data, searchQuery]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      const fetchedUsers = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setData(fetchedUsers);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const user = data[index];
    try {
      await api.delete(`/admin/users/${user.id}`);
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      setConfirmIndex(null);
      toast.success("Pengguna berhasil dihapus");
    } catch (error: any) {
      console.error("Gagal menghapus pengguna:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/admin")}>Kembali</button>

        <h2 className={styles.title}>Data Pengguna</h2>

        <button
          className={styles.addBtn}
          onClick={() => router.push("/admin/tambahPengguna")}
        >
          Tambah +
        </button>
      </div>

      <div style={{ width: '90%', margin: '0 auto 16px auto' }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Cari nama pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 24,
              border: '2px solid #e5e7eb',
              outline: 'none',
              fontSize: 14,
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#5F6F52')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          />
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>No.</span>
          <span>Nama</span>
          <span>Peran</span>
          <span>Aksi</span>
        </div>

        {loading ? (
            <div className="p-4 text-center">Memuat data...</div>
        ) : filteredData.length === 0 ? (
            <div className="p-4 text-center">{searchQuery ? `Tidak ada pengguna dengan nama "${searchQuery}"` : 'Tidak ada data pengguna'}</div>
        ) : filteredData.map((item, index) => (
          <div key={item.id || index}>
            <div className={styles.tableRow}>
              <span>{index + 1}</span>
              <span>{item.name}</span>
              <span>{item.role?.name || "User"}</span>

              <span className={styles.actions}>
                <button 
                  className={`${styles.btn} ${styles.detail}`}
                  onClick={() => router.push(`/admin/editPengguna?id=${item.id}`)}
                >
                  <img src="/images/icon-search.png" alt="detail" />
                </button>

                <button
                  className={`${styles.btn} ${styles.delete}`}
                  onClick={() => setConfirmIndex(index)}
                >
                  <img src="/images/icon-delete.png" alt="delete" />
                </button>
              </span>
            </div>

            {confirmIndex === index && (
              <div className={styles.confirmBox}>
                <span>Hapus “{item.name}”</span>

                <div className={styles.confirmActions}>
                  <button
                    className={styles.btnTidak}
                    onClick={() => setConfirmIndex(null)}
                  >
                    Tidak
                  </button>

                  <button
                    className={styles.btnYa}
                    onClick={() => handleDelete(index)}
                  >
                    Ya
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}