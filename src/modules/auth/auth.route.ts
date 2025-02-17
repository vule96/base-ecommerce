import express, { Router } from 'express';

import { validatorMiddleware } from '~/middlewares/validator.middleware';
import { authController } from '~/modules/auth/auth.controller';
import { userLoginDTOSchema, userRegistrationDTOSchema } from '~/modules/user/user.schema';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/login', validatorMiddleware(userLoginDTOSchema), authController.login);
  router.post('/register', validatorMiddleware(userRegistrationDTOSchema), authController.register);
  return router;
}
