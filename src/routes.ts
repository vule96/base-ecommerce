import { Application } from 'express';

import { attributeRoutes } from '~/modules/attribute/attribute.route';
import { authRoutes } from '~/modules/auth/auth.route';
import { categoryRoutes } from '~/modules/category/category.route';
import { healthRoutes } from '~/modules/health/route/health.route';
import { productRoutes } from '~/modules/product/product.route';
import { productAttributeValueRoutes } from '~/modules/product-attribute-value/product-attribute-value.route';
import { userRoutes } from '~/modules/user/user.route';

const BASE_PATH = '/api/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH + '/auth', authRoutes());
  app.use(BASE_PATH + '/attribute', attributeRoutes());
  app.use(BASE_PATH + '/product-attribute-value', productAttributeValueRoutes());
  app.use(BASE_PATH + '/category', categoryRoutes());
  app.use(BASE_PATH + '/product', productRoutes());
  app.use(BASE_PATH + '/user', userRoutes());
};

export { appRoutes };
