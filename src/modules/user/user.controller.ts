import type { Request, Response } from 'express';

import { userService } from '~/services/db/user.service';
import { ErrNotFound } from '~/utils/error';
import logger from '~/utils/logger';
import { OkResponse } from '~/utils/success';

class UserController {
  public findById = async (req: Request, res: Response) => {
    logger.info(`UserController.findById - request received`);
    const user = await userService.findById(req.params.id);
    if (!user) {
      throw ErrNotFound.withLog(`The user with ${req.params.id} not found`);
    }

    new OkResponse({
      message: 'Find user by id successfully',
      metadata: user || {}
    }).send(res);
  };
}

export const userController: UserController = new UserController();
