export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerDay: number;
  rating: number;
  imageUrl: string;
  discountPercentage?: number;
}