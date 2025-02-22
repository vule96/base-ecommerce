import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productController } from '~/modules/product/product.controller';
import { productCreateDTOSchema, productIdDTOSchema, productUpdateDTOSchema } from '~/modules/product/product.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function productRoutes(): Router {
  router.get('/:id', validatorMiddleware(productIdDTOSchema, ValidationSource.PARAM), productController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), productController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Product'),
    validatorMiddleware(productCreateDTOSchema),
    productController.create
  );
  router.patch(
    '/:id',
    validatorMiddleware(productIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productUpdateDTOSchema),
    productController.update
  );
  return router;
}
