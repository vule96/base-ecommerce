import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '~/utils';
import { AppError, ErrInternalServer } from '~/utils/error';
import logger from '~/utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    const appErr = error as AppError;
    logger.error(
      `Error: ${error.getStatusCode()} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );
    response.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  const appErr = ErrInternalServer.wrap(error);

  logger.error(
    `Error: ${appErr.message} - ${request.originalUrl} - ${request.method} - ${request.ip} \n ${error.stack}`
  );

  response.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};
