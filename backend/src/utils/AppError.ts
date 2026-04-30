export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = `${statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'}`;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export default AppError;
