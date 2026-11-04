import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'accessable_jwt_secret_dev_cbe_2026';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
    });
  }
}
