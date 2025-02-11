import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params'
}

export const validatorMiddleware =
  (schema: ZodSchema, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.parse(req[source]);
    if (result) next();
  };
