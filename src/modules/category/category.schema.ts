import z from 'zod';
import { ErrNameAtLeast2Chars, ErrSlugAtLeast2Chars, ErrStatusInvalid } from '~/modules/category/category.error';
import { Status } from '~/shared/interface';

export const categorySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  slug: z.string().min(2, ErrSlugAtLeast2Chars.message),
  status: z.nativeEnum(Status, ErrStatusInvalid),
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
