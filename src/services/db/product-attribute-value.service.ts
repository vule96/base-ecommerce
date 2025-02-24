import type { ProductAttributeValue } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  ProductAttributeValueCreateDTO,
  ProductAttributeValueUpdateDTO
} from '~/modules/product-attribute-value/product-attribute-value.schema';
import { type Paginated, PagingDTO } from '~/shared/model';

class ProductAttributeValueService {
  public create = async (data: ProductAttributeValueCreateDTO): Promise<ProductAttributeValue> => {
    const newId = v7();
    const newProductAttribute: ProductAttributeValue = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.productAttributeValue.create({
      data: {
        ...newProductAttribute
      }
    });
  };

  public findById = async <Key extends keyof ProductAttributeValue>(
    id: ProductAttributeValue['id'],
    keys: Key[] = ['id', 'value', 'attributeId', 'productId', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const productAttributeValue = (await prisma.productAttributeValue.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<ProductAttributeValue, Key> | null;

    if (!productAttributeValue) {
      throw ErrNotFound.withLog(`The attribute value with ${id} not found`);
    }
    return productAttributeValue;
  };

  public update = async (id: ProductAttributeValue['id'], data: ProductAttributeValueUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedProductAttributeValue = await prisma.productAttributeValue.update({
      where: { id },
      data
    });
    return updatedProductAttributeValue;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<ProductAttributeValue>> => {
    const count = await prisma.productAttributeValue.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.productAttributeValue.findMany({
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

export const productAttributeValueService: ProductAttributeValueService = new ProductAttributeValueService();
