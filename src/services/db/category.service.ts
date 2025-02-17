import type { Category } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import type { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from '~/modules/category/category.schema';
import { Status } from '~/shared/interface';
import type { ToNullProps } from '~/shared/interface/utility';
import { toSlug } from '~/utils/helpers';

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

  public findById = async (id: Category['id']) => {
    const category = await prisma.category.findUnique({ where: { id } });
    return category;
  };

  public findByCond = async (condition: CategoryCondDTO) => {
    const category = await prisma.category.findFirst({ where: condition });
    return category;
  };

  public update = async (id: Category['id'], data: CategoryUpdateDTO) => {
    const preData = data.name ? { ...data, slug: toSlug(data.name) } : data;

    const updatedCategory = await prisma.category.update({ where: { id }, data: preData });
    return updatedCategory;
  };
}

export const categoryService: CategoryService = new CategoryService();
