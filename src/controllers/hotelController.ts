// src/controllers/hotelController.ts

import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { Hotel } from '../models/hotel.model';
const upload = multer({ dest: 'src/uploads/' });
const dataDir = path.join(__dirname, '../data');

// Helper function to save hotel data with ordered fields
const saveHotelData = async (hotel: Hotel) => {
    const filePath = path.join(dataDir, `${hotel.hotelId}.json`);
    const orderedHotel: any = {
        hotelId: hotel.hotelId,
        slug: hotel.slug,
        images: hotel.images, // Array of image filenames
        title: hotel.title,
        description: hotel.description,
        guestCount: hotel.guestCount,
        bedroomCount: hotel.bedroomCount,
        bathroomCount: hotel.bathroomCount,
        amenities: hotel.amenities,
        hostInfo: hotel.hostInfo,
        address: hotel.address,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        rooms: hotel.rooms
    };
    await fs.outputFile(filePath, JSON.stringify(orderedHotel, null, 2));
};



export const createHotel = async (req: Request, res: Response) => {
    const hotelId = uuidv4();
    const slug = slugify(req.body.title, { lower: true });

    // Create a new hotel object
    const newHotel: Hotel = {
        hotelId,
        slug,
        images: [],  // Empty array for images initially
        title: req.body.title,
        description: req.body.description,
        guestCount: req.body.guestCount,
        bedroomCount: req.body.bedroomCount,
        bathroomCount: req.body.bathroomCount,
        amenities: req.body.amenities,
        hostInfo: {
            name: req.body.hostName,
            email: req.body.hostEmail
        },
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        rooms: []  // Empty array for rooms initially
    };

    // Save the hotel data (you may need to modify the saveHotelData function if needed)
    await saveHotelData(newHotel);

    // Respond with the new hotel data
    res.status(201).json(newHotel);
};



// POST /images - Upload images for a specific hotel
export const uploadImages = [
    upload.array('images', 10),  // Allow up to 10 images
    async (req: Request, res: Response) => {
        const hotelId = req.body.hotelId;
        const hotelFilePath = path.join(dataDir, `${hotelId}.json`);

        if (!await fs.pathExists(hotelFilePath)) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const hotel: Hotel = JSON.parse(await fs.readFile(hotelFilePath, 'utf-8'));

        // Ensure each uploaded file is processed
        if (req.files) {
            (req.files as Express.Multer.File[]).forEach(file => {
                const imageUrl = `/uploads/${file.filename}`;  // URL of the uploaded image
                hotel.images.push(imageUrl);  // Push the image URL to the images array
            });

            await saveHotelData(hotel);  // Save hotel data with updated images
            res.status(200).json(hotel);
        } else {
            res.status(400).json({ message: 'No images provided' });
        }
    }
];

// GET /hotel/:hotelId - Get hotel details by ID
export const getHotel = async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId;
    const hotelFilePath = path.join(dataDir, `${hotelId}.json`);

    if (!await fs.pathExists(hotelFilePath)) {
        return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotel: Hotel = JSON.parse(await fs.readFile(hotelFilePath, 'utf-8'));
    res.status(200).json(hotel);
};

// PUT /hotel/:hotelId - Update hotel details
export const updateHotel = async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId;
    const hotelFilePath = path.join(dataDir, `${hotelId}.json`);

    if (!await fs.pathExists(hotelFilePath)) {
        return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotel: Hotel = JSON.parse(await fs.readFile(hotelFilePath, 'utf-8'));

    // Update hotel data
    hotel.title = req.body.title || hotel.title;
    hotel.description = req.body.description || hotel.description;
    hotel.guestCount = req.body.guestCount || hotel.guestCount;
    hotel.bedroomCount = req.body.bedroomCount || hotel.bedroomCount;
    hotel.bathroomCount = req.body.bathroomCount || hotel.bathroomCount;
    hotel.amenities = req.body.amenities || hotel.amenities;
    hotel.hostInfo.name = req.body.hostName || hotel.hostInfo.name;
    hotel.hostInfo.email = req.body.hostEmail || hotel.hostInfo.email;
    hotel.address = req.body.address || hotel.address;
    hotel.latitude = req.body.latitude || hotel.latitude;
    hotel.longitude = req.body.longitude || hotel.longitude;

    await saveHotelData(hotel);  // Save updated hotel data
    res.status(200).json(hotel);
};
