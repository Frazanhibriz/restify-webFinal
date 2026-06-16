"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./TambahPengguna.module.css";
import api from "@/lib/axios";
import { notify } from "@/lib/notifications";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(2); 
  const [hotelId, setHotelId] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels?per_page=100');
        
        setHotels(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data hotel:", error);
      }
    };
    fetchHotels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.warning("Mohon lengkapi semua kolom wajib");
      return;
    }

    if (password.length < 8) {
      toast.warning("Kata sandi harus minimal 8 karakter");
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      toast.warning("Kata sandi wajib mengandung huruf besar, huruf kecil, dan angka");
      return;
    }

    if (roleId === 3 && !hotelId) {
      toast.warning("Resepsionis harus ditetapkan ke salah satu hotel");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        name,
        email,
        password,
        role_id: roleId,
        hotel_id: roleId === 3 ? (hotelId || null) : null,
      };

      await api.post('/admin/users', data);
      notify.api.success("User berhasil ditambahkan");
      router.push("/admin/dataPengguna");
    } catch (error: any) {
      console.error("Gagal menambahkan user:", error);
      if (error.response?.data?.message) {
          toast.error(error.response.data.message);
      } else {
          notify.api.serverError();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/admin/dataPengguna")}>Kembali</button>
        <h2 className={styles.title}>Tambah Pengguna</h2>
      </div>

      <form id="user-form" className={styles.formBox} onSubmit={handleSubmit}>
        {}
        <div className={styles.formLeft}>
          <label>Nama</label>
          <input
            type="text"
            placeholder="Nama Lengkap"
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

          <label>Kata Sandi</label>
          <input
            type="password"
            placeholder="Password (min 8 karakter, huruf besar/kecil/angka)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          form="user-form"
        >
          {isLoading ? "Memuat..." : "Tambah"}
        </button>
      </div>
    </div>
  );
}