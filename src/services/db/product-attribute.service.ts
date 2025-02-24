import type { ProductAttribute } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  ProductAttributeCreateDTO,
  ProductAttributeUpdateDTO
} from '~/modules/product-attribute/product-attribute.schema';
import { type Paginated, PagingDTO } from '~/shared/model';

class ProductAttributeService {
  public create = async (data: ProductAttributeCreateDTO): Promise<ProductAttribute> => {
    const newId = v7();
    const newProductAttribute: ProductAttribute = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.productAttribute.create({
      data: {
        ...newProductAttribute
      }
    });
  };

  public findById = async <Key extends keyof ProductAttribute>(
    id: ProductAttribute['id'],
    keys: Key[] = ['id', 'attributeValueId', 'productId', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const productAttribute = (await prisma.productAttribute.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<ProductAttribute, Key> | null;

    if (!productAttribute) {
      throw ErrNotFound.withLog(`The product attribute with ${id} not found`);
    }
    return productAttribute;
  };

  public update = async (id: ProductAttribute['id'], data: ProductAttributeUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedProductAttribute = await prisma.productAttribute.update({
      where: { id },
      data
    });
    return updatedProductAttribute;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<ProductAttribute>> => {
    const count = await prisma.productAttribute.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.productAttribute.findMany({
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

export const productAttributeService: ProductAttributeService = new ProductAttributeService();
