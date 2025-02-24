import type { Attribute } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { AttributeCreateDTO, AttributeUpdateDTO } from '~/modules/attribute/attribute.schema';
import { Paginated, PagingDTO } from '~/shared/model';

class AttributeService {
  public create = async (data: AttributeCreateDTO): Promise<Attribute> => {
    const newId = v7();
    const newAttribute: Attribute = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.attribute.create({
      data: {
        ...newAttribute
      }
    });
  };

  public findById = async <Key extends keyof Attribute>(
    id: Attribute['id'],
    keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const attribute = (await prisma.attribute.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Attribute, Key> | null;

    if (!attribute) {
      throw ErrNotFound.withLog(`The attribute with ${id} not found`);
    }
    return attribute;
  };

  public update = async (id: Attribute['id'], data: AttributeUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedAttribute = await prisma.attribute.update({
      where: { id },
      data
    });
    return updatedAttribute;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Attribute>> => {
    const count = await prisma.attribute.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.attribute.findMany({
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

export const attributeService: AttributeService = new AttributeService();
