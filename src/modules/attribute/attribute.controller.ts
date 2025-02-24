import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse, PagingResponse } from '~/core/success';
import { attributeService } from '~/services/db/attribute.service';

class AttributeController {
  public create = async (req: Request, res: Response) => {
    logger.info(`AttributeController.create - request received`);
    const attribute = await attributeService.create(req.body);

    new OkResponse({
      message: 'Create attribute successfully',
      metadata: attribute
    }).send(res);
  };

  public update = async (req: Request, res: Response) => {
    logger.info(`AttributeController.update - request received`);

    const updatedAttribute = await attributeService.update(req.params.id, req.body);

    new OkResponse({
      message: 'Update attribute successfully',
      metadata: updatedAttribute
    }).send(res);
  };

  public findById = async (req: Request, res: Response) => {
    logger.info(`AttributeController.findById - request received`);
    const attribute = await attributeService.findById(req.params.id);

    new OkResponse({
      message: 'Find attribute by id successfully',
      metadata: attribute
    }).send(res);
  };

  public list = async (req: Request, res: Response) => {
    logger.info(`AttributeController.list - request received`);

    const attributes = await attributeService.list(req.paging);

    new PagingResponse({
      message: 'List attributes successfully',
      metadata: attributes.data,
      paging: attributes.paging
    }).send(res);
  };
}

export const attributeController: AttributeController = new AttributeController();
