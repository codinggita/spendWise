import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

let mongo: MongoMemoryServer;
let authToken: string;
let testUser: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  // Create user and get cookie
  const userData = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
  };
  
  const res = await request(app).post('/api/auth/register').send(userData);
  authToken = res.header['set-cookie'];
  testUser = res.body.data.user;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Transaction.deleteMany({});
});

describe('Transaction Integration Tests', () => {
  const sampleTx = {
    rawDescription: 'Swiggy Order',
    amount: 500,
    category: 'Food & Dining',
    type: 'debit',
    date: new Date(),
    source: 'UPI',
    sourceName: 'PhonePe',
    plainLanguage: 'Food order from Swiggy',
  };

  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', authToken)
      .send(sampleTx);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transaction.amount).toBe(500);
  });

  it('should get all transactions for user', async () => {
    await Transaction.create({ ...sampleTx, userId: testUser._id });

    const res = await request(app)
      .get('/api/transactions')
      .set('Cookie', authToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should update a transaction', async () => {
    const tx = await Transaction.create({ ...sampleTx, userId: testUser._id });

    const res = await request(app)
      .patch(`/api/transactions/${tx._id}`)
      .set('Cookie', authToken)
      .send({ notes: 'Updated notes' });

    expect(res.status).toBe(200);
    expect(res.body.data.transaction.notes).toBe('Updated notes');
  });

  it('should delete a transaction', async () => {
    const tx = await Transaction.create({ ...sampleTx, userId: testUser._id });

    const res = await request(app)
      .delete(`/api/transactions/${tx._id}`)
      .set('Cookie', authToken);

    expect(res.status).toBe(200);
    const found = await Transaction.findById(tx._id);
    expect(found).toBeNull();
  });
});
