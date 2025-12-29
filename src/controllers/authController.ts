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

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.refreshAccessToken(
      req.cookies.refreshToken
    );

    res.cookie("accessToken", accessToken, COOKIE_CONFIG);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_CONFIG);

    sendSuccess(res, { accessToken }, "Token refreshed successfully.", 200);
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user.id);

    sendSuccess(res, { user }, "User retrieved successfully.", 200);
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendSuccess(
      res,
      null,
      "Password changed successfully. Please login again.",
      200
    );
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    sendSuccess(res, user, "Profile updated successfully.", 200);
  }
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.deleteAccount(req.user.id, req.body.password);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendSuccess(res, null, "Account deleted successfully.", 200);
  }
);
