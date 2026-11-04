import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Administrator privileges required.',
    });
  }
  next();
}
