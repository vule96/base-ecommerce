import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { attributeValueController } from '~/modules/attribute-value/attribute-value.controller';
import {
  attributeValueCreateDTOSchema,
  attributeValueIdDTOSchema,
  attributeValueUpdateDTOSchema
} from '~/modules/attribute-value/attribute-value.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function attributeValueRoutes(): Router {
  router.get(
    '/:id',
    validatorMiddleware(attributeValueIdDTOSchema, ValidationSource.PARAM),
    attributeValueController.findById
  );
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), attributeValueController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'VariantValue'),
    validatorMiddleware(attributeValueCreateDTOSchema),
    attributeValueController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('create', 'VariantValue'),
    validatorMiddleware(attributeValueIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(attributeValueUpdateDTOSchema),
    attributeValueController.update
  );

  return router;
}
