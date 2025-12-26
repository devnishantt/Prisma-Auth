import prisma from "../config/databaseConfig";
import logger from "../config/loggerConfig";
import { Prisma } from "../generated/prisma/client";
import {
  AppError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/error";

function handlePrismaError(
  error: any,
  modelName: string,
  operation: string
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      throw new NotFoundError(
        `${modelName} required for ${operation} not found.`
      );
    }
    if (error.code === "P2002") {
      const field = error.meta?.target
        ? (error.meta.target as string[]).join(", ")
        : "";

      throw new ConflictError(
        `Conflict: A record with this unique field ${field} already exists.`
      );
    }
    if (error.code === "P2023") {
      throw new NotFoundError(`Invalid ID format supplied for ${modelName}.`);
    }

    logger.error(
      `[Prisma Failure]: Failed ${operation} ${modelName}: ${error.message}`,
      { error }
    );
  }

  throw new InternalServerError(
    `Failed to ${operation} ${modelName} due to server error.`
  );
}

export default class BaseRepository<T = any> {
  protected modelName: string;
  protected model: any;

  constructor(modelName: string) {
    if (!modelName || typeof modelName !== "string") {
      throw new AppError(
        `A valid model name(string) is required for BaseRepository.`
      );
    }
    this.modelName = modelName;
    this.model = (prisma as any)[modelName];

    if (!this.model || typeof this.model.findUnique !== "function") {
      throw new NotFoundError(
        `Model ${modelName} not found or is invalid in Prisma Client.`
      );
    }
  }

  async create(data: any, options: any = {}): Promise<T> {
    try {
      return await this.model.create({ data, ...options });
    } catch (error) {
      handlePrismaError(error, this.modelName, "creation");
    }
  }

  async findById(id: string, options: any = {}): Promise<T> {
    try {
      const record = await this.model.findUnique({ where: { id }, ...options });
      if (!record) {
        throw new NotFoundError(`${this.modelName} with ID:${id} not found.`);
      }
      return record;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      handlePrismaError(error, this.modelName, "fetching");
    }
  }

  async findAll(options: any = {}): Promise<T[]> {
    try {
      return await this.model.findMany({ ...options });
    } catch (error) {
      handlePrismaError(error, this.modelName, "fetching all");
    }
  }

  async findOne(where: any, options: any = {}): Promise<T | null> {
    try {
      console.log("wherrrrrrrrrrrrrrrrrrrrrrr", where)
      return await this.model.findFirst({ where, ...options });
    } catch (error) {
      handlePrismaError(error, this.modelName, "fetching one");
    }
  }

  async findOneOrThrow(
    where: any,
    options: any = {},
    errorMessage: string | null = null
  ): Promise<T> {
    try {
      const response = await this.model.findFirst({ where, ...options });
      if (!response) {
        throw new NotFoundError(errorMessage || `${this.modelName} not found.`);
      }
      return response;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      handlePrismaError(error, this.modelName, "fetching one");
    }
  }

  async update(id: string, data: any, options: any = {}): Promise<T> {
    try {
      return await this.model.update({ where: { id }, data, ...options });
    } catch (error) {
      handlePrismaError(error, this.modelName, "updating");
    }
  }

  async delete(id: string, options: any = {}): Promise<boolean> {
    try {
      await this.model.delete({ where: { id }, ...options });
      return true;
    } catch (error) {
      handlePrismaError(error, this.modelName, "deleting");
    }
  }
}
