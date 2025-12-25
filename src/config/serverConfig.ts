export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");
export const DATABASE_URL = process.env.DATABASE_URL;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || "10";
