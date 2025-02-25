import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { variantService } from '~/services/db/variant.service';

class VariantController {
  public create = async (req: Request, res: Response) => {
    logger.info(`VariantController.create - request received`);
    const variant = await variantService.create(req.body);

    new OkResponse({
      message: 'Create variant successfully',
      metadata: variant
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`VariantController.update - request received`);

    const updatedVariant = await variantService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update variant successfully',
      metadata: updatedVariant
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`VariantController.findById - request received`);
    const variant = await variantService.findById(req.params.id);

    new OkResponse({
      message: 'Find variant by id successfully',
      metadata: variant
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`VariantController.list - request received`);

    const variants = await variantService.list(req.paging);

    new PagingResponse({
      message: 'List variants successfully',
      metadata: variants.data,
      paging: variants.paging
    }).send(res);
  };
}

export const variantController: VariantController = new VariantController();
