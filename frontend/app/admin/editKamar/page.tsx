"use client";

import { useState } from "react";
import styles from "./EditKamar.module.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [bedroom, setBedroom] = useState(1);
  const [bathroom, setBathroom] = useState(1);
  const [harga, setHarga] = useState("");

  const [fasilitas, setFasilitas] = useState({
    sarapan: false,
    makanSiang: false,
    makanMalam: false,
    ekstraBed: false,
    tv: false,
    ac: false,
    wifi: false,
  });

  const toggleFasilitas = (key: keyof typeof fasilitas) => {
    setFasilitas({
      ...fasilitas,
      [key]: !fasilitas[key],
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img src="/images/Restify landscape.png" alt="logo" />
      </div>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/admin/daftarDataKamar")}>Kembali</button>
        <h2 className={styles.title}>“Nama Hotel”</h2>
      </div>

      <div className={styles.table}>
        Ubah Data Kamar Hotel
      </div>

      <div className={styles.formBox}>
        {}
        <div className={styles.formLeft}>
          <label>Tipe kamar</label>
          <input type="text" placeholder="Tipe kamar" />

          <label>Harga per malam</label>
          <input
            type="text"
            placeholder="Rp 0"
            value={harga ? "Rp " + Number(harga).toLocaleString("id-ID") : ""}
            onChange={(e) => {
              const angkaOnly = e.target.value.replace(/\D/g, "");
              setHarga(angkaOnly);
            }}
          />

          <label>Ukuran kamar</label>
          <input type="text" placeholder="Ukuran kamar" />

          <div className={styles.counterBox}>
            <span>Kamar Tidur</span>
            <div className={styles.counterControl}>
              <button
                className={styles.minus}
                onClick={() => setBedroom(Math.max(0, bedroom - 1))}
              >
                -
              </button>
              <span>{bedroom}</span>
              <button
                className={styles.plus}
                onClick={() => setBedroom(bedroom + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.counterBox}>
            <span>Kamar Mandi</span>
            <div className={styles.counterControl}>
              <button
                className={styles.minus}
                onClick={() => setBathroom(Math.max(0, bathroom - 1))}
              >
                -
              </button>
              <span>{bathroom}</span>
              <button
                className={styles.plus}
                onClick={() => setBathroom(bathroom + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {}
        <div className={styles.formRight}>
          <label>Deskripsi</label>
          <textarea placeholder="Deskripsi Hotel" />

          <div className={styles.fasilitasHeader}>
            <h3>Fasilitas</h3>
          </div>

          <div className={styles.fasilitasGrid2col}>
            <div className={styles.fasilitasCol}>
              {["sarapan", "makanSiang", "makanMalam"].map((key) => (
                <div
                  key={key}
                  className={styles.fasilitasRow}
                  onClick={() => toggleFasilitas(key as any)}
                >
                  <span>{key}</span>
                  <div
                    className={`${styles.radioUi} ${
                      fasilitas[key as keyof typeof fasilitas]
                        ? styles.active
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className={styles.fasilitasCol}>
              {["ekstraBed", "tv", "ac", "wifi"].map((key) => (
                <div
                  key={key}
                  className={styles.fasilitasRow}
                  onClick={() => toggleFasilitas(key as any)}
                >
                  <span>{key}</span>
                  <div
                    className={`${styles.radioUi} ${
                      fasilitas[key as keyof typeof fasilitas]
                        ? styles.active
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <button className={styles.btnSimpan}>Simpan Pembaruan</button>
      </div>
    </div>
  );
}