import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { Token, TokenCondDTO, TokenCreateDTO } from '~/modules/token/token.schema';
import type { ToNullProps } from '~/shared/interface/utility';

class TokenService {
  public create = async (data: TokenCreateDTO): Promise<ToNullProps<Token> | undefined> => {
    const newId = v7();
    const newToken: Token = {
      ...data,
      id: newId,
      isBlacklisted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.token.create({
      data: {
        ...newToken
      }
    });
  };

  public findByCond = async <Key extends keyof Token>(
    condition: TokenCondDTO,
    keys: Key[] = [
      'id',
      'token',
      'isBlacklisted',
      'expiresAt',
      'ipAddress',
      'userAgent',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ) => {
    const token = (await prisma.token.findFirst({
      where: condition,
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Promise<Pick<Token, Key> | null>;

    if (!token) {
      throw ErrNotFound.withLog(`The token not found`);
    }
    return token;
  };

  public delete = async (id: Token['id']) => {
    await prisma.token.delete({ where: { id } });
    return true;
  };

  public deleteExpiredTokens = async (): Promise<number> => {
    const now = new Date();
    const { count } = await prisma.token.deleteMany({
      where: {
        expiresAt: { lt: now }
      }
    });
    return count;
  };
}

export const tokenService: TokenService = new TokenService();
