import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Root Endpoint', () => {
  it('should return hello world and api working status', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({
      message: 'hello world',
      status: 'api working',
    });
  });
});
