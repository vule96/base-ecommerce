import z from 'zod';

import { ErrNameAtLeast2Chars, ErrSlugAtLeast2Chars, ErrStatusInvalid } from '~/modules/category/category.error';
import { CategoryStatus } from '~/shared/interface';

export const categorySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  slug: z.string().min(2, ErrSlugAtLeast2Chars.message),
  status: z.nativeEnum(CategoryStatus, ErrStatusInvalid),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Category = z.infer<typeof categorySchema>;

export const categoryCreateDTOSchema = categorySchema
  .pick({
    name: true,
    parentId: true
  })
  .partial()
  .required({ name: true });

export type CategoryCreateDTO = z.infer<typeof categoryCreateDTOSchema>;

export const categoryCondDTOSchema = categorySchema
  .pick({
    name: true,
    slug: true,
    status: true
  })
  .partial();

export type CategoryCondDTO = z.infer<typeof categoryCondDTOSchema>;

export const categoryUpdateDTOSchema = categorySchema
  .pick({ name: true, status: true })
  .partial()
  .extend({
    parentId: z.string().uuid().or(z.literal('')).optional()
  });

export type CategoryUpdateDTO = z.infer<typeof categoryUpdateDTOSchema>;

export const categoryIdDTOSchema = categorySchema
  .pick({
    id: true
  })
  .required();

export type CategoryIdDTO = z.infer<typeof categoryIdDTOSchema>;
