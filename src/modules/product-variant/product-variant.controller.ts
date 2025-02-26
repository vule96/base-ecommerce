import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { productVariantService } from '~/services/db/product-variant.service';

class ProductVariantController {
  public create = async (req: Request, res: Response) => {
    logger.info(`VariantValueController.create - request received`);
    const productVariant = await productVariantService.create(req.body);

    new OkResponse({
      message: 'Create product variant successfully',
      metadata: productVariant
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`VariantValueController.update - request received`);

    const updatedProductVariant = await productVariantService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product variant successfully',
      metadata: updatedProductVariant
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`VariantValueController.findById - request received`);
    const productVariant = await productVariantService.findById(req.params.id);

    new OkResponse({
      message: 'Find product variant by id successfully',
      metadata: productVariant
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`VariantValueController.list - request received`);

    const productVariants = await productVariantService.list(req.paging);

    new PagingResponse({
      message: 'List product variants successfully',
      metadata: productVariants.data,
      paging: productVariants.paging
    }).send(res);
  };
}

export const productVariantController: ProductVariantController = new ProductVariantController();
