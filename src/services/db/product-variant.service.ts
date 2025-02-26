import type { ProductVariant } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  ProductVariantCreateDTO,
  ProductVariantDTO,
  ProductVariantUpdateDTO
} from '~/modules/product-variant/product-variant.schema';
import type { Paginated, PagingDTO } from '~/shared/model';

class ProductVariantService {
  public create = async (data: ProductVariantCreateDTO): Promise<ProductVariant> => {
    const newId = v7();
    const newProductVariant: ProductVariantDTO = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.productVariant.create({
      data: {
        ...newProductVariant
      }
    });
  };

  public findById = async <Key extends keyof ProductVariant>(
    id: ProductVariant['id'],
    keys: Key[] = ['id', 'stock', 'price', 'sku', 'barcode', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    });

    if (!productVariant) {
      throw ErrNotFound.withLog(`The product variant with ${id} not found`);
    }
    return productVariant;
  };

  public update = async (id: ProductVariant['id'], data: ProductVariantUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedProductVariant = await prisma.productVariant.update({
      where: { id },
      data
    });
    return updatedProductVariant;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<ProductVariant>> => {
    const count = await prisma.productVariant.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.productVariant.findMany({
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

export const productVariantService: ProductVariantService = new ProductVariantService();
