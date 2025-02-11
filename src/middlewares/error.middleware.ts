import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isProduction } from '~/utils';
import { AppError, ErrInternalServer, ErrInvalidRequest } from '~/utils/error';
import logger from '~/utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    logger.error(
      `Error: ${error.getStatusCode()} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );
    const appErr = error as AppError;
    response.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));

    return;
  }

  if (error instanceof ZodError) {
    const zErr = error as ZodError;
    const appErr = ErrInvalidRequest.wrap(zErr);
    logger.error(
      `Error: ${appErr.getStatusCode()} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );
    zErr.issues.forEach((issue) => {
      appErr.withDetail(issue.path.join('.'), issue.message);
    });

    response.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  const appErr = ErrInternalServer.wrap(error);
  logger.error(
    `Error: ${appErr.message} - ${request.originalUrl} - ${request.method} - ${request.ip} \n ${error.stack}`
  );
  response.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};
