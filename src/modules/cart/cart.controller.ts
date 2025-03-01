import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { cartService } from '~/services/db/cart.service';

class CartController {
  public create = async (req: Request, res: Response) => {
    logger.info(`CartController.create - request received`);
    const cart = await cartService.create(req.body);

    new OkResponse({
      message: 'Create cart successfully',
      metadata: cart
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`CartController.update - request received`);

    const updatedCart = await cartService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update cart successfully',
      metadata: updatedCart
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`CartController.findById - request received`);
    const cart = await cartService.findById(req.params.id);

    new OkResponse({
      message: 'Find cart by id successfully',
      metadata: cart
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`CartController.list - request received`);

    const carts = await cartService.list(req.paging);

    new PagingResponse({
      message: 'List carts successfully',
      metadata: carts.data,
      paging: carts.paging
    }).send(res);
  };

  public add = async (req: Request, res: Response) => {
    logger.info(`CartController.add - request received`);
    const productVariant = await cartService.add(req.body, req.user);

    new OkResponse({
      message: 'Add to cart successfully',
      metadata: productVariant
    }).send(res);
  };
}

export const cartController: CartController = new CartController();
