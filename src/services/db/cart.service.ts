import type { Cart } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { CartAddItemDTO, CartCondDTO, CartCreateDTO, CartDTO, CartUpdateDTO } from '~/modules/cart/cart.schema';
import { productVariantService } from '~/services/db/product-variant.service';
import { userService } from '~/services/db/user.service';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';

import { cartItemService } from './cart-item.service';

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

  public findByCond = async <Key extends keyof Cart>(
    condition: CartCondDTO,
    keys: Key[] = ['id', 'userId', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const cart = (await prisma.cart.findFirst({
      where: condition,
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Cart, Key> | null;

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

  public add = async ({ productVariantId, quantity }: CartAddItemDTO, currentUser: UserPayload) => {
    const user = await userService.findById(currentUser.id);
    await productVariantService.findById(productVariantId);

    let cart = await cartService.findByCond({ userId: user.id });

    if (!cart) {
      cart = await this.create({ userId: currentUser.id });
    }

    const existingCartItem = await cartItemService.findByCond({
      cartId: cart.id,
      productVariantId
    });

    if (existingCartItem) {
      await cartItemService.update(existingCartItem.id, {
        quantity: existingCartItem.quantity + quantity
      });
    } else {
      await cartItemService.create({
        cartId: cart.id,
        productVariantId,
        quantity
      });
    }

    return cart;
  };
}

export const cartService: CartService = new CartService();
