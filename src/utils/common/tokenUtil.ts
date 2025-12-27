import { JWT_CONFIG } from "../../config/serverConfig";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/error";

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

interface DecodedToken extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

function handleAuthError(error: any, tokenType: string): never {
  if (error instanceof UnauthorizedError) throw error;

  if (error instanceof jwt.JsonWebTokenError) {
    throw new UnauthorizedError(`Invalid or malformed ${tokenType} token.`);
  }
  if (error instanceof jwt.TokenExpiredError) {
    throw new UnauthorizedError(`${tokenType} token is expired.`);
  }
  throw new UnauthorizedError(`Error verifying ${tokenType} token.`);
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

export function verifyAccessToken(
  accessToken: string | undefined
): DecodedToken {
  try {
    if (!accessToken) throw new UnauthorizedError("No access token provided.");

    const decoded = jwt.verify(
      accessToken,
      JWT_CONFIG.JWT_SECRET as Secret
    ) as DecodedToken;

    if (!decoded || !decoded.id) {
      throw new UnauthorizedError("Invalid token payload.");
    }

    return decoded;
  } catch (error) {
    handleAuthError(error, "access");
  }
}

export function verifyRefreshToken(
  refreshToken: string | undefined
): DecodedToken {
  try {
    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided.");
    }

    const decoded = jwt.verify(
      refreshToken,
      JWT_CONFIG.JWT_REFRESH_SECRET
    ) as DecodedToken;

    if (!decoded || !decoded.id) {
      throw new UnauthorizedError("Invalid token payload.");
    }

    return decoded;
  } catch (error) {
    handleAuthError(error, "refresh");
  }
}
