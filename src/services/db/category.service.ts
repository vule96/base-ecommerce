import type { Category } from '@prisma/client';
import { v7 } from 'uuid';
import { prisma } from '~/components/prisma';
import type { CategoryCreateDTO } from '~/modules/category/category.schema';
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
}

export const categoryService: CategoryService = new CategoryService();
