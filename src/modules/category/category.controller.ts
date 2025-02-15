import type { Request, Response } from 'express';
import { categoryService } from '~/services/db/category.service';
import { ErrNotFound } from '~/utils/error';
import logger from '~/utils/logger';
import { OkResponse } from '~/utils/success';

class CategoryController {
  public create = async (req: Request, res: Response) => {
    logger.info(`CategoryController.create - request received`);
    const category = await categoryService.create(req.body);

    new OkResponse({
      message: 'Create category successfully',
      metadata: category || {}
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`CategoryController.update - request received`);
    const category = await categoryService.findById(req.params.id);

    if (!category) {
      throw ErrNotFound.withLog(`The category with ${req.params.id} not found`);
    }

    const updatedCategory = await categoryService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update category successfully',
      metadata: updatedCategory
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`CategoryController.findById - request received`);
    const category = await categoryService.findById(req.params.id);
    if (!category) {
      throw ErrNotFound.withLog(`The category with ${req.params.id} not found`);
    }

    new OkResponse({
      message: 'Find category by id successfully',
      metadata: category || {}
    }).send(res);
  };
}

export const categoryController: CategoryController = new CategoryController();
