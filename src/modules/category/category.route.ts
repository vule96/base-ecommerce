import express, { Router } from 'express';
import { validatorMiddleware } from '~/middlewares/validator.middleware';
import { categoryController } from '~/modules/category/category.controller';
import { categoryCreateDTOSchema } from '~/modules/category/category.schema';

const router: Router = express.Router();

export function categoryRoutes(): Router {
  router.post('/', validatorMiddleware(categoryCreateDTOSchema), categoryController.create);
  return router;
}
