import express, { Router } from 'express';

import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { productController } from '~/modules/product/product.controller';
import { productCreateDTOSchema, productIdDTOSchema, productUpdateDTOSchema } from '~/modules/product/product.schema';

const router: Router = express.Router();

export function productRoutes(): Router {
  router.post('/', validatorMiddleware(productCreateDTOSchema), productController.create);
  router.patch(
    '/:id',
    validatorMiddleware(productIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(productUpdateDTOSchema),
    productController.update
  );
  return router;
}
