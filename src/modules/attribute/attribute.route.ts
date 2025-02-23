import express, { Router } from 'express';

import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { attributeController } from '~/modules/attribute/attribute.controller';
import {
  attributeCreateDTOSchema,
  attributeIdDTOSchema,
  attributeUpdateDTOSchema
} from '~/modules/attribute/attribute.schema';

const router: Router = express.Router();

export function attributeRoutes(): Router {
  router.get('/:id', validatorMiddleware(attributeIdDTOSchema, ValidationSource.PARAM), attributeController.findById);
  router.post('/', validatorMiddleware(attributeCreateDTOSchema), attributeController.create);
  router.patch(
    '/:id',
    validatorMiddleware(attributeIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(attributeUpdateDTOSchema),
    attributeController.update
  );

  return router;
}
