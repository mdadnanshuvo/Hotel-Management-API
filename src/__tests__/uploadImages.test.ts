import request from 'supertest';
import { app } from '../server'; // Import your Express app instance
import * as fs from 'fs-extra';

// Mock the fs-extra methods
jest.mock('fs-extra');

const mockHotelData = { hotelId: 'mocked-hotel-id', rooms: [{ roomSlug: 'sample-room' }] };

describe('Image Upload Tests (Mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload hotel images (mocked)', async () => {
    (fs.pathExists as jest.Mock).mockResolvedValue(true);
    (fs.readJson as jest.Mock).mockResolvedValue(mockHotelData);
    (fs.writeJson as jest.Mock).mockResolvedValue(undefined);
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post(`/hotel/${mockHotelData.hotelId}/images`)
      .attach('image', Buffer.from('test content'), 'hotelImage.jpg');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Images uploaded successfully');
  });

  it('should return 404 if hotel not found (mocked)', async () => {
    (fs.pathExists as jest.Mock).mockResolvedValue(false);

    const response = await request(app)
      .post(`/hotel/unknown-hotel-id/images`)
      .attach('image', Buffer.from('test content'), 'hotelImage.jpg');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Hotel not found');
  })


    (fs.pathExists as jest.Mock).mockResolvedValue(true);
    (fs.readJson as jest.Mock).mockResolvedValue(mockHotelData);
    (fs.writeJson as jest.Mock).mockResolvedValue(undefined);
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post(`/room/${mockHotelData.hotelId}/sample-room/images`)
      .attach('image', Buffer.from('test content'), 'roomImage.jpg');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Images uploaded successfully');
  });

  it('should return 404 if room not found (mocked)', async () => {
    (fs.readJson as jest.Mock).mockResolvedValue({ ...mockHotelData, rooms: [] });

    const response = await request(app)
      .post(`/room/${mockHotelData.hotelId}/unknown-room/images`)
      .attach('image', Buffer.from('test content'), 'roomImage.jpg');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Room not found in this hotel');
  });
});
