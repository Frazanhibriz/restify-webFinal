"use client";

import { useState } from "react";
import styles from "./DaftarDataKamar.module.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [rooms, setRooms] = useState([
    { type: "Standard Room", available: 11 },
    { type: "Superior Room", available: 5 },
    { type: "Deluxe Room", available: 7 },
    { type: "Suite Room", available: 2 },
  ]);

  const handleIncrement = (index: number) => {
    const updated = [...rooms];
    updated[index].available += 1;
    setRooms(updated);
  };

  const handleDecrement = (index: number) => {
    const updated = [...rooms];
    if (updated[index].available > 0) {
      updated[index].available -= 1;
      setRooms(updated);
    }
  };

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/admin/hotels")}>Kembali</button>
        <h2 className={styles.title}>“Nama Hotel”</h2>
        <button
          className={styles.addBtn}
          onClick={() => router.push("/admin/tambahKamar")}
        >
          Tambah +
        </button>
      </div>

      <h3 className={styles.subtitle}>Data Kamar</h3>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Tipe Kamar</span>
          <span>Kamar Tersedia</span>
          <span>Perbarui Manual</span>
        </div>

        {rooms.map((room, index) => (
          <div className={styles.tableRow} key={index}>
            <span>{room.type}</span>
            <span>{room.available}</span>

            <span className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.plus}`}
                onClick={() => handleIncrement(index)}
              >
                +
              </button>

              <button
                className={`${styles.btn} ${styles.minus}`}
                onClick={() => handleDecrement(index)}
              >
                −
              </button>

              <button className={`${styles.btn} ${styles.detail}`} onClick={() => router.push("/admin/editKamar")}>
                <img src="/images/icon-search.png" alt="detail" />
              </button>

              <button
                className={`${styles.btn} ${styles.delete}`}
                onClick={() => setConfirmIndex(index)}
              >
                <img src="/images/icon-delete.png" alt="delete" />
              </button>
            </span>

            {confirmIndex === index && (
              <div className={styles.confirmBox}>
                <span>Hapus “{room.type}”</span>

                <div className={styles.confirmActions}>
                  <button
                    className={styles.btnTidak}
                    onClick={() => setConfirmIndex(null)}
                  >
                    Tidak
                  </button>

                  <button
                    className={styles.btnYa}
                    onClick={() => {
                      const newData = rooms.filter((_, i) => i !== index);
                      setRooms(newData);
                      setConfirmIndex(null);
                    }}
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