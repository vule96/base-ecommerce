import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productAttributeValueController } from '~/modules/product-attribute-value/product-attribute-value.controller';
import {
  productAttributeValueCreateDTOSchema,
  productAttributeValueIdDTOSchema,
  productAttributeValueUpdateDTOSchema
} from '~/modules/product-attribute-value/product-attribute-value.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function productAttributeValueRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(productAttributeValueIdDTOSchema, ValidationSource.PARAM),
    productAttributeValueController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), productAttributeValueController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'ProductVariantValue'),
    validatorMiddleware(productAttributeValueCreateDTOSchema),
    productAttributeValueController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('create', 'ProductVariantValue'),
    validatorMiddleware(productAttributeValueIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productAttributeValueUpdateDTOSchema),
    productAttributeValueController.update
  );

  return router;
}
