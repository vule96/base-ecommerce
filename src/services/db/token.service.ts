import { Prisma, type Token } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { TokenCondDTO, TokenCreateDTO } from '~/modules/token/token.schema';
import type { ToNullProps } from '~/shared/interface/utility';

class TokenService {
  public create = async (data: ToNullProps<TokenCreateDTO>): Promise<Token> => {
    const newId = v7();
    const newToken: Token = {
      ...data,
      id: newId,
      isBlacklisted: data.isBlacklisted || false,
      createdAt: new Date()
    };

    return prisma.token.create({
      data: {
        ...newToken
      }
    });
  };

  public findByCond = async <Key extends keyof Token>(
    condition: TokenCondDTO,
    keys: Key[] = ['id', 'token', 'isBlacklisted', 'expiresAt', 'ipAddress', 'userAgent', 'createdAt'] as Key[]
  ) => {
    const token = (await prisma.token.findFirst({
      where: condition,
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<Token, Key> | null;

    if (!token) {
      throw ErrNotFound.withLog(`The token not found`);
    }
    return token;
  };

  public delete = async (condition: Prisma.TokenWhereUniqueInput) => {
    await prisma.token.delete({ where: condition });
    return true;
  };

  public deleteMany = async (condition: Prisma.TokenWhereInput): Promise<number> => {
    const { count } = await prisma.token.deleteMany({ where: condition });
    return count;
  };

  public deleteExpiredTokens = async (): Promise<number> => {
    return this.deleteMany({ expiresAt: { lt: new Date() } });
  };
}

export const tokenService: TokenService = new TokenService();
