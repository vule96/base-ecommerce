import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface ISuccessResponse {
  message: string | number;
  statusCode: number;
  reasonStatusCode: number;
  metadata: object | string | number;
}

class SuccessResponse {
  message: string | number;
  statusCode: number;
  metadata: object | string | number;

  constructor({ message, statusCode, reasonStatusCode, metadata = {} }: ISuccessResponse) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response) {
    res.status(this.statusCode).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }: Pick<SuccessResponse, 'message' | 'metadata'>) {
    super({ message, statusCode: StatusCodes.OK, reasonStatusCode: StatusCodes.OK, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  options: object;

  constructor({ message, metadata, options }: Pick<SuccessResponse, 'message' | 'metadata'> & { options: object }) {
    super({ message, statusCode: StatusCodes.CREATED, reasonStatusCode: StatusCodes.CREATED, metadata });
    this.options = options;
  }
}

export { CreatedResponse, OkResponse };
