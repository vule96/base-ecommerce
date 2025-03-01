import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { cartController } from '~/modules/cart/cart.controller';
import {
  cartAddItemDTOSchema,
  cartCreateDTOSchema,
  cartIdDTOSchema,
  cartUpdateDTOSchema
} from '~/modules/cart/cart.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function cartRoutes(): Router {
  router.get('/:id', validatorMiddleware(cartIdDTOSchema, ValidationSource.PARAM), cartController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), cartController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'Cart'),
    validatorMiddleware(cartCreateDTOSchema),
    cartController.create
  );
  router.post(
    '/add',
    auth,
    checkPermission('create', 'CartItem'),
    validatorMiddleware(cartAddItemDTOSchema),
    cartController.add
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'Cart'),
    validatorMiddleware(cartIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(cartUpdateDTOSchema),
    cartController.update
  );
  return router;
}
