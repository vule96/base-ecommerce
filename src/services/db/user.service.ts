import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v7 } from 'uuid';
import { prisma } from '~/components/prisma';
import { ErrUsernameExisted } from '~/modules/auth/auth.error';
import type { UserRegistrationDTO } from '~/modules/user/user.schema';
import { Status, UserRole } from '~/shared/interface';
import { lowerCase } from '~/utils/helpers';

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
    }) as Promise<Pick<User, Key> | null>;
  };

  public getUserByUsername = async <Key extends keyof User>(
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
  ): Promise<Pick<User, Key> | null> => {
    return prisma.user.findUnique({
      where: { username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<User, Key> | null>;
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
    }) as Promise<Pick<User, Key> | null>;
  };

  public createUser = async (data: UserRegistrationDTO): Promise<User> => {
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
    const newUser: User = {
      ...data,
      id: newId,
      password: hashPassword,
      salt: salt,
      role: UserRole.USER,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      isEmailVerified: false
    };

    return prisma.user.create({
      data: {
        ...newUser
      }
    });
  };
}

export const userService: UserService = new UserService();
