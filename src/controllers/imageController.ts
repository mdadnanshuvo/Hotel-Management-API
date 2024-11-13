import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const HOTEL_IMG_PATH = './src/uploads/Hotel-imgs';
const ROOM_IMG_PATH = './src/uploads/Room-imgs';
const DATA_PATH = './src/data';

// Ensure directories exist for hotel and room images synchronously
fs.ensureDirSync(HOTEL_IMG_PATH);
fs.ensureDirSync(ROOM_IMG_PATH);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const hotelId = req.params.hotelId;
      const roomSlug = req.params.roomSlug;

      if (hotelId && !roomSlug) {
        const hotelFolderPath = path.join(HOTEL_IMG_PATH, hotelId);
        await fs.ensureDir(hotelFolderPath);
        cb(null, hotelFolderPath);
      } else if (hotelId && roomSlug) {
        const roomFolderPath = path.join(ROOM_IMG_PATH, hotelId, roomSlug);
        await fs.ensureDir(roomFolderPath);
        cb(null, roomFolderPath);
      } else {
        cb(new Error('Invalid route for image upload'), "");
      }
    } catch (error) {
      console.error("Error in destination function:", error);
      cb(null, "");
    }
  },
  filename: (req, file, cb) => {
    const hotelId = req.params.hotelId;
    const roomSlug = req.params.roomSlug;
    const prefix = hotelId ? `${hotelId}-${roomSlug || 'hotel'}-` : '';
    cb(null, `${prefix}${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  const hotelId = req.params.hotelId;
  const roomSlug = req.params.roomSlug;

  console.log('Files received:', files);

  // Check if files were uploaded
  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  try {
    const dataPath = path.join(DATA_PATH, `${hotelId}.json`);
    if (!(await fs.pathExists(dataPath))) {
      res.status(404).json({ message: hotelId ? 'Hotel not found' : 'Room not found' });
      return;
    }

    const entityData = await fs.readJson(dataPath);

    const imagePaths = files.map((file) => {
      return `/uploads/${hotelId ? 'Hotel-imgs' : 'Room-imgs'}/${hotelId}${roomSlug ? `/${roomSlug}` : ''}/${file.filename}`;
    });

    if (hotelId && roomSlug) {
      const room = entityData.rooms?.find((r: any) => r.roomSlug === roomSlug);
      if (!room) {
        res.status(404).json({ message: 'Room not found in this hotel' });
        return;
      }
      room.images = [...(room.images || []), ...imagePaths];
    } else if (hotelId) {
      entityData.images = [...(entityData.images || []), ...imagePaths];
    }

    await fs.writeJson(dataPath, entityData);

    res.status(200).json({
      message: 'Images uploaded successfully',
      ...(roomSlug ? { roomImages: imagePaths } : { hotelImages: imagePaths }),
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};
