export class AppError extends Error {
  public statusCode: number;
  public details: any;
  constructor(
    message: string = "Something went wrong!",
    statusCode: number = 500,
    details: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation Failed", details: any = null) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized Access", details: any = null) {
    super(message, 401, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddedError extends AppError {
  constructor(message: string = "Forbidden Access", details: any = null) {
    super(message, 403, details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details: any = null) {
    super(message, 404, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = "Resource already exists",
    details: any = null
  ) {
    super(message, 409, details);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", details: any = null) {
    super(message, 500, details);
    this.name = "NotFoundError";
  }
}
