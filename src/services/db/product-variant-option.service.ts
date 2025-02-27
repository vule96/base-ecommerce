import type { ProductVariantOption } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  ProductVariantOptionCreateDTO,
  ProductVariantOptionDTO,
  ProductVariantOptionUpdateDTO
} from '~/modules/product-variant-option/product-variant-option.schema';
import type { Paginated, PagingDTO } from '~/shared/model';

class ProductVariantOptionService {
  public create = async (data: ProductVariantOptionCreateDTO): Promise<ProductVariantOption> => {
    const newId = v7();
    const newProductVariantOption: ProductVariantOptionDTO = {
      ...data,
      id: newId
    };

    return prisma.productVariantOption.create({
      data: {
        ...newProductVariantOption
      }
    });
  };

  public findById = async <Key extends keyof ProductVariantOption>(
    id: ProductVariantOption['id'],
    keys: Key[] = ['id', 'productVariantId', 'variantOptionId'] as Key[]
  ) => {
    const productVariantOption = (await prisma.productVariantOption.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<ProductVariantOption, Key> | null;

    if (!productVariantOption) {
      throw ErrNotFound.withLog(`The product variant option with ${id} not found`);
    }
    return productVariantOption;
  };

  public update = async (id: ProductVariantOption['id'], data: ProductVariantOptionUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedProductVariantOption = await prisma.productVariantOption.update({
      where: { id },
      data
    });
    return updatedProductVariantOption;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<ProductVariantOption>> => {
    const count = await prisma.productVariantOption.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.productVariantOption.findMany({
      skip,
      take: paging.limit
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

export const productVariantOptionService: ProductVariantOptionService = new ProductVariantOptionService();
