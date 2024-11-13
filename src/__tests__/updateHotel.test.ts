import request from 'supertest';
import {app} from '../server'; // Assuming your Express app is exported from server.ts
import fs from 'fs-extra';

jest.mock('fs-extra');

// Mock the readJson and writeJson methods
const readJsonMock = jest.spyOn(fs, 'readJson');
const writeJsonMock = jest.spyOn(fs, 'writeJson');

describe('PUT /hotel/:hotelId - updateHotel', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should update hotel data and return 200 for a valid hotel ID', async () => {
    const hotelId = 'test-hotel-id';
    const existingHotelData = { title: 'Old Title', description: 'Old Description' };
    const updateData = { title: 'Updated Title', description: 'Updated Description' };
    const updatedHotelData = { ...existingHotelData, ...updateData };

    // Mock successful readJson and writeJson operations
    readJsonMock.mockResolvedValueOnce(existingHotelData);
    writeJsonMock.mockResolvedValueOnce(undefined); // `writeJson` typically returns nothing on success

    const response = await request(app)
      .put(`/hotel/${hotelId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Hotel updated successfully',
      hotel: updatedHotelData,
    });

    // Check that readJson and writeJson were called with correct paths
    expect(readJsonMock).toHaveBeenCalledWith(expect.stringContaining(`${hotelId}.json`));
    expect(writeJsonMock).toHaveBeenCalledWith(expect.stringContaining(`${hotelId}.json`), updatedHotelData);
  });

  it('should return 404 if the hotel is not found', async () => {
    const hotelId = 'nonexistent-hotel-id';
    const updateData = { title: 'Updated Title', description: 'Updated Description' };

    // Mock readJson to reject with an error simulating "file not found"
    readJsonMock.mockRejectedValueOnce(new Error('File not found'));

    const response = await request(app)
      .put(`/hotel/${hotelId}`)
      .send(updateData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Hotel not found');
  });
});
