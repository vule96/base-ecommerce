import type { VariantOption } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  VariantOptionCreateDTO,
  VariantOptionDTO,
  VariantOptionUpdateDTO
} from '~/modules/variant-option/variant-option.schema';
import { Paginated, PagingDTO } from '~/shared/model';

class VariantOptionService {
  public create = async (data: VariantOptionCreateDTO): Promise<VariantOption> => {
    const newId = v7();
    const newVariantOption: VariantOptionDTO = {
      ...data,
      id: newId,
      createdAt: new Date()
    };

    return prisma.variantOption.create({
      data: {
        ...newVariantOption
      }
    });
  };

  public findById = async <Key extends keyof VariantOption>(
    id: VariantOption['id'],
    keys: Key[] = ['id', 'value', 'variantId', 'createdAt'] as Key[]
  ) => {
    const variantOption = (await prisma.variantOption.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<VariantOption, Key> | null;

    if (!variantOption) {
      throw ErrNotFound.withLog(`The variant option with ${id} not found`);
    }
    return variantOption;
  };

  public update = async (id: VariantOption['id'], data: VariantOptionUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedVariantOption = await prisma.variantOption.update({
      where: { id },
      data
    });

    return updatedVariantOption;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<VariantOption>> => {
    const count = await prisma.variantOption.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.variantOption.findMany({
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

export const variantOptionService: VariantOptionService = new VariantOptionService();
