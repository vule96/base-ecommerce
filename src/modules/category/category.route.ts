import express, { Router } from 'express';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { categoryController } from '~/modules/category/category.controller';
import {
  categoryCreateDTOSchema,
  categoryIdDTOSchema,
  categoryUpdateDTOSchema
} from '~/modules/category/category.schema';

const router: Router = express.Router();

export function categoryRoutes(): Router {
  router.get('/:id', validatorMiddleware(categoryIdDTOSchema, ValidationSource.PARAM), categoryController.findById);
  router.post('/', validatorMiddleware(categoryCreateDTOSchema), categoryController.create);
  router.patch(
    '/:id',
    validatorMiddleware(categoryIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(categoryUpdateDTOSchema),
    categoryController.update
  );
  return router;
}
