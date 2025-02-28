import express, { Router } from 'express';

import { checkPermission } from '~/middlewares/ability.middleware';
import { auth } from '~/middlewares/auth.middleware';
import { ValidationSource, validatorMiddleware } from '~/middlewares/validator.middleware';
import { cartItemController } from '~/modules/cart-item/cart-item.controller';
import {
  cartItemCreateDTOSchema,
  cartItemIdDTOSchema,
  cartItemUpdateDTOSchema
} from '~/modules/cart-item/cart-item.schema';
import { pagingDTOSchema } from '~/shared/model';

const router: Router = express.Router();

export function cartItemRoutes(): Router {
  router.get('/:id', validatorMiddleware(cartItemIdDTOSchema, ValidationSource.PARAM), cartItemController.findById);
  router.get('/', validatorMiddleware(pagingDTOSchema, ValidationSource.QUERY), cartItemController.list);
  router.post(
    '/',
    auth,
    checkPermission('create', 'CartItem'),
    validatorMiddleware(cartItemCreateDTOSchema),
    cartItemController.create
  );
  router.patch(
    '/:id',
    auth,
    checkPermission('update', 'CartItem'),
    validatorMiddleware(cartItemIdDTOSchema, ValidationSource.PARAM),
    validatorMiddleware(cartItemUpdateDTOSchema),
    cartItemController.update
  );
  return router;
}
