import { JwtPayload } from './jwt-payload.interface';

export interface DecodedToken extends JwtPayload {
  iat: number;
  exp: number;
}
