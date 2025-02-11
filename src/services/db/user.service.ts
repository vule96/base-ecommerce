import type { Users } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v7 } from 'uuid';
import { prisma } from '~/components/prisma';
import { ErrUsernameExisted } from '~/modules/auth/error';
import { UserRole } from '~/shared/interface';
import { firstLetterUppercase, lowerCase } from '~/utils/helpers';

class UserService {
  public getUserByEmail = async <Key extends keyof Users>(
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
  ): Promise<Pick<Users, Key> | null> => {
    return prisma.users.findUnique({
      where: { email },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Users, Key> | null>;
  };

  public getUserByUsername = async <Key extends keyof Users>(
    username: string,
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
  ): Promise<Pick<Users, Key> | null> => {
    return prisma.users.findUnique({
      where: { username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Users, Key> | null>;
  };

  public getUserByUsernameOrEmail = async <Key extends keyof Users>(
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
  ): Promise<Pick<Users, Key> | null> => {
    return prisma.users.findFirst({
      where: {
        OR: [{ username: firstLetterUppercase(usernameOrEmail) }, { email: lowerCase(usernameOrEmail) }]
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Users, Key> | null>;
  };

  public createUser = async (
    data: Pick<Users, 'id' | 'email' | 'username' | 'firstName' | 'lastName' | 'password'>
  ): Promise<Users> => {
    // 1. Check username existed
    const existedUser = await userService.getUserByEmail(data.email);
    if (existedUser) {
      throw ErrUsernameExisted;
    }

    // 2. Gen salt and hash password
    // const salt = generateRandomString(20);
    const salt = bcrypt.genSaltSync(8);
    const hashPassword = await bcrypt.hash(`${data.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: Users = {
      ...data,
      id: newId,
      password: hashPassword,
      salt: salt,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      isEmailVerified: false
    };

    return prisma.users.create({
      data: {
        ...newUser
      }
    });
  };
}

export const userService: UserService = new UserService();
