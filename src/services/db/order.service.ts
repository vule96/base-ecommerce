import type { Order } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { OrderCreateDTO, OrderDTO, OrderUpdateDTO } from '~/modules/order/order.schema';
import { OrderStatus } from '~/shared/interface';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';

class OrderService {
  public create = async (data: ToNullProps<OrderCreateDTO>): Promise<Order> => {
    const newId = v7();
    const newOrder: OrderDTO = {
      ...data,
      id: newId,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.order.create({
      data: {
        ...newOrder
      }
    });
  };

  public findById = async <Key extends keyof Order>(
    id: Order['id'],
    keys: Key[] = ['id', 'totalAmount', 'userId', 'status', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const order = (await prisma.order.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Order, Key> | null;

    if (!order) {
      throw ErrNotFound.withLog(`The order with ${id} not found`);
    }
    return order;
  };

  public update = async (id: Order['id'], data: OrderUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data
    });
    return updatedOrder;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Order>> => {
    const count = await prisma.order.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.order.findMany({
      skip,
      take: paging.limit,
      orderBy: { createdAt: 'desc' }
    });

    return {
      data: result,
      paging: {
        page: paging.page,
        limit: paging.limit,
        total: count
      }
    };
  };
}

export const orderService: OrderService = new OrderService();
