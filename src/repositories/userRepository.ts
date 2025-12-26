import { User, UserRoles } from "../generated/prisma/client";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors/error";
import BaseRepository from "./baseRepository";
import bcrypt from "bcrypt";

interface SafeUser {
  id: string;
  email: string;
  role: UserRoles;
  phone: string | null;
  firstName: string;
  lastName: string | null;
  isActive: Boolean;
  lastLogin: Date;
}

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super("User");
  }

  async findByEmail(email: string, options: any = {}): Promise<User | null> {
    return await this.findOne({ email }, options);
  }

  async findByEmailAndValidatePassword(
    email: string,
    candidatePassword: string
  ): Promise<SafeUser> {
    try {
      const user = await this.model.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
        },
      });

      if (!user) throw new UnauthorizedError("Invalid email or password");

      const isMatch = await bcrypt.compare(candidatePassword, user.password);
      if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new InternalServerError(
        "A server error occurred during authentication process."
      );
    }
  }

  async validatePasswordById(
    userId: string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = await this.model.findUnique({
      where: { id: userId },
      select: { password: true, id: true },
    });

    if (!user) {
      throw new NotFoundError(`User with ID:${userId} not found.`);
    }
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    if (!isMatch) throw new UnauthorizedError("Current password is incorrect.");

    return true;
  }

  async updateLastLogin(userId: string): Promise<User> {
    return await this.update(userId, { lastLogin: new Date() });
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<User> {
    return await this.update(userId, { refreshToken });
  }
}
