import { Request, Response } from "express";
import AuthService from "../services/authService";
import asyncHandler from "../utils/common/asyncHandler";
import { COOKIE_CONFIG, REFRESH_COOKIE_CONFIG } from "../config/serverConfig";
import { sendSuccess } from "../utils/common/response";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body
  );

  res.cookie("accessToken", accessToken, COOKIE_CONFIG);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_CONFIG);

  sendSuccess(res, { user }, "User registered successfully.", 201);
});
