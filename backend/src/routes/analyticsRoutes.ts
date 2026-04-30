import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getDashboard, getCategoryBreakdown, getMonthlyTrendHandler,
  getSourceBreakdownHandler, getTopMerchantsHandler,
} from '../controllers/analyticsController';

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/categories', getCategoryBreakdown);
router.get('/monthly-trend', getMonthlyTrendHandler);
router.get('/sources', getSourceBreakdownHandler);
router.get('/top-merchants', getTopMerchantsHandler);

export default router;
