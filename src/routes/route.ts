import { Router } from 'express';
import { createHotel } from '../controllers/hotelController';

const router = Router();

// POST /hotel - Create a new hotel
router.post('/hotel', createHotel);

// Export the router so it can be used in index.ts
export default router;
