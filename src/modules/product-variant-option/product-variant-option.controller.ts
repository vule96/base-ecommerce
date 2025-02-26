import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { productVariantOptionService } from '~/services/db/product-variant-option.service';

class ProductVariantOptionController {
  public create = async (req: Request, res: Response) => {
    logger.info(`ProductVariantOptionController.create - request received`);
    const productVariantOption = await productVariantOptionService.create(req.body);

    new OkResponse({
      message: 'Create product variant option attribute successfully',
      metadata: productVariantOption
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`ProductVariantOptionController.update - request received`);

    const updatedProductVariantOption = await productVariantOptionService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product variant option successfully',
      metadata: updatedProductVariantOption
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`ProductVariantOptionController.findById - request received`);
    const productVariantOption = await productVariantOptionService.findById(req.params.id);

    new OkResponse({
      message: 'Find product variant option by id successfully',
      metadata: productVariantOption
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`ProductVariantOptionController.list - request received`);

    const productVariantOptions = await productVariantOptionService.list(req.paging);

    new PagingResponse({
      message: 'List product variant options successfully',
      metadata: productVariantOptions.data,
      paging: productVariantOptions.paging
    }).send(res);
  };
}

export const productVariantOptionController: ProductVariantOptionController = new ProductVariantOptionController();
