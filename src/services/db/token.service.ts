import { v7 } from 'uuid';
import { prisma } from '~/components/prisma';
import type { Token, TokenCreateDTO } from '~/modules/token/token.schema';
import { ToNullProps } from '~/shared/interface/utility';

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
}

export const tokenService: TokenService = new TokenService();
