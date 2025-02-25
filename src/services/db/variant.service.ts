import type { Variant } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { VariantCreateDTO, VariantUpdateDTO } from '~/modules/variant/variant.schema';
import type { Paginated, PagingDTO } from '~/shared/model';

class VariantService {
  public create = async (data: VariantCreateDTO): Promise<Variant> => {
    const newId = v7();
    const newVariant: Variant = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.variant.create({
      data: {
        ...newVariant
      }
    });
  };

  public findById = async <Key extends keyof Variant>(
    id: Variant['id'],
    keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const variant = (await prisma.variant.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Variant, Key> | null;

    if (!variant) {
      throw ErrNotFound.withLog(`The variant with ${id} not found`);
    }
    return variant;
  };

  public update = async (id: Variant['id'], data: VariantUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedVariant = await prisma.variant.update({
      where: { id },
      data
    });
    return updatedVariant;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Variant>> => {
    const count = await prisma.variant.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.variant.findMany({
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

export const variantService: VariantService = new VariantService();
