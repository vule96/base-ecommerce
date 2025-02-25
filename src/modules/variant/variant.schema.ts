import z from 'zod';

import { ErrNameAtLeast2Chars } from '~/modules/variant/variant.error';

export const variantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type VariantDTO = z.infer<typeof variantSchema>;

export const variantCreateDTOSchema = variantSchema
  .pick({
    name: true
  })
  .required();

export type VariantCreateDTO = z.infer<typeof variantCreateDTOSchema>;

export const variantUpdateDTOSchema = variantSchema.pick({ name: true }).partial();

export type VariantUpdateDTO = z.infer<typeof variantUpdateDTOSchema>;

export const variantIdDTOSchema = variantSchema
  .pick({
    id: true
  })
  .required();

export type VariantIdDTO = z.infer<typeof variantIdDTOSchema>;
