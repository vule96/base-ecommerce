import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { categoryController } from '~/modules/category/category.controller';
import {
  categoryCreateDTOSchema,
  categoryIdDTOSchema,
  categoryUpdateDTOSchema
} from '~/modules/category/category.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function categoryRoutes(): Router {
  router.get('/:id', validatorMiddleware(categoryIdDTOSchema, ValidationSource.PARAM), categoryController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), categoryController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Category'),
    validatorMiddleware(categoryCreateDTOSchema),
    categoryController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'Category'),
    validatorMiddleware(categoryIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(categoryUpdateDTOSchema),
    categoryController.update
  );
  return router;
}
