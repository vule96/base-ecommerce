import type { AttributeValue } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type {
  AttributeValueCreateDTO,
  AttributeValueUpdateDTO
} from '~/modules/attribute-value/attribute-value.schema';
import { type Paginated, PagingDTO } from '~/shared/model';

class AttributeValueService {
  public create = async (data: AttributeValueCreateDTO): Promise<AttributeValue> => {
    const newId = v7();
    const newAttribute: AttributeValue = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.attributeValue.create({
      data: {
        ...newAttribute
      }
    });
  };

  public findById = async <Key extends keyof AttributeValue>(
    id: AttributeValue['id'],
    keys: Key[] = ['id', 'value', 'attributeId', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const attributeValue = (await prisma.attributeValue.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<AttributeValue, Key> | null;

    if (!attributeValue) {
      throw ErrNotFound.withLog(`The attribute value with ${id} not found`);
    }
    return attributeValue;
  };

  public update = async (id: AttributeValue['id'], data: AttributeValueUpdateDTO) => {
    await this.findById(id, ['id']);

    const updatedAttributeValue = await prisma.attributeValue.update({
      where: { id },
      data
    });
    return updatedAttributeValue;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<AttributeValue>> => {
    const count = await prisma.attributeValue.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.attributeValue.findMany({
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

export const attributeValueService: AttributeValueService = new AttributeValueService();
