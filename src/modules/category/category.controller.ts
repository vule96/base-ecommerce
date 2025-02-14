import type { Request, Response } from 'express';
import { categoryService } from '~/services/db/category.service';
import { OkResponse } from '~/utils/success';

class CategoryController {
  public create = async (req: Request, res: Response) => {
    const category = await categoryService.create(req.body);
    new OkResponse({
      message: 'Create category successfully',
      metadata: category || {}
    }).send(res);
  };
}

export const categoryController: CategoryController = new CategoryController();
