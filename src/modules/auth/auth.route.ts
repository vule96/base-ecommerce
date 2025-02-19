import express, { Router } from 'express';

import { auth } from '~/middlewares/auth.middleware';
import { validatorMiddleware } from '~/middlewares/validator.middleware';
import { authController } from '~/modules/auth/auth.controller';
import { userLoginDTOSchema, userRegistrationDTOSchema } from '~/modules/user/user.schema';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/login', validatorMiddleware(userLoginDTOSchema), authController.login);
  router.post('/register', validatorMiddleware(userRegistrationDTOSchema), authController.register);
  router.post('/refresh', authController.refresh);
  router.post('/logout', auth, authController.logout);
  return router;
}
