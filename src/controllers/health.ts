import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorFactory } from '~/utils/error';

const health = (_req: Request, res: Response): void => {
  throw ErrorFactory.create('NotFound', 'Deliberate error for testing purposes');

  res.status(StatusCodes.OK).send('Server is healthy and OK.');
};

export { health };
