import type { OrderItem } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { OrderItemCreateDTO, OrderItemDTO, OrderItemUpdateDTO } from '~/modules/order-item/order-item.schema';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';

class OrderItemService {
  public create = async (data: ToNullProps<OrderItemCreateDTO>): Promise<OrderItem> => {
    const newId = v7();
    const newOrderItem: OrderItemDTO = {
      ...data,
      id: newId
    };

    return prisma.orderItem.create({
      data: {
        ...newOrderItem
      }
    });
  };

  public findById = async <Key extends keyof OrderItem>(
    id: OrderItem['id'],
    keys: Key[] = ['id', 'quantity', 'orderId', 'productVariantId'] as Key[]
  ) => {
    const orderItem = (await prisma.orderItem.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<OrderItem, Key> | null;

    if (!orderItem) {
      throw ErrNotFound.withLog(`The order item with ${id} not found`);
    }
    return orderItem;
  };

  public update = async (id: OrderItem['id'], data: OrderItemUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id },
      data
    });
    return updatedOrderItem;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<OrderItem>> => {
    const count = await prisma.orderItem.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.orderItem.findMany({
      skip,
      take: paging.limit
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

export const orderItemService: OrderItemService = new OrderItemService();
