import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productVariantController } from '~/modules/product-variant/product-variant.controller';
import {
  productVariantCreateDTOSchema,
  productVariantIdDTOSchema,
  productVariantUpdateDTOSchema
} from '~/modules/product-variant/product-variant.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function productVariantRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(productVariantIdDTOSchema, ValidationSource.PARAM),
    productVariantController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), productVariantController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'ProductVariant'),
    validatorMiddleware(productVariantCreateDTOSchema),
    productVariantController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'ProductVariant'),
    validatorMiddleware(productVariantIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productVariantUpdateDTOSchema),
    productVariantController.update
  );

  return router;
}
