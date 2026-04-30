import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { upload, handleUploadError } from '../middleware/uploadMiddleware';
import { importCSV } from '../controllers/importController';

const router = Router();

router.use(protect);

router.post('/csv', upload.single('file'), handleUploadError, importCSV);

export default router;
