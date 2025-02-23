import { Product } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { ProductCreateDTO, ProductUpdateDTO } from '~/modules/product/product.schema';
import { ProductStatus } from '~/shared/interface';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';
import { toSlug } from '~/utils/string';

class ProductService {
  public create = async (data: ToNullProps<ProductCreateDTO>): Promise<Product> => {
    const newId = v7();
    const newProduct: Product = {
      ...data,
      id: newId,
      slug: toSlug(data.name),
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.product.create({
      data: {
        ...newProduct
      }
    });
  };

  public findById = async <Key extends keyof Product>(
    id: Product['id'],
    keys: Key[] = [
      'id',
      'name',
      'slug',
      'description',
      'shortDescription',
      'categoryId',
      'status',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ) => {
    const product = (await prisma.product.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Product, Key> | null;

    if (!product) {
      throw ErrNotFound.withLog(`The product with ${id} not found`);
    }
    return product;
  };

  public update = async (id: Product['id'], data: ProductUpdateDTO) => {
    await this.findById(id, ['id']);

    const preData = {
      ...data,
      slug: data.name ? toSlug(data.name) : undefined
    };

    const updatedProduct = await prisma.product.update({ where: { id }, data: preData });
    return updatedProduct;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Product>> => {
    const count = await prisma.product.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.product.findMany({
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

export const productService: ProductService = new ProductService();
