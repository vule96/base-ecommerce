import z from 'zod';

import {
  ErrEmailInvalid,
  ErrFirstNameAtLeast2Chars,
  ErrLastNameAtLeast2Chars,
  ErrPasswordAtLeast6Chars,
  ErrPhoneInvalid,
  ErrRoleInvalid,
  ErrStatusInvalid
} from '~/modules/user/user.error';
import { UserRole, UserStatus } from '~/shared/interface';

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message),
  email: z.string().email(ErrEmailInvalid.message),
  username: z
    .string()
    .min(3, 'Username must not be less than 3 characters')
    .max(25, 'Username must not be greater than 25 characters'),
  // .regex(/^[a-zA-Z0-9_]+$/, ErrUsernameInvalid.message),
  phone: z.string().regex(/^\+?[0-9]{6,14}$/, ErrPhoneInvalid.message),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  salt: z.string().min(8),
  role: z.nativeEnum(UserRole, ErrRoleInvalid),
  status: z.nativeEnum(UserStatus, ErrStatusInvalid),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserDTO = z.infer<typeof userSchema>;

export const userRegistrationDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
    phone: true,
    password: true
  })
  .extend({
    role: z.nativeEnum(UserRole, ErrRoleInvalid).optional()
  });

export const userLoginDTOSchema = userSchema
  .pick({
    username: true,
    password: true
  })
  .required();

export type UserRegistrationDTO = z.infer<typeof userRegistrationDTOSchema>;
export type UserLoginDTO = z.infer<typeof userLoginDTOSchema>;

export const userIdDTOSchema = userSchema
  .pick({
    id: true
  })
  .required();

export type UserIdDTO = z.infer<typeof userIdDTOSchema>;

export const userCondDTOSchema = userSchema
  .pick({
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
    status: true
  })
  .partial();

export type UserCondDTO = z.infer<typeof userCondDTOSchema>;
