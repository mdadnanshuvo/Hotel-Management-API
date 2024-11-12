import request from 'supertest';
import { app } from '../server'; // Import your Express app
import fs from 'fs-extra';
import { sampleHotelData } from './testData';

jest.mock('fs-extra'); // Mock fs-extra to prevent actual file I/O

describe('Hotel Controller', () => {
  let hotelId: string;

  beforeAll(() => {
    hotelId = '12345';
  });

  // Test for createHotel
  it('should create a new hotel', async () => {
    (fs.writeJson as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/hotel')
      .send(sampleHotelData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Hotel created successfully");
    expect(response.body.hotel).toHaveProperty('hotelId');
    expect(fs.writeJson).toHaveBeenCalled();
  });

  // Test for getHotel with a valid hotel ID
  it('should retrieve hotel data by ID', async () => {
    (fs.readJson as jest.Mock).mockResolvedValueOnce({
      hotelId,
      ...sampleHotelData,
    });

    const response = await request(app).get(`/hotel/${hotelId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hotelId", hotelId);
    expect(response.body.title).toBe(sampleHotelData.title);
  });

  // Test for updateHotel with a valid hotel ID
  it('should update the hotel data', async () => {
    const updatedData = { description: "Updated description for the hotel." };

    (fs.readJson as jest.Mock).mockResolvedValueOnce({
      hotelId,
      ...sampleHotelData,
    });
    (fs.writeJson as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .put(`/hotel/${hotelId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hotel updated successfully");
    expect(response.body.hotel.description).toBe(updatedData.description);
  });

  // Test for getHotel with a non-existent hotel ID
  it('should return 404 for a non-existent hotel', async () => {
    (fs.readJson as jest.Mock).mockRejectedValueOnce(new Error("File not found"));

    const response = await request(app).get(`/hotel/nonexistent`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Hotel not found");
  });
});
