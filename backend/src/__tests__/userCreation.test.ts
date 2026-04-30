import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '../services/authService';
import { User } from '../models/User';
import AppError from '../utils/AppError';

vi.mock('../models/User', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('User Creation System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a new user with valid inputs', async () => {
    const userData = {
      name: 'Vineet',
      email: 'vineet@example.com',
      password: '1234',
      username: 'vineet',
    };

    (User.findOne as any).mockResolvedValue(null);
    (User.create as any).mockResolvedValue({
      _id: 'mock-id',
      ...userData,
    });

    const result = await registerUser(
      userData.name,
      userData.email,
      userData.password,
      userData.username
    );

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: userData.email }, { username: userData.username }],
    });
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result.username).toBe('vineet');
  });

  it('should throw an error if the email is already registered', async () => {
    (User.findOne as any).mockResolvedValue({ email: 'vineet@example.com' });

    await expect(
      registerUser('Vineet', 'vineet@example.com', '1234', 'vineet')
    ).rejects.toThrow('Email is already registered');
  });

  it('should throw an error if the username is already taken', async () => {
    (User.findOne as any).mockResolvedValue({ username: 'vineet' });

    await expect(
      registerUser('Vineet', 'other@example.com', '1234', 'vineet')
    ).rejects.toThrow('Username is already taken');
  });

  it('should handle database connection failures gracefully', async () => {
    (User.findOne as any).mockRejectedValue(new Error('DB Connection Failed'));

    await expect(
      registerUser('Vineet', 'vineet@example.com', '1234', 'vineet')
    ).rejects.toThrow('DB Connection Failed');
  });
});
