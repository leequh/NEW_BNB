export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    isSuperhost: boolean;
  };
  amenities: string[];
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Region {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isHost: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  totalPrice: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string; // ISO date string
}
