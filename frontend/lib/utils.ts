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
