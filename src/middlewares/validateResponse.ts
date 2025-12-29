import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors/error";

export function validate(schema: ZodSchema, property: keyof Request = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      const errors = result.error.issues?.map((issue) => ({
        field: issue.path.join(".") || property,
        message: issue.message,
      }));
      throw new ValidationError("Validation failed.", errors);
    }

    (req as any)[property] = result.data;
    next();
  };
}
