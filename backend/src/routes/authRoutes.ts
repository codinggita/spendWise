import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe, updateProfile, googleAuth, deleteAccountHandler } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.delete('/me', protect, deleteAccountHandler);

export default router;
