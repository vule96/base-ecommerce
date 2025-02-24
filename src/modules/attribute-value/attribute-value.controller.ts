import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { attributeValueService } from '~/services/db/attribute-value.service';

class AttributeValueController {
  public create = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.create - request received`);
    const attributeValue = await attributeValueService.create(req.body);

    new OkResponse({
      message: 'Create attribute value successfully',
      metadata: attributeValue
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.update - request received`);

    const updatedAttributeValue = await attributeValueService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update attribute value successfully',
      metadata: updatedAttributeValue
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.findById - request received`);
    const attributeValue = await attributeValueService.findById(req.params.id);

    new OkResponse({
      message: 'Find attribute value by id successfully',
      metadata: attributeValue
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`AttributeValueController.list - request received`);

    const attributeValues = await attributeValueService.list(req.paging);

    new PagingResponse({
      message: 'List attribute values successfully',
      metadata: attributeValues.data,
      paging: attributeValues.paging
    }).send(res);
  };
}

export const attributeValueController: AttributeValueController = new AttributeValueController();
