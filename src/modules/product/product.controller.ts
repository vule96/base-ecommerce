import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { productService } from '~/services/db/product.service';

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

    const updatedProduct = await productService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product successfully',
      metadata: updatedProduct
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`ProductController.findById - request received`);
    const product = await productService.findById(req.params.id);

    new OkResponse({
      message: 'Find product by id successfully',
      metadata: product || {}
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`ProductController.list - request received`);

    const products = await productService.list(req.paging);

    new PagingResponse({
      message: 'List products successfully',
      metadata: products.data,
      paging: products.paging
    }).send(res);
  };
}

export const productController: ProductController = new ProductController();
