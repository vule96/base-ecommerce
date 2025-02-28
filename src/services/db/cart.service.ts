import type { Cart } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { CartCreateDTO, CartDTO, CartUpdateDTO } from '~/modules/cart/cart.schema';
import type { ToNullProps } from '~/shared/interface/utility';
import { Paginated, PagingDTO } from '~/shared/model';

class CartService {
  public create = async (data: ToNullProps<CartCreateDTO>): Promise<Cart> => {
    const newId = v7();
    const newCart: CartDTO = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.cart.create({
      data: {
        ...newCart
      }
    });
  };

  public findById = async <Key extends keyof Cart>(
    id: Cart['id'],
    keys: Key[] = ['id', 'userId', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const cart = (await prisma.cart.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Cart, Key> | null;

    if (!cart) {
      throw ErrNotFound.withLog(`The cart with ${id} not found`);
    }
    return cart;
  };

  public update = async (id: Cart['id'], data: CartUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedCart = await prisma.cart.update({
      where: { id },
      data
    });
    return updatedCart;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Cart>> => {
    const count = await prisma.cart.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.cart.findMany({
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

export const cartService: CartService = new CartService();
