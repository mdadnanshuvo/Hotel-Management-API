// src/controllers/hotelController.ts
import { Request, Response } from 'express';
import fs from 'fs-extra';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../models/hotel.model';
import { Room } from '../models/room.model';

const DATA_PATH = './src/data';

// Create Hotel with initial room details (empty roomImage)
export const createHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, guestCount, bedroomCount, bathroomCount, amenities, hostInfo, address, latitude, longitude, rooms } = req.body;

    const hotelId = uuidv4();
    const slug = slugify(title, { lower: true });

    // Initialize rooms with empty roomImage
    const initialRooms: Room[] = rooms.map((room: Room) => ({
      roomSlug: room.roomSlug,
      roomTitle: room.roomTitle,
      bedroomCount: room.bedroomCount,
      roomImage: "", // Empty initially
    }));

    const newHotel: Hotel = {
      hotelId,
      slug,
      title,
      description,
      guestCount,
      bedroomCount,
      bathroomCount,
      amenities,
      hostInfo,
      address,
      latitude,
      longitude,
      images: [],
      rooms: initialRooms,
    };

    await fs.writeJson(`${DATA_PATH}/${hotelId}.json`, newHotel);
    res.status(201).json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: "Failed to create hotel", error });
  }
};

// Get a hotel by its ID
export const getHotel = async (req: Request, res: Response): Promise<void> => {
  const { hotelId } = req.params;
  try {
    const hotelData = await fs.readJson(`${DATA_PATH}/${hotelId}.json`);
    res.status(200).json(hotelData);
  } catch {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

// Update hotel information
export const updateHotel = async (req: Request, res: Response): Promise<void> => {
  const { hotelId } = req.params;
  try {
    const hotelData: Hotel = await fs.readJson(`${DATA_PATH}/${hotelId}.json`);
    const updatedHotel = { ...hotelData, ...req.body };

    await fs.writeJson(`${DATA_PATH}/${hotelId}.json`, updatedHotel);
    res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
  } catch {
    res.status(404).json({ message: 'Hotel not found' });
  }
};
