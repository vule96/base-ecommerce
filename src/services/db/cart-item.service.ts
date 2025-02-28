import type { CartItem } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { CartItemCreateDTO, CartItemDTO, CartItemUpdateDTO } from '~/modules/cart-item/cart-item.schema';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';

class CartItemService {
  public create = async (data: ToNullProps<CartItemCreateDTO>): Promise<CartItem> => {
    const newId = v7();
    const newCartItem: CartItemDTO = {
      ...data,
      id: newId
    };

    return prisma.cartItem.create({
      data: {
        ...newCartItem
      }
    });
  };

  public findById = async <Key extends keyof CartItem>(
    id: CartItem['id'],
    keys: Key[] = ['id', 'quantity', 'cartId', 'productVariantId'] as Key[]
  ) => {
    const cartItem = (await prisma.cartItem.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<CartItem, Key> | null;

    if (!cartItem) {
      throw ErrNotFound.withLog(`The cart item with ${id} not found`);
    }
    return cartItem;
  };

  public update = async (id: CartItem['id'], data: CartItemUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data
    });
    return updatedCartItem;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<CartItem>> => {
    const count = await prisma.cartItem.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.cartItem.findMany({
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

export const cartItemService: CartItemService = new CartItemService();
