import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/error";
import logger from "../config/loggerConfig";
import { NODE_ENV } from "../config/serverConfig";
import { sendError } from "../utils/common/response";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (!(err instanceof AppError)) {
    err = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }

  const { message, statusCode, details, name, stack } = err;

  logger.info(`${name || "Error"}: ${message}`, {
    details,
    statusCode,
    stack,
    url: req.originalUrl,
    method: req.method,
  });

  const errDetails =
    NODE_ENV === "development" ? { name, stack, details } : undefined;

  sendError(res, message, statusCode, errDetails);
}
