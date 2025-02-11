import express, { Request, Response, Router } from 'express';
import { successResponse } from '~/utils/success';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/health', (_req: Request, res: Response) => {
    successResponse('Server is healthy and OK', res);
  });

  return router;
};

export { healthRoutes };
