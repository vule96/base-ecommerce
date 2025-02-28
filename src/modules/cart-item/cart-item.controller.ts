import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { cartItemService } from '~/services/db/cart-item.service';

class CartItemController {
  public create = async (req: Request, res: Response) => {
    logger.info(`CartItemController.create - request received`);
    const cartItem = await cartItemService.create(req.body);

    new OkResponse({
      message: 'Create cart item successfully',
      metadata: cartItem
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`CartItemController.update - request received`);

    const updatedCartItem = await cartItemService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update cart item successfully',
      metadata: updatedCartItem
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`CartItemController.findById - request received`);
    const cartItem = await cartItemService.findById(req.params.id);

    new OkResponse({
      message: 'Find cart item by id successfully',
      metadata: cartItem
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`CartItemController.list - request received`);

    const cartItems = await cartItemService.list(req.paging);

    new PagingResponse({
      message: 'List cart items successfully',
      metadata: cartItems.data,
      paging: cartItems.paging
    }).send(res);
  };
}

export const cartItemController: CartItemController = new CartItemController();
