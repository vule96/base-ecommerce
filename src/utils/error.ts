import { StatusCodes } from 'http-status-codes';
import { config } from '~/config';

export interface IError {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}

export abstract class CustomError extends Error {
  abstract status: string;
  abstract statusCode: number;
  stack?: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (config.NODE_ENV === 'development') {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }
    }
  }

  serializeErrors(): IError {
    const error: IError = {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
    if (config.NODE_ENV === 'development') {
      error.stack = this.stack;
    }
    return error;
  }
}

export type ErrorType = 'BadRequest' | 'NotFound' | 'Internal';

// Factory Method
export class ErrorFactory {
  static create(type: ErrorType, message: string): CustomError {
    switch (type) {
      case 'BadRequest':
        return new BadRequestException(message);
      case 'NotFound':
        return new NotFoundException(message);
      default:
        return new InternalException(message);
    }
  }
}

export class BadRequestException extends CustomError {
  status: string = 'error';
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class InternalException extends CustomError {
  status: string = 'error';
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}
