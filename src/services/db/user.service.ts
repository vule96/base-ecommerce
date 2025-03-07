import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrConflict, ErrNotFound } from '~/core/error';
import type { UserCondDTO, UserRegistrationDTO } from '~/modules/user/user.schema';
import { UserRole, UserStatus } from '~/shared/interface';
import { lowerCase } from '~/utils/string';

class UserService {
  public getUserByEmail = async <Key extends keyof User>(
    email: string,
    keys: Key[] = [
      'id',
      'email',
      'username',
      'password',
      'salt',
      'firstName',
      'lastName',
      'role',
      'isEmailVerified',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ): Promise<Pick<User, Key> | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as unknown as Pick<User, Key> | null;
  };

  public getUserByUsername = async <Key extends keyof User>(
    username: string,
    keys: Key[] = [
      'id',
      'email',
      'username',
      'firstName',
      'lastName',
      'role',
      'isEmailVerified',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ): Promise<Pick<User, Key> | null> => {
    return prisma.user.findUnique({
      where: { username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as unknown as Pick<User, Key> | null;
  };

  public getUserByUsernameOrEmail = async <Key extends keyof User>(
    usernameOrEmail: string,
    keys: Key[] = [
      'id',
      'email',
      'username',
      'password',
      'salt',
      'firstName',
      'lastName',
      'role',
      'isEmailVerified',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ): Promise<Pick<User, Key> | null> => {
    return prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: lowerCase(usernameOrEmail) }]
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as unknown as Pick<User, Key> | null;
  };

  public create = async (data: UserRegistrationDTO): Promise<User> => {
    const existedUser = await this.getUserByEmail(data.email);
    if (existedUser) {
      throw ErrConflict.withLog('Email is already registered');
    }

    const salt = await bcrypt.genSalt(8);
    const hashPassword = await bcrypt.hash(`${data.password}.${salt}`, 10);

    const newId = v7();
    const newUser: User = {
      ...data,
      id: newId,
      password: hashPassword,
      salt: salt,
      role: data.role || UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      isEmailVerified: false
    };

    return prisma.user.create({
      data: newUser
    });
  };

  public findById = async <Key extends keyof User>(
    id: User['id'],
    keys: Key[] = [
      'id',
      'email',
      'username',
      'firstName',
      'lastName',
      'role',
      'isEmailVerified',
      'createdAt',
      'updatedAt'
    ] as Key[]
  ) => {
    const user = (await prisma.user.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Pick<User, Key> | null;

    if (!user) {
      throw ErrNotFound.withLog(`The user with ${id} not found`);
    }

    return user;
  };

  public findByCond = async (condition: UserCondDTO) => {
    const user = await prisma.user.findFirst({
      where: condition,
      include: {
        carts: true
      }
    });

    if (!user) {
      throw ErrNotFound.withLog(`The user not found`);
    }

    return user;
  };
}

export const userService: UserService = new UserService();
