import { Application } from 'express';
import { healthRoutes } from '~/routes/health';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
};

export { appRoutes };
