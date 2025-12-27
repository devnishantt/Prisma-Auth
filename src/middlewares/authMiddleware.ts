import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/common/asyncHandler";
import UserRepository from "../repositories/userRepository";
import { verifyAccessToken } from "../utils/common/tokenUtil";
import { UnauthorizedError } from "../utils/errors/error";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const tokenFromCookie = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;

    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    const token = tokenFromCookie || tokenFromHeader;

    const userRepository = new UserRepository();

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User linked to token not found.");
    }
    if (!user.isActive) {
      throw new UnauthorizedError("User account is deactivated.");
    }

    req.user = user;
    next();
  }
);
