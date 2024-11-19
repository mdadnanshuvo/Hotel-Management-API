import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import hotelRoutes from './routes/hotelRoute';
import imageRoutes from './routes/imageRoute';
import path from 'path';

export const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Routes
app.use('/', hotelRoutes);
app.use('/', imageRoutes);

// Start the server only if this file is executed directly (not during testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
