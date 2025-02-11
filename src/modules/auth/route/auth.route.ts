import express, { Router } from 'express';
import { authController } from '~/modules/auth/controller/auth.controller';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/login', authController.login);
  router.post('/register', authController.register);
  return router;
}
