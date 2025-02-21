import type { Category } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from '~/modules/category/category.schema';
import { Status } from '~/shared/interface';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';
import { toSlug } from '~/utils/string';

class CategoryService {
  public create = async (data: ToNullProps<CategoryCreateDTO>): Promise<Category | undefined> => {
    const newId = v7();
    const newCategory: Category = {
      ...data,
      id: newId,
      slug: toSlug(data.name),
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.category.create({
      data: {
        ...newCategory
      }
    });
  };

  public findById = async <Key extends keyof Category>(
    id: Category['id'],
    keys: Key[] = ['id', 'name', 'slug', 'parentId', 'status', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const category = (await prisma.category.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Category, Key> | null;

    if (!category) {
      throw ErrNotFound.withLog(`The category with ${id} not found`);
    }
    return category;
  };

  public findByCond = async <Key extends keyof Category>(
    condition: CategoryCondDTO,
    keys: Key[] = ['id', 'name', 'slug', 'parentId', 'status', 'createdAt', 'updatedAt'] as Key[]
  ) => {
    const category = (await prisma.category.findFirst({
      where: condition,
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Category, Key> | null;

    if (!category) {
      throw ErrNotFound.withLog(`The category not found`);
    }
    return category;
  };

  public update = async (id: Category['id'], data: CategoryUpdateDTO) => {
    await this.findById(id, ['id']);

    const preData = {
      ...data,
      slug: data.name ? toSlug(data.name) : undefined,
      parentId: data.parentId || null
    };

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: preData
    });
    return updatedCategory;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Category>> => {
    const count = await prisma.category.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.category.findMany({
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

export const categoryService: CategoryService = new CategoryService();
