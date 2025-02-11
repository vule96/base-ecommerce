import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const successResponse = (data: unknown, res: Response) => {
  res.status(StatusCodes.OK).json({ data });
};

export { successResponse };
