"use client";

import { useRouter } from "next/navigation";
import styles from "./Welcome.module.css";

export default function welcome() {
  const router = useRouter();

  return (
    <div className={styles.container}>
        <div className={styles.card}>
            <h1 className={styles.title}> Selamat Datang!</h1>

            <button
            onClick={() => router.push("/login")}
            className={styles.loginBtn}
            >
                Login
            </button>

            <button
            onClick={() => router.push("/register")}
            className={styles.registerBtn}
            >
                Register
            </button>
        </div>
    </div>
    
    
    

    
    
    
    
    
    

    
    
    
    
    
    
    
    
  );
}
