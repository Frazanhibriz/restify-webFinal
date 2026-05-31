"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./DataPengguna.module.css";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setData(response.data);
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
    } catch (error) {
      console.error("Gagal menghapus pengguna:", error);
      alert("Gagal menghapus pengguna");
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

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>No.</span>
          <span>Nama</span>
          <span>Peran</span>
          <span>Aksi</span>
        </div>

        {loading ? (
            <div className="p-4 text-center">Memuat data...</div>
        ) : data.length === 0 ? (
            <div className="p-4 text-center">Tidak ada data pengguna</div>
        ) : data.map((item, index) => (
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