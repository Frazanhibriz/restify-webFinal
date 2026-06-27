export const getFallbackImage = (id: number | string): string => {
  const images = [
    '/images/HotelImages/Puteri-Gunung-Hotel.jpg',
    '/images/HotelImages/Hotel-Savoy-Homann-Bandung.jpg',
    '/images/HotelImages/Ivory-Hotel-Bandung.jpg',
    '/images/HotelImages/Mutiara-Hotel-and-Convention-Bandung.jpg',
    '/images/HotelImages/Urbanview-Hotel-Grand-Malabar-Bandung.jpg',
    '/images/HotelImages/aryaduta-bandung.jpg',
    '/images/HotelImages/Hilton-Bandung.jpg',
    '/images/HotelImages/Mercure-Bandung-City-Centre.jpg'
  ];
  const numId = typeof id === 'number' ? id : parseInt(id, 10) || 0;
  return images[numId % images.length];
};

export const formatRupiah = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined || price === '') return 'Rp 0,00';
  if (typeof price === 'number') {
    const formatted = price.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rp ${formatted}`;
  }

  let str = price.toString().trim();
  if (!str) return 'Rp 0,00';

  if (str.includes(',') && str.includes('.')) {
    str = str.replace(/\./g, '').replace(/,/g, '.');
  } else if (str.includes(',')) {
    str = str.replace(/,/g, '.');
  }

  const cleanString = str.replace(/[^0-9.-]/g, '');
  const value = parseFloat(cleanString);
  if (isNaN(value)) return 'Rp 0,00';
  
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rp ${formatted}`;
};
