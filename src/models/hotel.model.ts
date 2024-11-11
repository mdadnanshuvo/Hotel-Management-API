import { Room } from "./room";
// src/models/hotel.model.ts

export interface Hotel {
    hotelId: string;
    slug: string;
    images: string[]; // Array of image filenames
    title: string;
    description: string;
    guestCount: number;
    bedroomCount: number;
    bathroomCount: number;
    amenities: string[];
    hostInfo: {
      name: string;
      email: string;
    };
    address: string;
    latitude: number;
    longitude: number;
    rooms: Room[];
     // You can define a Room type if needed
  }
  