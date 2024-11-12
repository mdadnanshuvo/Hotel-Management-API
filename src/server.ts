// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import hotelRoutes from './routes/hotelRoute';
import imageRoutes from './routes/imageRoute';

export const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', hotelRoutes);
app.use('/', imageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
