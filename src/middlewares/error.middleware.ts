import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError, type IError } from '~/utils/error';
import logger from '~/utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: IError, request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof CustomError) {
    logger.error(
      `Error: ${error.statusCode} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );
    response.status(error.statusCode).json(error.serializeErrors());
    return;
  }

  logger.error(
    `Error: ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip} \n ${error.stack}`
  );

  response.status(500).json({
    status: 'error',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Internal server error'
  });
};
