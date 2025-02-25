import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { variantOptionController } from '~/modules/variant-option/variant-option.controller';
import {
  variantOptionCreateDTOSchema,
  variantOptionIdDTOSchema,
  variantOptionUpdateDTOSchema
} from '~/modules/variant-option/variant-option.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function variantOptionRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(variantOptionIdDTOSchema, ValidationSource.PARAM),
    variantOptionController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), variantOptionController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'VariantOption'),
    validatorMiddleware(variantOptionCreateDTOSchema),
    variantOptionController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'VariantOption'),
    validatorMiddleware(variantOptionIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(variantOptionUpdateDTOSchema),
    variantOptionController.update
  );

  return router;
}
