import request from 'supertest';
import {app} from '../server';  // Import your Express app instance
import * as fs from 'fs-extra'; // Import fs-extra to mock its methods
import { v4 as uuidv4 } from 'uuid'; // Import uuid for mocking

// Mock fs-extra and uuid
jest.mock('fs-extra');
jest.mock('uuid');

const mockUuid = 'mocked-uuid';
(uuidv4 as jest.Mock).mockReturnValue(mockUuid);

// Mock data for testing
const mockHotelData = {
  hotelId: mockUuid,
  slug: 'sample-hotel',
  title: 'Sample Hotel',
  description: 'A sample hotel description',
  guestCount: 4,
  bedroomCount: 2,
  bathroomCount: 1,
  amenities: ['WiFi', 'Parking'],
  hostInfo: 'John Doe',
  address: '123 Sample St.',
  latitude: 40.7128,
  longitude: -74.0060,
  images: [],
  rooms: [{ roomSlug: 'sample-room', roomTitle: 'Sample Room', bedroomCount: 1, roomImage: '' }],
};

const DATA_PATH = './src/data';

describe('Hotel Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to prevent leaks between tests
  });

  describe('POST /hotel - createHotel', () => {
    it('should create a hotel successfully', async () => {
      // Mock the writeJson function to resolve
      (fs.writeJson as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/hotel') // Send POST request to create a hotel
        .send({
          title: mockHotelData.title,
          description: mockHotelData.description,
          guestCount: mockHotelData.guestCount,
          bedroomCount: mockHotelData.bedroomCount,
          bathroomCount: mockHotelData.bathroomCount,
          amenities: mockHotelData.amenities,
          hostInfo: mockHotelData.hostInfo,
          address: mockHotelData.address,
          latitude: mockHotelData.latitude,
          longitude: mockHotelData.longitude,
          rooms: mockHotelData.rooms,
        });

      // Assertions for successful hotel creation
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Hotel created successfully');
      expect(response.body.hotel).toEqual(expect.objectContaining({
        title: mockHotelData.title,
        description: mockHotelData.description,
      }));

      // Check that fs.writeJson was called with the correct parameters
      expect(fs.writeJson).toHaveBeenCalledWith(`${DATA_PATH}/${mockUuid}.json`, expect.objectContaining({
        title: mockHotelData.title,
        description: mockHotelData.description,
        guestCount: mockHotelData.guestCount,
      }));
    });

    it('should handle errors when creating a hotel', async () => {
      // Mock fs.writeJson to reject (simulate error)
      (fs.writeJson as jest.Mock).mockRejectedValueOnce(new Error('Failed to write file'));

      const response = await request(app)
        .post('/hotel')
        .send({
          title: mockHotelData.title,
          description: mockHotelData.description,
          guestCount: mockHotelData.guestCount,
          bedroomCount: mockHotelData.bedroomCount,
          bathroomCount: mockHotelData.bathroomCount,
          amenities: mockHotelData.amenities,
          hostInfo: mockHotelData.hostInfo,
          address: mockHotelData.address,
          latitude: mockHotelData.latitude,
          longitude: mockHotelData.longitude,
          rooms: mockHotelData.rooms,
        });

      // Assertions for failure scenario
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to create hotel');
      expect(response.body.error.message).toBe('Failed to write file');
    });
  });

  describe('GET /hotel/:hotelId - getHotel', () => {
    it('should retrieve a hotel successfully', async () => {
      // Mock fs.readJson to return mock hotel data
      (fs.readJson as jest.Mock).mockResolvedValueOnce(mockHotelData);

      const response = await request(app).get(`/hotel/${mockUuid}`);

      // Assertions for successful hotel retrieval
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockHotelData);
      expect(fs.readJson).toHaveBeenCalledWith(`${DATA_PATH}/${mockUuid}.json`);
    });

    it('should return 404 if hotel not found', async () => {
      // Mock fs.readJson to reject when hotel is not found
      (fs.readJson as jest.Mock).mockRejectedValueOnce(new Error('Hotel not found'));

      const response = await request(app).get(`/hotel/unknown-id`);

      // Assertions for not found scenario
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Hotel not found');
      expect(fs.readJson).toHaveBeenCalledWith(`${DATA_PATH}/unknown-id.json`);
    });
  });

  describe('PUT /hotel/:hotelId - updateHotel', () => {
    it('should update a hotel successfully', async () => {
      const updatedData = { title: 'Updated Sample Hotel' };
      const updatedHotelData = { ...mockHotelData, ...updatedData };

      // Mock the read and write functions for fs
      (fs.readJson as jest.Mock).mockResolvedValueOnce(mockHotelData);
      (fs.writeJson as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app).put(`/hotel/${mockUuid}`).send(updatedData);

      // Assertions for successful hotel update
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Hotel updated successfully');
      expect(response.body.hotel).toEqual(updatedHotelData);
      expect(fs.readJson).toHaveBeenCalledWith(`${DATA_PATH}/${mockUuid}.json`);
      expect(fs.writeJson).toHaveBeenCalledWith(`${DATA_PATH}/${mockUuid}.json`, updatedHotelData);
    });

    it('should return 404 if hotel to update is not found', async () => {
      // Mock fs.readJson to reject when hotel is not found
      (fs.readJson as jest.Mock).mockRejectedValueOnce(new Error('Hotel not found'));

      const response = await request(app).put(`/hotel/unknown-id`).send({ title: 'New Title' });

      // Assertions for not found scenario
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Hotel not found');
      expect(fs.readJson).toHaveBeenCalledWith(`${DATA_PATH}/unknown-id.json`);
    });
  });
});
