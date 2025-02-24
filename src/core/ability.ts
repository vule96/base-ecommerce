import { AbilityBuilder, type MongoAbility, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Attribute, AttributeValue, Category, Product, ProductAttribute, User } from '@prisma/client';

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
    }>
  | 'all';

type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export const defineAbilityFor = (role: UserRole): MongoAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  switch (role) {
    case UserRole.ADMIN:
      can('manage', 'all');
      break;

    case UserRole.USER:
      can('read', 'Product');
      break;
  }

  return build();
};
