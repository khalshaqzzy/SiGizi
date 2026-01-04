import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const protectLogistics = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Stateless Verification:
      // We only verify the signature using the Shared Secret.
      // We DO NOT check the database because Logistics Users do not exist in the Health DB.
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      if (decoded.role !== 'LOGISTICS_ADMIN') {
        res.status(403).json({ message: 'Not authorized: Requires LOGISTICS_ADMIN role' });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
