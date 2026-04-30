import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Integration Tests', () => {
  const sampleUser = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(sampleUser.email);
    expect(res.header['set-cookie']).toBeDefined();
  });

  it('should not register user with duplicate email', async () => {
    await User.create(sampleUser);
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(sampleUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user', async () => {
    await User.create(sampleUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: sampleUser.email,
        password: sampleUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.header['set-cookie']).toBeDefined();
  });

  it('should get current user profile', async () => {
    const user = await User.create(sampleUser);
    
    // Login to get cookie
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: sampleUser.email, password: sampleUser.password });
    
    const cookie = loginRes.header['set-cookie'];

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(sampleUser.email);
  });

  it('should logout user', async () => {
    // Need to register and then login
    await request(app).post('/api/auth/register').send(sampleUser);
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: sampleUser.email, password: sampleUser.password });
    const cookie = loginRes.header['set-cookie'];

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.header['set-cookie'][0]).toContain('jwt=;');
  });
});
