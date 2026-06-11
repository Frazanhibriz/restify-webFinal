'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiEyeLine, RiEyeOffLine, RiCameraLine } from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';


type ActiveTab = 'profil' | 'logout';

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profil');
  const router = useRouter();


  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePic(user.profile_picture_url || null);
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);
    setIsUploading(true);

    try {
      const res = await api.post('/user/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newPicUrl = res.data.image_url;
      setProfilePic(newPicUrl);
      toast.success("Foto profil berhasil diperbarui!");
      
      
      const profileRes = await api.get('/profile');
      const token = localStorage.getItem("token") || "";
      login(token, profileRes.data.user);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal mengunggah foto profil.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      toast.error("Nama, email, dan nomor telepon tidak boleh kosong.");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      await api.post('/user/update-profile', {
        name: editName,
        email: editEmail,
        phone: editPhone
      });
      toast.success("Profil berhasil diperbarui!");
      
      
      const profileRes = await api.get('/profile');
      const token = localStorage.getItem("token") || "";
      login(token, profileRes.data.user);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }
    
    
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      toast.error("Kata sandi harus mengandung huruf besar, huruf kecil, dan angka.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsChangingPassword(true);
    try {
      
      const forgotRes = await api.post('/forgot-password', { email: user?.email });
      const token = forgotRes.data.token;

      if (!token) {
        throw new Error("Gagal membuat token reset.");
      }

      
      await api.post('/reset-password', {
        email: user?.email,
        token: token,
        password: newPassword,
        password_confirmation: newPasswordConfirm
      });

      toast.success("Kata sandi berhasil diubah!");
      setShowPasswordModal(false);
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error: any) {
      console.error(error);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstErrorMessage = validationErrors[firstErrorKey][0];
        toast.error(firstErrorMessage);
      } else {
        toast.error(error.response?.data?.message || "Gagal mengubah kata sandi.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    notify.auth.logoutSuccess();
    router.push('/login');
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] flex items-center justify-center p-4 py-8 mb-10 overflow-y-auto md:overflow-hidden">

      {}
      <div
        className="absolute inset-0 z-0 opacity-25 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/bg-doodles.jpg')` }}
      />

      {}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden md:overflow-visible h-auto md:h-[560px] relative z-10 border border-gray-50">

        {}
        {}
        {}
        <div className="w-full md:w-[35%] bg-[#FFFDF0] p-8 flex flex-col items-center">
          <div className="mb-4 mt-2">
            <Image src="/images/logo-putih.png" alt="Restify Logo" width={160} height={45} className="object-contain" priority />
          </div>
          <div className="w-full h-px bg-gray-300/60 mb-10 mt-2" />

          <div className="flex flex-col gap-5 w-full px-2">
            <button
              onClick={() => { setActiveTab('profil'); }}
              className={`w-full py-3.5 rounded-full font-bold text-[14px] transition-all shadow-sm
                ${activeTab === 'profil' ? 'bg-[#5E6B52] text-white' : 'bg-[#ACB5A4] text-white hover:bg-[#8f9888]'}`}
            >
              Profil Saya
            </button>

            <button
              onClick={() => setActiveTab('logout')}
              className={`w-full py-3.5 rounded-full font-bold text-[14px] transition-all shadow-sm
                ${activeTab === 'logout' ? 'bg-[#E34A42] text-white' : 'bg-[#F2A299] text-white hover:bg-[#de8478]'}`}
            >
              Logout
            </button>
          </div>
        </div>

        {}
        {}
        {}
        <div className="w-full md:w-[65%] p-8 md:p-10 flex flex-col overflow-y-auto">

          {}
          {activeTab === 'profil' && (
            <form onSubmit={handleUpdateProfile} className="w-full max-w-md mx-auto animate-fade-in pl-0 md:pl-4 flex flex-col justify-center flex-1">
              
              {}
              <div className="flex flex-col items-center mb-6 relative">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 group">
                  {profilePic ? (
                    <img src={profilePic} alt="Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#5E6B52] text-white font-black text-3xl uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-1 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <RiCameraLine className="text-base" />
                    <span>UBAH FOTO</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadPhoto} disabled={isUploading} />
                  </label>
                </div>
                {isUploading && (
                  <span className="text-[10px] text-gray-400 font-bold mt-2 animate-pulse">Mengunggah foto...</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-800 mb-2">Nama</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required
                  className="w-full bg-[#FFFDF0] px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#5E6B52] transition-colors" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-800 mb-2">Email</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required
                  className="w-full bg-[#FFFDF0] px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#5E6B52] transition-colors" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-800 mb-2">Nomor Telepon</label>
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required
                  className="w-full bg-[#FFFDF0] px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#5E6B52] transition-colors" />
              </div>
              <div className="mb-1">
                <label className="block text-xs font-bold text-gray-800 mb-2">Kata Sandi</label>
                <input type="password" value="*************" readOnly
                  className="w-full bg-gray-50 border border-transparent px-4 py-3 rounded-xl text-lg font-medium text-gray-400 outline-none tracking-widest cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-[11px] text-[#5E6B52] font-black hover:underline uppercase tracking-widest"
                >
                  Ganti Password
                </button>
                <button type="submit" disabled={isUpdatingProfile}
                  className="bg-[#5E6B52] text-white px-6 py-2.5 rounded-full text-xs font-black hover:bg-[#4a5440] transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}



          {}
          {activeTab === 'logout' && (
            <div className="w-full h-full flex flex-col items-center justify-center pb-10 animate-fade-in flex-1">
              <h2 className="text-[26px] font-medium mb-12 text-center max-w-[350px] leading-snug">
                Apakah anda yakin ingin keluar?
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('profil')}
                  className="bg-[#ACB5A4] text-white font-medium text-lg px-12 py-2.5 rounded-2xl hover:bg-[#8f9888] transition-colors shadow-sm font-bold uppercase tracking-wider text-sm"
                >
                  Tidak
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#E34A42] text-white font-medium text-lg px-12 py-2.5 rounded-2xl hover:bg-red-700 transition-colors shadow-sm font-bold uppercase tracking-wider text-sm"
                >
                  Iya
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPasswordModal(false)}
        >
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-[24px] p-6 w-full max-w-sm mx-4 shadow-2xl animate-fade-in text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-black text-gray-800 mb-5 uppercase tracking-wide text-center">Ganti Kata Sandi</h4>

            <div className="mb-4 relative">
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 karakter (huruf besar, kecil, angka)"
                  required
                  className="w-full bg-[#FFFDF0] pl-4 pr-12 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-transparent focus:border-[#5E6B52] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <RiEyeOffLine className="text-[16px]" /> : <RiEyeLine className="text-[16px]" />}
                </button>
              </div>
            </div>

            <div className="mb-6 relative">
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wide">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input
                  type={showNewPasswordConfirm ? "text" : "password"}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="Masukkan kembali kata sandi"
                  required
                  className="w-full bg-[#FFFDF0] pl-4 pr-12 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-transparent focus:border-[#5E6B52] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPasswordConfirm ? <RiEyeOffLine className="text-[16px]" /> : <RiEyeLine className="text-[16px]" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex-1 py-2.5 rounded-full bg-[#5E6B52] text-white text-xs font-bold hover:bg-[#4a5440] transition-colors disabled:opacity-50"
              >
                {isChangingPassword ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
