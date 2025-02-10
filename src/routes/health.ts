import express, { Router } from 'express';
import { health } from '~/controllers/health';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/health', health);

  return router;
};

export { healthRoutes };
