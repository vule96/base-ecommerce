import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isProduction } from '~/utils';
import { AppError, ErrInternalServer, ErrInvalidRequest, PrismaErrorCode, PrismaErrorCodes } from '~/utils/error';
import { firstLetterUppercase } from '~/utils/helpers';
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

  if (error instanceof PrismaClientKnownRequestError) {
    const code: PrismaErrorCode = error.code as PrismaErrorCode;
    const pErr = PrismaErrorCodes[code];
    const appErr = pErr.wrap(error);

    logger.error(
      `Error: ${appErr.getStatusCode()} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`
    );

    if (code === 'P2002' && error.meta && error.meta.target && Array.isArray(error.meta.target)) {
      error.meta.target.map((key: string) => {
        appErr.withDetail(key, `${firstLetterUppercase(key)} is unique`);
      });
    }

    if (code === 'P2003' && error.meta && error.meta.field_name && typeof error.meta.field_name === 'string') {
      appErr.withDetail(error.meta.field_name, `Foreign key constraint violated`);
    }

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
