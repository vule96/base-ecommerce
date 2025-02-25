import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { variantOptionService } from '~/services/db/variant-option.service';

class VariantOptionController {
  public create = async (req: Request, res: Response) => {
    logger.info(`VariantOptionController.create - request received`);
    const variantOption = await variantOptionService.create(req.body);

    new OkResponse({
      message: 'Create variant option value successfully',
      metadata: variantOption
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`VariantOptionController.update - request received`);

    const updatedVariantOption = await variantOptionService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update variant option value successfully',
      metadata: updatedVariantOption
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`VariantOptionController.findById - request received`);
    const variantOption = await variantOptionService.findById(req.params.id);

    new OkResponse({
      message: 'Find variant option value by id successfully',
      metadata: variantOption
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`VariantOptionController.list - request received`);

    const variantOptions = await variantOptionService.list(req.paging);

    new PagingResponse({
      message: 'List variant option values successfully',
      metadata: variantOptions.data,
      paging: variantOptions.paging
    }).send(res);
  };
}

export const variantOptionController: VariantOptionController = new VariantOptionController();
