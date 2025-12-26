export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");
export const DATABASE_URL = process.env.DATABASE_URL;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || "10";

export const JWT_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "secret-jwt-key",
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "secret-refresh-key",
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "30d") as string,
};

const convertExpiryToMs = (expiry: string): number => {
  if (expiry.endsWith("d")) {
    return parseInt(expiry) * 24 * 60 * 60 * 1000;
  } else if (expiry.endsWith("hr")) {
    return parseInt(expiry) * 60 * 60 * 1000;
  } else if (expiry.endsWith("m")) {
    return parseInt(expiry) * 60 * 1000;
  }
  return parseInt(expiry);
};

export const COOKIE_CONFIG = {
  maxAge: convertExpiryToMs(JWT_CONFIG.JWT_EXPIRES_IN),
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const REFRESH_COOKIE_CONFIG = {
  maxAge: convertExpiryToMs(JWT_CONFIG.JWT_REFRESH_EXPIRES_IN),
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
};
