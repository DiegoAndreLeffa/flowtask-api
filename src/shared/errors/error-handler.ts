import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
