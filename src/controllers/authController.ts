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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("accessToken", accessToken, COOKIE_CONFIG);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_CONFIG);

  sendSuccess(res, { user }, "LoggedIn successfully.", 200);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendSuccess(res, null, "Logout successful.", 200);
});
