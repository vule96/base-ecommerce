import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { orderService } from '~/services/db/order.service';

class OrderController {
  public create = async (req: Request, res: Response) => {
    logger.info(`OrderController.create - request received`);
    const order = await orderService.create(req.body);

    new OkResponse({
      message: 'Create order successfully',
      metadata: order
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`OrderController.update - request received`);

    const updatedOrder = await orderService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update order successfully',
      metadata: updatedOrder
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`OrderController.findById - request received`);
    const order = await orderService.findById(req.params.id);

    new OkResponse({
      message: 'Find order by id successfully',
      metadata: order
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`OrderController.list - request received`);

    const orders = await orderService.list(req.paging);

    new PagingResponse({
      message: 'List orders successfully',
      metadata: orders.data,
      paging: orders.paging
    }).send(res);
  };
}

export const orderController: OrderController = new OrderController();
