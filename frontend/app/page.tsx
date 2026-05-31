"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Landing1.module.css";

export default function Page() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    const timer2 = setTimeout(() => {
      router.push("/landing2");
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.logoWrapper}>
        <img src="/images/Logo.png" alt="Logo" className={styles.logoImage} />
      </div>
    </div>
  );
}