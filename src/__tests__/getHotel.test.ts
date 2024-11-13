import request from 'supertest';
import {app} from '../server'; // Assuming your Express app is exported from app.ts
import fs from 'fs-extra'; // For mocking file system operations


// Mock the fs.readJson method to avoid actually reading files during tests
jest.mock('fs-extra');
const mockReadJson = fs.readJson as jest.Mock;

// Mock fs.readJson function
const readJsonMock = jest.spyOn(fs, 'readJson');

describe('GET /hotel/:hotelId - getHotel', () => {
  it('should return hotel data for a valid hotel ID', async () => {
    const hotelData = { title: 'Test Hotel', description: 'Test Description' };
    
    // Mock successful reading of JSON data
    readJsonMock.mockResolvedValueOnce(hotelData);

    const response = await request(app).get('/hotel/test-hotel-id');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(hotelData);
  });

  it('should return 404 if the hotel is not found', async () => {
    // Mock a rejected promise, simulating a file not found error
    readJsonMock.mockRejectedValueOnce(new Error('File not found'));

    const response = await request(app).get('/hotel/nonexistent-hotel-id');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Hotel not found');
  });
}); 