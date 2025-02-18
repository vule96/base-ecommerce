import express, { Router } from 'express';

import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { userController } from '~/modules/user/user.controller';
import { userIdDTOSchema } from '~/modules/user/user.schema';

const router: Router = express.Router();

export function userRoutes(): Router {
  router.get('/profile', auth, userController.profile);
  router.get('/:id', validatorMiddleware(userIdDTOSchema, ValidationSource.PARAM), userController.findById);

  return router;
}
