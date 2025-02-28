import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { orderItemService } from '~/services/db/order-item.service';

class OrderItemController {
  public create = async (req: Request, res: Response) => {
    logger.info(`OrderItemController.create - request received`);
    const orderItem = await orderItemService.create(req.body);

    new OkResponse({
      message: 'Create order item successfully',
      metadata: orderItem
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`OrderItemController.update - request received`);

    const updatedOrderItem = await orderItemService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update order item successfully',
      metadata: updatedOrderItem
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`OrderItemController.findById - request received`);
    const orderItem = await orderItemService.findById(req.params.id);

    new OkResponse({
      message: 'Find order item by id successfully',
      metadata: orderItem
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`OrderItemController.list - request received`);

    const orderItems = await orderItemService.list(req.paging);

    new PagingResponse({
      message: 'List order items successfully',
      metadata: orderItems.data,
      paging: orderItems.paging
    }).send(res);
  };
}

export const orderItemController: OrderItemController = new OrderItemController();
