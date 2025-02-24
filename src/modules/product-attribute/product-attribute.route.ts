import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productAttributeController } from '~/modules/product-attribute/product-attribute.controller';
import {
  productAttributeCreateDTOSchema,
  productAttributeIdDTOSchema,
  productAttributeUpdateDTOSchema
} from '~/modules/product-attribute/product-attribute.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function productAttributeRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(productAttributeIdDTOSchema, ValidationSource.PARAM),
    productAttributeController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), productAttributeController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'ProductAttribute'),
    validatorMiddleware(productAttributeCreateDTOSchema),
    productAttributeController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'ProductAttribute'),
    validatorMiddleware(productAttributeIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productAttributeUpdateDTOSchema),
    productAttributeController.update
  );

  return router;
}
