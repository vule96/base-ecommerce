import express, { Router } from 'express';
import { userController } from '~/modules/user/user.controller';

const router: Router = express.Router();

export function userRoutes(): Router {
  router.get('/:email', userController.getUserByEmail);
  return router;
}
