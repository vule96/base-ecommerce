import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { orderController } from '~/modules/order/order.controller';
import { orderCreateDTOSchema, orderIdDTOSchema, orderUpdateDTOSchema } from '~/modules/order/order.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function orderRoutes(): Router {
  router.get('/:id', validatorMiddleware(orderIdDTOSchema, ValidationSource.PARAM), orderController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), orderController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Order'),
    validatorMiddleware(orderCreateDTOSchema),
    orderController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'Order'),
    validatorMiddleware(orderIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(orderUpdateDTOSchema),
    orderController.update
  );
  return router;
}
