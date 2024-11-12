// src/models/hotel.model.ts
import { Room } from './room.model';

export interface Hotel {
  hotelId: string;
  slug: string;
  title: string;
  description: string;
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  hostInfo: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  rooms: Room[];
}
