// src/routes/hotelRoutes.ts
import { Router } from 'express';
import { createHotel, getHotel, updateHotel } from '../controllers/hotelController';

const router = Router();

// Route to create a hotel
router.post('/hotel', createHotel);

// Route to get a hotel by ID
router.get('/hotel/:hotelId', getHotel);

// Route to update a hotel by ID
router.put('/hotel/:hotelId', updateHotel);

export default router;
