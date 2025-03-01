import { AbilityBuilder, type MongoAbility, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import {
  Attribute,
  AttributeValue,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Product,
  ProductAttribute,
  ProductVariant,
  ProductVariantOption,
  User,
  Variant,
  VariantOption
} from '@prisma/client';
import type { Request } from 'express';

import { UserRole } from '~/shared/interface';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type AppSubjects =
  | Subjects<{
      User: User;
      Category: Category;
      Product: Product;
      Attribute: Attribute;
      AttributeValue: AttributeValue;
      ProductAttribute: ProductAttribute;
      Variant: Variant;
      VariantOption: VariantOption;
      ProductVariant: ProductVariant;
      ProductVariantOption: ProductVariantOption;
      Order: Order;
      OrderItem: OrderItem;
      Cart: Cart;
      CartItem: CartItem;
    }>
  | 'all';

type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export const defineAbilityFor = (role: UserRole, req: Request): MongoAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  switch (role) {
    case UserRole.ADMIN:
      can('manage', 'all');
      break;

    case UserRole.USER:
      can('read', 'Product');
      can('create', 'CartItem', { cart: { userId: req.user.id } });
      break;
  }

  return build();
};
