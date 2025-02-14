import type { Token } from '@prisma/client';
import { prisma } from '~/components/prisma';

class TokenService {
  public upsert = async ({ token, userId, expiresIn }: Pick<Token, 'token' | 'userId' | 'expiresIn'>) => {
    return prisma.token.upsert({
      where: {
        userId
      },
      create: {
        token,
        userId,
        expiresIn
      },
      update: { token, expiresIn, updatedAt: new Date() }
    });
  };
}

export const tokenService: TokenService = new TokenService();
