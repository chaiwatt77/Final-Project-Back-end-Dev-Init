import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedUser extends JwtPayload {
  id: string;
}

export const verifyToken = (token: string): DecodedUser | false => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
    if (decoded && typeof decoded !== 'string' && 'id' in decoded) {
      return decoded as DecodedUser;
    }
    return false;
  } catch (err) {
    return false;
  }
};
