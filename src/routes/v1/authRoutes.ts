import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  getCurrentUser,
  login,
  logout,
  refreshToken,
  register,
  updateProfile,
} from "../../controllers/authController";
import { authenticate } from "../../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);

authRouter.post("/logout", authenticate, logout);
authRouter.get("/me", authenticate, getCurrentUser);
authRouter.put("/change-password", authenticate, changePassword);
authRouter.put("/profile", authenticate, updateProfile);
authRouter.delete("/account", authenticate, deleteAccount);

export default authRouter;
