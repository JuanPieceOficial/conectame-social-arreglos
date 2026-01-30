import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; email: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Must match the one in index.ts

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; iat: number; exp: number };
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};
