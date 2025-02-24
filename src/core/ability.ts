import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';

import { UserRole } from '~/shared/interface';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'User' | 'Category' | 'Product' | 'Variant' | 'VariantValue' | 'all';

type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAbilityFor = (role: UserRole): MongoAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

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
