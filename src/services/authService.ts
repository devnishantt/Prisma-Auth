import { User } from "../generated/prisma/client";
import { UserRoles } from "../generated/prisma/enums";
import UserRepository from "../repositories/userRepository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/common/tokenUtil";
import { ConflictError, UnauthorizedError } from "../utils/errors/error";

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  role?: UserRoles;
}
interface AuthResponse {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}
interface LoginCredentials {
  email: string;
  password: string;
}
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export default class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: UserRegistrationData): Promise<AuthResponse> {
    const { email, password, phone, firstName, lastName, role } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists.");
    }

    const user = await this.userRepository.create({
      email,
      password,
      firstName,
      lastName: lastName || null,
      phone: phone || null,
      role: role || "USER",
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    const { password: _, refreshToken: __, ...userDetails } = user;

    return { user: userDetails, accessToken, refreshToken };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;
    const user = await this.userRepository.findByEmailAndValidatePassword(
      email,
      password
    );

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated.");
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);
    await this.userRepository.updateLastLogin(user.id);

    return { user, accessToken, refreshToken };
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.userRepository.saveRefreshToken(userId, null);

    return { success: true };
  }

  async refreshAccessToken(token: string | undefined): Promise<TokenResponse> {
    if (!token) {
      throw new UnauthorizedError("No refresh token provided.");
    }

    const decoded = verifyRefreshToken(token);

    const user = await this.userRepository.findById(decoded.id);
    if (user.refreshToken !== token) {
      throw new UnauthorizedError("Invalid or revoked refresh token.");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.saveRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async getCurrentUser(userId: string): Promise<Partial<User>> {
    return await this.userRepository.findById(userId, {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        lastLogin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
