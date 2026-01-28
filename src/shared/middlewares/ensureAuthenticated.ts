import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

interface TokenPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'flowtask-secret'
    ) as TokenPayload;

    req.user = { id: decoded.sub };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
