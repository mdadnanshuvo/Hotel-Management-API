// // src/controllers/imageController.ts
// import { Request, Response } from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs-extra';

// const HOTEL_IMG_PATH = './src/uploads/Hotel-imgs';
// const ROOM_IMG_PATH = './src/uploads/Room-imgs';
// const DATA_PATH = './src/data';

// // Create folders if they don’t exist
// fs.ensureDirSync(HOTEL_IMG_PATH);
// fs.ensureDirSync(ROOM_IMG_PATH);

// // Configure storage for multer with dynamic destination and filename
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.originalUrl.includes('/hotel/')) {
//       cb(null, HOTEL_IMG_PATH);
//     } else if (req.originalUrl.includes('/room/')) {
//       cb(null, ROOM_IMG_PATH);
//     } else {
//       cb(new Error('Invalid route for image upload') as any, "");
//     }
//   },
//   filename: (req, file, cb) => {
//     const prefix = req.originalUrl.includes('/hotel/')
//       ? `${req.params.hotelId}-`
//       : `${req.params.roomSlug}-`;
//     cb(null, `${prefix}${Date.now()}-${file.originalname}`);
//   }
// });

// export const upload = multer({ storage });

// // Unified image upload controller for both hotels and rooms
// export const uploadImages = async (req: Request, res: Response): Promise<void> => {
//   const files = req.files as Express.Multer.File[];
//   const hotelId = req.params.hotelId;
//   const roomSlug = req.params.roomSlug;

//   console.log('Files received:', files);

//   // Check if files are uploaded
//   if (!files || files.length === 0) {
//     res.status(400).json({ message: 'No files uploaded' });
//     return;
//   }

//   try {
//     // Determine which data file to update based on route
//     const dataPath = hotelId 
//       ? path.join(DATA_PATH, `${hotelId}.json`) 
//       : path.join(DATA_PATH, `${roomSlug}.json`);

//     if (!await fs.pathExists(dataPath)) {
//       res.status(404).json({ message: hotelId ? 'Hotel not found' : 'Room not found' });
//       return;
//     }

//     // Load data for the corresponding hotel or room
//     const entityData = await fs.readJson(dataPath);

//     // Store image paths
//     files.forEach(file => {
//       const imagePath = `/uploads/${hotelId ? 'Hotel-imgs' : 'Room-imgs'}/${file.filename}`;
//       if (hotelId) {
//         entityData.images = entityData.images || [];
//         entityData.images.push(imagePath);
//       } else {
//         entityData.roomImage = imagePath;
//       }
//     });

//     // Save updated data back to file
//     await fs.writeJson(dataPath, entityData);

//     res.status(200).json({
//       message: 'Images uploaded successfully',
//       images: files.map(file => `/uploads/${hotelId ? 'Hotel-imgs' : 'Room-imgs'}/${file.filename}`)
//     });

//   } catch (error) {
//     console.error('Error uploading images:', error);
//     res.status(500).json({ message: 'Image upload failed', error });
//   }
// };


import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const UPLOAD_PATH = './src/uploads';
const DATA_PATH = './src/data';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const hotelId = req.params.hotelId;
    const roomSlug = req.params.roomSlug;

    // Folder path based on presence of roomSlug
    const folderPath = roomSlug
      ? path.join(UPLOAD_PATH, 'Room-imgs', hotelId, roomSlug)
      : path.join(UPLOAD_PATH, 'Hotel-imgs', hotelId);

    fs.ensureDir(folderPath) // Ensure the directory exists
      .then(() => cb(null, folderPath))
      .catch(err => cb(err, folderPath));
  },
  filename: (req, file, cb) => {
    const prefix = req.params.hotelId || req.params.roomSlug;
    cb(null, `${prefix}-${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  const hotelId = req.params.hotelId;
  const roomSlug = req.params.roomSlug;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  try {
    const hotelDataPath = path.join(DATA_PATH, `${hotelId}.json`);

    if (!await fs.pathExists(hotelDataPath)) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    const hotelData = await fs.readJson(hotelDataPath);

    if (roomSlug) {
      // Find room within the specific hotel
      const room = hotelData.rooms?.find((r: any) => r.roomSlug === roomSlug);

      if (!room) {
        res.status(404).json({ message: 'Room not found in this hotel' });
        return;
      }

      room.images = room.images || []; // Initialize if it doesn't exist
      files.forEach(file => room.images.push(`/uploads/Room-imgs/${hotelId}/${roomSlug}/${file.filename}`));

    } else {
      // Add images to hotel images if no roomSlug provided
      hotelData.images = hotelData.images || [];
      files.forEach(file => hotelData.images.push(`/uploads/Hotel-imgs/${hotelId}/${file.filename}`));
    }

    await fs.writeJson(hotelDataPath, hotelData);

    res.status(200).json({
      message: 'Images uploaded successfully',
      hotelImages: hotelData.images,
      roomImages: roomSlug ? hotelData.rooms.find((r: any) => r.roomSlug === roomSlug)?.images : undefined,
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
