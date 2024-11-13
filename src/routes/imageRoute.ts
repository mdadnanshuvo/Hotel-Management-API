import { Router } from 'express';
import { upload, uploadImages } from '../controllers/imageController';

const router = Router();

// Routes for uploading images
router.post('/hotel/:hotelId/images', upload.array('image', 5), uploadImages); // Hotel images
router.post('/room/:hotelId/:roomSlug/images', upload.array('image', 5), uploadImages); // Room images

export default router;