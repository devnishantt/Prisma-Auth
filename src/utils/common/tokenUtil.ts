import { JWT_CONFIG } from "../../config/serverConfig";
import jwt, { Secret } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.JWT_SECRET as Secret, {
    expiresIn: JWT_CONFIG.JWT_EXPIRES_IN as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_CONFIG.JWT_REFRESH_SECRET as Secret, {
    expiresIn: JWT_CONFIG.JWT_REFRESH_EXPIRES_IN as any,
  });
}
