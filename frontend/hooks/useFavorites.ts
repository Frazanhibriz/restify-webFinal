import { useState } from 'react';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restify_favorites');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  const toggleFavorite = (hotelId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let newFavorites;
    const isFav = favorites.includes(hotelId);
    if (isFav) {
      newFavorites = favorites.filter(id => id !== hotelId);
      toast.success('Hotel dihapus dari daftar favorit.');
    } else {
      newFavorites = [...favorites, hotelId];
      toast.success('Hotel ditambahkan ke daftar favorit!');
    }
    setFavorites(newFavorites);
    localStorage.setItem('restify_favorites', JSON.stringify(newFavorites));
  };

  return { favorites, toggleFavorite };
}
