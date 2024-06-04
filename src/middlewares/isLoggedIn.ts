import { Request, Response, NextFunction } from 'express';
import { getTokenFromHeader } from '../utils/getTokenFromHeader';
import { verifyToken } from '../utils/verifyToken';

interface CustomRequest extends Request {
  userAuthId?: string;
}

export const isLoggedIn = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const token = getTokenFromHeader(req);
  
  if (!token || typeof token !== 'string') {
    return res.status(401).json({
      error: "No Token Found or Invalid Token",
    });
  }

  const decodedUser = verifyToken(token); 

  if (!decodedUser) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    req.userAuthId = decodedUser.id;
    next();
  }
};
