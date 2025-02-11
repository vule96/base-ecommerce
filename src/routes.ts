import { Application } from 'express';
import { authRoutes } from '~/modules/auth/route/auth.route';
import { userRoutes } from '~/modules/user/route/user.route';
import { healthRoutes } from '~/routes/health';

const BASE_PATH = '/api/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH + '/auth', authRoutes());
  app.use(BASE_PATH + '/user', userRoutes());
};

export { appRoutes };
