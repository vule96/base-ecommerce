import z from 'zod';

import { ErrValueAtLeast2Chars } from '~/modules/variant-option/variant-option.error';

export const variantOptionSchema = z.object({
  id: z.string().uuid(),
  value: z.string().min(2, ErrValueAtLeast2Chars.message),
  variantId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type VariantOptionDTO = z.infer<typeof variantOptionSchema>;

export const variantOptionCreateDTOSchema = variantOptionSchema
  .pick({
    value: true,
    variantId: true
  })
  .required();

export type VariantOptionCreateDTO = z.infer<typeof variantOptionCreateDTOSchema>;

export const variantOptionUpdateDTOSchema = variantOptionSchema.pick({ value: true, variantId: true }).partial();

export type VariantOptionUpdateDTO = z.infer<typeof variantOptionUpdateDTOSchema>;

export const variantOptionIdDTOSchema = variantOptionSchema
  .pick({
    id: true
  })
  .required();

export type VariantOptionIdDTO = z.infer<typeof variantOptionIdDTOSchema>;
