import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productVariantOptionController } from '~/modules/product-variant-option/product-variant-option.controller';
import {
  productVariantOptionCreateDTOSchema,
  productVariantOptionIdDTOSchema,
  productVariantOptionUpdateDTOSchema
} from '~/modules/product-variant-option/product-variant-option.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function productVariantOptionRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(productVariantOptionIdDTOSchema, ValidationSource.PARAM),
    productVariantOptionController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), productVariantOptionController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'ProductVariantOption'),
    validatorMiddleware(productVariantOptionCreateDTOSchema),
    productVariantOptionController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'ProductVariantOption'),
    validatorMiddleware(productVariantOptionIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productVariantOptionUpdateDTOSchema),
    productVariantOptionController.update
  );

  return router;
}
