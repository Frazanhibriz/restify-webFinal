

import { toast } from 'sonner';

export const notify = {

    
    auth: {
        
        registerSuccess: () =>
            toast.success('Registrasi berhasil, silakan login'),

        emailExists: () =>
            toast.error('Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.'),

        passwordTooWeak: () =>
            toast.error('Kata sandi terlalu pendek. Gunakan minimal 6 karakter agar lebih aman.'),

        fieldRequired: () =>
            toast.error('Mohon lengkapi semua kolom yang tersedia sebelum melanjutkan.'),

        
        loginSuccessUser: () =>
            toast.success('Login berhasil sebagai User'),

        loginSuccessAdmin: () =>
            toast.success('Login berhasil sebagai Admin'),

        loginSuccessReceptionist: () =>
            toast.success('Login berhasil sebagai Receptionist'),

        
        loginSuccess: (role: 'user' | 'admin' | 'receptionist') => {
            const messages: Record<string, string> = {
                user:         'Login berhasil sebagai User',
                admin:        'Login berhasil sebagai Admin',
                receptionist: 'Login berhasil sebagai Receptionist',
            };
            toast.success(messages[role] ?? 'Login berhasil');
        },

        
        emailNotFound: () =>
            toast.error('Kami tidak dapat menemukan akun dengan email tersebut. Pastikan penulisan sudah benar.'),

        wrongPassword: () =>
            toast.error('Kata sandi yang Anda masukkan tidak sesuai. Silakan coba lagi.'),

        invalidCredentials: () =>
            toast.error('Kredensial yang Anda masukkan salah. Periksa kembali email dan password Anda.'),

        accountInactive: () =>
            toast.error('Akun Anda saat ini sedang dinonaktifkan. Silakan hubungi admin untuk bantuan.'),

        rateLimitExceeded: () =>
            toast.error('Demi keamanan, akses dibatasi sementara karena terlalu banyak percobaan. Coba lagi nanti.'),

        
        accessDenied: () =>
            toast.error('Harap setujui syarat dan ketentuan sebelum melanjutkan.'),

        sessionExpired: () =>
            toast.error('Sesi telah berakhir, silakan login kembali'),
        logoutSuccess: () =>
            toast.success('Anda berhasil keluar dari akun.'),
        resetLinkSent: () =>
            toast.success('Kode reset password telah dikirim ke email Anda.'),
        passwordResetSuccess: () =>
            toast.success('Kata sandi berhasil direset. Silakan login kembali.'),
        passwordMismatch: () =>
            toast.error('Kata sandi dan konfirmasi kata sandi tidak cocok. Silakan periksa kembali.'),

    },

    
    
    hotel: {
        loaded: () =>
            toast.success('Data berhasil dimuat'),

        added: () =>
            toast.success('Hotel berhasil ditambahkan'),

        updated: () =>
            toast.success('Hotel berhasil diupdate'),

        deleted: () =>
            toast.success('Hotel berhasil dihapus'),

        loadFailed: () =>
            toast.error('Gagal memuat data hotel'),

        notFound: () =>
            toast.error('Hotel tidak ditemukan'),

        noResults: () =>
            toast.error('Tidak ditemukan hotel sesuai filter'),
    },

    
    booking: {
        created: () =>
            toast.success('Booking berhasil dibuat'),

        approved: () =>
            toast.success('Booking berhasil disetujui'),

        declined: () =>
            toast.error('Booking ditolak'),

        cancelled: () =>
            toast.error('Booking berhasil dibatalkan'),

        roomUnavailable: () =>
            toast.error('Kamar tidak tersedia pada tanggal tersebut'),

        invalidCheckIn: () =>
            toast.error('Tanggal check-in tidak valid'),
    },

    
    payment: {
        success: () =>
            toast.success('Pembayaran berhasil'),

        failed: () =>
            toast.error('Pembayaran gagal'),

        invalidMethod: () =>
            toast.error('Metode pembayaran tidak valid'),
    },

    
    api: {
        success: (message: string) =>
            toast.success(message),

        badRequest: () =>
            toast.error('Data tidak valid'),

        unauthorized: () =>
            toast.error('Silakan login terlebih dahulu'),

        forbidden: () =>
            toast.error('Akses ditolak'),

        notFound: () =>
            toast.error('Data tidak ditemukan'),

        serverError: () =>
            toast.error('Terjadi kesalahan server'),

        unknown: () =>
            toast.error('Terjadi kesalahan, coba lagi nanti'),

        
        fromStatus: (status: number) => {
            const handlers: Record<number, () => void> = {
                400: () => toast.error('Data tidak valid'),
                401: () => toast.error('Silakan login terlebih dahulu'),
                403: () => toast.error('Akses ditolak'),
                404: () => toast.error('Data tidak ditemukan'),
                429: () => toast.error('Terlalu banyak permintaan, coba lagi nanti'),
                500: () => toast.error('Terjadi kesalahan server'),
            };
            const handler = handlers[status] ?? (() => toast.error('Terjadi kesalahan, coba lagi nanti'));
            handler();
        },
    },

} as const;
