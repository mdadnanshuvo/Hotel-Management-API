import request from 'supertest';
import { app } from '../server'; // Import your Express app
import fs from 'fs-extra';
import multer from 'multer';
import path from 'path';

// Mock fs-extra methods to prevent actual file I/O during testing
jest.mock('fs-extra');

describe('Image Upload Controller', () => {
  let hotelId: string;
  let roomSlug: string;
  let mockHotelData: any;

  beforeAll(() => {
    hotelId = '12345';
    roomSlug = 'room-101';
    mockHotelData = {
      hotelId,
      rooms: [
        {
          roomSlug: roomSlug,
          images: []
        }
      ],
      images: []
    };

    // Mock readJson to return hotel data
    (fs.readJson as jest.Mock).mockResolvedValue(mockHotelData);

    // Mock writeJson to simulate writing data
    (fs.writeJson as jest.Mock).mockResolvedValue(undefined);

    // Mock pathExists to simulate the existence of the hotel data file
    (fs.pathExists as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for uploading images to a hotel
  it('should upload images to a hotel without roomSlug', async () => {
    const imageBuffer = Buffer.from('fake-image-content'); // Simulating a file buffer
    const mockFile = {
      fieldname: 'images',
      originalname: 'hotel-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: imageBuffer,
      size: imageBuffer.length,
      filename: 'hotel-image.jpg',
    };

    // Mock multer storage's behavior of providing a file in req.files
    const response = await request(app)
      .post(`/hotel/${hotelId}/upload`) // Assuming this is the route for uploading images
      .attach('images', mockFile.buffer, 'hotel-image.jpg')
      .set('Content-Type', 'multipart/form-data'); // For multipart/form-data request

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Images uploaded successfully');
    expect(response.body.hotelImages).toContain('/uploads/Hotel-imgs/12345/hotel-image.jpg');
  });

  // Test for uploading images to a room
  it('should upload images to a room in the hotel', async () => {
    const imageBuffer = Buffer.from('fake-image-content'); // Simulating a file buffer
    const mockFile = {
      fieldname: 'images',
      originalname: 'room-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: imageBuffer,
      size: imageBuffer.length,
      filename: 'room-image.jpg',
    };

    // Mock multer storage's behavior of providing a file in req.files
    const response = await request(app)
      .post(`/hotel/${hotelId}/room/${roomSlug}/upload`) // Assuming this is the route for uploading images to rooms
      .attach('images', mockFile.buffer, 'room-image.jpg')
      .set('Content-Type', 'multipart/form-data');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Images uploaded successfully');
    expect(response.body.roomImages).toContain(`/uploads/Room-imgs/12345/${roomSlug}/room-image.jpg`);
  });

  // Test for no files uploaded
  it('should return 400 if no files are uploaded', async () => {
    const response = await request(app)
      .post(`/hotel/${hotelId}/upload`) // Assuming this is the route for uploading images
      .set('Content-Type', 'multipart/form-data'); // Without attaching files

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No files uploaded');
  });

  // Test for non-existent hotel
  it('should return 404 if hotel does not exist', async () => {
    (fs.pathExists as jest.Mock).mockResolvedValueOnce(false); // Simulating hotel not found

    const response = await request(app)
      .post(`/hotel/nonexistentHotel/upload`) // Invalid hotel ID
      .set('Content-Type', 'multipart/form-data');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Hotel not found');
  });

  // Test for non-existent room
  it('should return 404 if room does not exist in the hotel', async () => {
    const nonExistentRoomSlug = 'nonexistentRoom';
    const response = await request(app)
      .post(`/hotel/${hotelId}/room/${nonExistentRoomSlug}/upload`) // Invalid roomSlug
      .set('Content-Type', 'multipart/form-data');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Room not found in this hotel');
  });

  // Test for server errors
  it('should return 500 if there is an error uploading the image', async () => {
    const imageBuffer = Buffer.from('fake-image-content');
    const mockFile = {
      fieldname: 'images',
      originalname: 'hotel-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: imageBuffer,
      size: imageBuffer.length,
      filename: 'hotel-image.jpg',
    };

    // Simulate an error in writing the JSON data
    (fs.writeJson as jest.Mock).mockRejectedValue(new Error('File write failed'));

    const response = await request(app)
      .post(`/hotel/${hotelId}/upload`)
      .attach('images', mockFile.buffer, 'hotel-image.jpg')
      .set('Content-Type', 'multipart/form-data');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Image upload failed');
  });
});
