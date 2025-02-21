import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { PagingDTOResponse } from '~/shared/model';

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
    this.message = message || reasonStatusCode;
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

class PagingResponse extends SuccessResponse {
  paging: PagingDTOResponse;

  constructor({
    message,
    metadata,
    paging
  }: Pick<SuccessResponse, 'message' | 'metadata'> & { paging: PagingDTOResponse }) {
    super({ message, statusCode: StatusCodes.OK, reasonStatusCode: StatusCodes.CREATED, metadata });
    this.paging = paging;
  }
}

export { OkResponse, PagingResponse };
