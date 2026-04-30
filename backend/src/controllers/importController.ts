import { Request, Response, NextFunction } from 'express';
import { processCSVImport } from '../services/importService';
import { AppError } from '../utils/AppError';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const importCSV = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError('Not authenticated', 401));
    if (!req.file) return next(new AppError('No CSV file uploaded', 400));
    const result = await processCSVImport(userId, req.file.buffer, req.file.originalname);
    res.status(200).json({
      success: true,
      message: `Import complete: ${result.created} transactions added`,
      data: result,
    });
  } catch (err) { next(err); }
};
