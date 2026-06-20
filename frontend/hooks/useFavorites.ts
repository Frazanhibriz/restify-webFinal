import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch favorites from API when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }
      try {
        const response = await api.get('/user/favorites');
        const hotels = response.data || [];
        const ids = hotels.map((h: any) => h.id);
        setFavorites(ids);
      } catch (error) {
        console.error("Gagal memuat hotel favorit dari server:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (hotelId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast.warning('Silakan masuk terlebih dahulu untuk menambahkan hotel favorit.');
      return;
    }

    // Optimistic UI Update
    const isFav = favorites.includes(hotelId);
    let newFavorites;
    if (isFav) {
      newFavorites = favorites.filter(id => id !== hotelId);
    } else {
      newFavorites = [...favorites, hotelId];
    }
    setFavorites(newFavorites);

    try {
      const response = await api.post('/user/favorites/toggle', { hotel_id: hotelId });
      if (response.data.is_favorite) {
        toast.success('Hotel ditambahkan ke daftar favorit!');
        if (!favorites.includes(hotelId)) {
          setFavorites(prev => [...prev.filter(id => id !== hotelId), hotelId]);
        }
      } else {
        toast.success('Hotel dihapus dari daftar favorit.');
        setFavorites(prev => prev.filter(id => id !== hotelId));
      }
    } catch (error) {
      // Revert optimistic update on failure
      setFavorites(favorites);
      toast.error('Gagal memperbarui status favorit.');
      console.error(error);
    }
  };

  return { favorites, toggleFavorite };
}

