import type { Response } from 'express';
import { isProduction } from '~/utils';

export interface IAppError {
  message: string;
  statusCode: number;
  rootCause?: string | Error;
  details: Record<string, string | number | object>;
  logMessage?: string;
  stack?: string;
}

export class AppError extends Error {
  private statusCode: number = 500;
  private rootCause?: Error;
  private details: Record<string, string | number | object> = {};
  private logMessage?: string;
  private stackTrace?: string;

  private constructor(err: Error, options?: ErrorOptions) {
    super(err.message, options);
    this.stackTrace = err.stack;
  }

  // Factory method (Design Pattern)
  static from(err: Error, statusCode: number = 500) {
    const appError = new AppError(err);
    appError.statusCode = statusCode;
    return appError;
  }

  getRootCause(): Error | null {
    if (this.rootCause) {
      return this.rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause;
    }

    return null;
  }

  // Wrapper (Design Pattern)
  wrap(rootCause: Error): AppError {
    const appError = AppError.from(this, this.statusCode);
    appError.rootCause = rootCause;
    return appError;
  }

  // Setter chain
  withDetail(key: string, value: string | number | object): AppError {
    this.details[key] = value;
    return this;
  }

  withLog(logMessage: string): AppError {
    this.logMessage = logMessage;
    return this;
  }

  withMessage(message: string): AppError {
    this.message = message;
    return this;
  }

  toJSON(isProduction: boolean = true) {
    const rootCause = this.getRootCause();

    const errorResponse: IAppError = {
      message: this.message,
      statusCode: this.statusCode,
      details: this.details
    };

    if (!isProduction) {
      errorResponse.rootCause = rootCause ? rootCause.message : this.message;
      errorResponse.logMessage = this.logMessage;
      errorResponse.stack = this.stackTrace;
    }

    return errorResponse;
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

// Util error function
export const responseErr = (err: Error, res: Response) => {
  if (err instanceof AppError) {
    const appErr = err as AppError;
    res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));

    return;
  }

  // if (err instanceof ZodError) {
  //   const zErr = err as ZodError;
  //   const appErr = ErrInvalidRequest.wrap(zErr);

  //   zErr.issues.forEach((issue) => {
  //     appErr.withDetail(issue.path.join('.'), issue.message);
  //   });

  //   res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
  //   return;
  // }

  const appErr = ErrInternalServer.wrap(err);
  res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};

export const ErrInternalServer = AppError.from(new Error('Something went wrong, please try again later'), 500);
export const ErrInvalidRequest = AppError.from(new Error('Invalid request'), 400);
export const ErrUnauthorized = AppError.from(new Error('Unauthorized'), 401);
export const ErrForbidden = AppError.from(new Error('Forbidden'), 403);
export const ErrNotFound = AppError.from(new Error('Not found'), 404);
export const ErrMethodNotAllowed = AppError.from(new Error('Method not allowed'), 405);
