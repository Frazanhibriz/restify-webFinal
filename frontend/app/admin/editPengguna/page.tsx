"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./EditPengguna.module.css";
import api from "@/lib/axios";
import { notify } from "@/lib/notifications";
import { toast } from "sonner";

function EditPenggunaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(2);
  const [hotelId, setHotelId] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!userId) {
        router.push("/admin/dataPengguna");
        return;
    }

    const fetchData = async () => {
      try {
        
        const hotelsRes = await api.get('/hotels?per_page=100');
        setHotels(hotelsRes.data.data || []);

        
        const userRes = await api.get(`/admin/users/${userId}`);
        const user = userRes.data;
        setName(user.name);
        setEmail(user.email);
        setRoleId(user.role_id);
        setHotelId(user.hotel_id || "");
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        notify.api.serverError();
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.warning("Mohon lengkapi semua kolom wajib");
      return;
    }

    if (password && password.length < 6) {
      toast.warning("Kata sandi baru harus minimal 6 karakter");
      return;
    }

    if (roleId === 3 && !hotelId) {
      toast.warning("Resepsionis harus ditetapkan ke salah satu hotel");
      return;
    }

    setIsLoading(true);

    try {
      const data: any = {
        name,
        email,
        role_id: roleId,
        hotel_id: roleId === 3 ? (hotelId || null) : null,
      };

      if (password) {
          data.password = password;
      }

      await api.put(`/admin/users/${userId}`, data);
      notify.api.success("User berhasil diperbarui");
      router.push("/admin/dataPengguna");
    } catch (error: any) {
      console.error("Gagal memperbarui user:", error);
      if (error.response?.data?.message) {
          toast.error(error.response.data.message);
      } else {
          notify.api.serverError();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-20 text-center">Memuat data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/admin/dataPengguna")}>Kembali</button>
        <h2 className={styles.title}>Edit Pengguna</h2>
      </div>

      <form id="edit-user-form" className={styles.formBox} onSubmit={handleSubmit}>
        {}
        <div className={styles.formLeft}>
          <label>Nama</label>
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Email@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Kata Sandi (Kosongkan jika tidak ingin diubah)</label>
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {}
        <div className={styles.formRight}>
          <div className={styles.fasilitasHeader}>
            <h3>Peran</h3>
          </div>

          <div className={styles.fasilitasGrid}>
            <div className={styles.fasilitasCol}>
              <div
                className={`${styles.fasilitasRow} ${
                  roleId === 2 ? styles.active : ""
                }`}
                onClick={() => setRoleId(2)}
              >
                <span>User</span>
                <div
                  className={`${styles.radioUi} ${
                    roleId === 2 ? styles.active : ""
                  }`}
                />
              </div>

              <div
                className={`${styles.fasilitasRow} ${
                  roleId === 3 ? styles.active : ""
                }`}
                onClick={() => setRoleId(3)}
              >
                <span>Resepsionis</span>
                <div
                  className={`${styles.radioUi} ${
                    roleId === 3 ? styles.active : ""
                  }`}
                />
              </div>


            </div>
          </div>

          {roleId === 3 && (
            <div className={styles.tetapkanHotel}>
              <label>Tetapkan Hotel</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white focus:border-[#5B95F9] mt-2"
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                required
              >
                <option value="">Pilih Hotel...</option>
                {hotels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </form>

      <div className={styles.btnWrapper}>
        <button 
            type="submit"
            className={styles.btnTambah} 
            disabled={isLoading}
            form="edit-user-form"
        >
          {isLoading ? "Menyimpan..." : "Simpan Pembaharuan"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Memuat...</div>}>
            <EditPenggunaContent />
        </Suspense>
    );
}