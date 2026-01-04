import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const protectPosyandu = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Validasi token yang diterbitkan Health MS menggunakan Shared JWT_SECRET
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      console.log('[Logistics Auth] Decoded Token:', decoded);

      if (decoded.role !== 'POSYANDU_ADMIN') {
        res.status(403).json({ message: 'Not authorized: Requires POSYANDU_ADMIN role' });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
