import express from 'express';
import path from 'path';
import hotelRoutes from './routes/route';  // Correctly import the route file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the routes defined in route.ts
app.use(hotelRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Hotel Management API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
