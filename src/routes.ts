import { Application } from 'express';

import { attributeValueRoutes } from '~//modules/attribute-value/attribute-value.route';
import { attributeRoutes } from '~/modules/attribute/attribute.route';
import { authRoutes } from '~/modules/auth/auth.route';
import { categoryRoutes } from '~/modules/category/category.route';
import { healthRoutes } from '~/modules/health/route/health.route';
import { productRoutes } from '~/modules/product/product.route';
import { productAttributeRoutes } from '~/modules/product-attribute/product-attribute.route';
import { productVariantRoutes } from '~/modules/product-variant/product-variant.route';
import { userRoutes } from '~/modules/user/user.route';
import { variantRoutes } from '~/modules/variant/variant.route';
import { variantOptionRoutes } from '~/modules/variant-option/variant-option.route';

const BASE_PATH = '/api/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH + '/auth', authRoutes());
  app.use(BASE_PATH + '/attribute', attributeRoutes());
  app.use(BASE_PATH + '/attribute-value', attributeValueRoutes());
  app.use(BASE_PATH + '/product-attribute', productAttributeRoutes());
  app.use(BASE_PATH + '/variant', variantRoutes());
  app.use(BASE_PATH + '/variant-option', variantOptionRoutes());
  app.use(BASE_PATH + '/product-variant', productVariantRoutes());
  app.use(BASE_PATH + '/category', categoryRoutes());
  app.use(BASE_PATH + '/product', productRoutes());
  app.use(BASE_PATH + '/user', userRoutes());
};

export { appRoutes };
