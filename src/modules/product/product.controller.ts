import type { Request, Response } from 'express';

import { productService } from '~/services/db/product.service';
import { ErrNotFound } from '~/utils/error';
import logger from '~/utils/logger';
import { OkResponse } from '~/utils/success';

class ProductController {
  public create = async (req: Request, res: Response) => {
    logger.info(`ProductController.create - request received`);
    const product = await productService.create(req.body);

    new OkResponse({
      message: 'Create product successfully',
      metadata: product || {}
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`ProductController.update - request received`);
    const product = await productService.findById(req.params.id);

    if (!product) {
      throw ErrNotFound.withLog(`The product with ${req.params.id} not found`);
    }

    const updatedProduct = await productService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product successfully',
      metadata: updatedProduct
    }).send(res);
  };
}

export const productController: ProductController = new ProductController();
