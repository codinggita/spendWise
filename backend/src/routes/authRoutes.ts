import { Router } from 'express';
import { register, login, logout, getMe, updateProfile, googleAuth, deleteAccountHandler } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.delete('/me', protect, deleteAccountHandler);

export default router;
