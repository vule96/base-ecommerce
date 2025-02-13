import type { Token } from '@prisma/client';
import { prisma } from '~/components/prisma';

class TokenService {
  public create = async ({ token, userId }: Pick<Token, 'token' | 'userId'>) => {
    return prisma.token.create({
      data: {
        token,
        userId
      }
    });
  };
}

export const tokenService: TokenService = new TokenService();
