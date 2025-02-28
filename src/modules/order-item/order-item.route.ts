import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { orderItemController } from '~/modules/order-item/order-item.controller';
import {
  orderItemCreateDTOSchema,
  orderItemIdDTOSchema,
  orderItemUpdateDTOSchema
} from '~/modules/order-item/order-item.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function orderItemRoutes(): Router {
  router.get('/:id', validatorMiddleware(orderItemIdDTOSchema, ValidationSource.PARAM), orderItemController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), orderItemController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'OrderItem'),
    validatorMiddleware(orderItemCreateDTOSchema),
    orderItemController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'OrderItem'),
    validatorMiddleware(orderItemIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(orderItemUpdateDTOSchema),
    orderItemController.update
  );
  return router;
}
