import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { variantController } from '~/modules/variant/variant.controller';
import { variantCreateDTOSchema, variantIdDTOSchema, variantUpdateDTOSchema } from '~/modules/variant/variant.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function variantRoutes(): Router {
  router.get('/:id', validatorMiddleware(variantIdDTOSchema, ValidationSource.PARAM), variantController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), variantController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Variant'),
    validatorMiddleware(variantCreateDTOSchema),
    variantController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'Variant'),
    validatorMiddleware(variantIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(variantUpdateDTOSchema),
    variantController.update
  );

  return router;
}
