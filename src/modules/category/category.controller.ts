import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { categoryService } from '~/services/db/category.service';

class CategoryController {
  public create = async (req: Request, res: Response) => {
    logger.info(`CategoryController.create - request received`);
    const category = await categoryService.create(req.body);

    new OkResponse({
      message: 'Create category successfully',
      metadata: category
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`CategoryController.update - request received`);

    const updatedCategory = await categoryService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update category successfully',
      metadata: updatedCategory
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`CategoryController.findById - request received`);
    const category = await categoryService.findById(req.params.id);

    new OkResponse({
      message: 'Find category by id successfully',
      metadata: category
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`CategoryController.list - request received`);

    const categories = await categoryService.list(req.paging);

    new PagingResponse({
      message: 'List categories successfully',
      metadata: categories.data,
      paging: categories.paging
    }).send(res);
  };
}

export const categoryController: CategoryController = new CategoryController();
