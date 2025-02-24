import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { productAttributeService } from '~/services/db/product-attribute.service';

class ProductAttributeController {
  public create = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.create - request received`);
    const productAttribute = await productAttributeService.create(req.body);

    new OkResponse({
      message: 'Create product attribute successfully',
      metadata: productAttribute
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.update - request received`);

    const updatedProductAttribute = await productAttributeService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product attribute successfully',
      metadata: updatedProductAttribute
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.findById - request received`);
    const productAttribute = await productAttributeService.findById(req.params.id);

    new OkResponse({
      message: 'Find product attribute by id successfully',
      metadata: productAttribute
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.list - request received`);

    const productAttributes = await productAttributeService.list(req.paging);

    new PagingResponse({
      message: 'List product attributes successfully',
      metadata: productAttributes.data,
      paging: productAttributes.paging
    }).send(res);
  };
}

export const productAttributeController: ProductAttributeController = new ProductAttributeController();
