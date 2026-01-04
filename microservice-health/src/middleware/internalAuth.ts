import { Request, Response, NextFunction } from 'express';

export const protectInternal = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  const sharedSecret = process.env.SHARED_SECRET || 'internal_secret_123';

  if (apiKey && apiKey === sharedSecret) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized: Invalid API Key' });
  }
};