import express, { Request, Response, Router } from 'express';
import { OkResponse } from '~/utils/success';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/health', (_req: Request, res: Response) => {
    new OkResponse({
      message: 'Server is healthy and OK',
      metadata: {}
    }).send(res);
  });

  return router;
};

export { healthRoutes };
