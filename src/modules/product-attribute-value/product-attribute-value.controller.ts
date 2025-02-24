import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { productAttributeValueService } from '~/services/db/product-attribute-value.service';

class ProductAttributeValueController {
  public create = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.create - request received`);
    const productAttributeValue = await productAttributeValueService.create(req.body);

    new OkResponse({
      message: 'Create product attribute value successfully',
      metadata: productAttributeValue
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.update - request received`);

    const updatedProductAttributeValue = await productAttributeValueService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update product attribute value successfully',
      metadata: updatedProductAttributeValue
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.findById - request received`);
    const productAttributeValue = await productAttributeValueService.findById(req.params.id);

    new OkResponse({
      message: 'Find product attribute value by id successfully',
      metadata: productAttributeValue
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.list - request received`);

    const productAttributeValues = await productAttributeValueService.list(req.paging);

    new PagingResponse({
      message: 'List product attribute values successfully',
      metadata: productAttributeValues.data,
      paging: productAttributeValues.paging
    }).send(res);
  };
}

export const productAttributeValueController: ProductAttributeValueController = new ProductAttributeValueController();
