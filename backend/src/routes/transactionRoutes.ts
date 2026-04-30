import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getTransactions, createTransactionHandler, getTransactionByIdHandler,
  updateTransactionHandler, deleteTransactionHandler,
} from '../controllers/transactionController';

const router = Router();

router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransactionHandler);
router.get('/:id', getTransactionByIdHandler);
router.patch('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

export default router;
