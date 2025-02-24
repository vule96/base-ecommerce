import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { attributeController } from '~/modules/attribute/attribute.controller';
import {
  attributeCreateDTOSchema,
  attributeIdDTOSchema,
  attributeUpdateDTOSchema
} from '~/modules/attribute/attribute.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function attributeRoutes(): Router {
  router.get('/:id', validatorMiddleware(attributeIdDTOSchema, ValidationSource.PARAM), attributeController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), attributeController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Attribute'),
    validatorMiddleware(attributeCreateDTOSchema),
    attributeController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'Attribute'),
    validatorMiddleware(attributeIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(attributeUpdateDTOSchema),
    attributeController.update
  );

  return router;
}
