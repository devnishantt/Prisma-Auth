import { User } from "../generated/prisma/client";
import { UserRoles } from "../generated/prisma/enums";
import UserRepository from "../repositories/userRepository";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/common/tokenUtil";
import { ConflictError } from "../utils/errors/error";

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
}
