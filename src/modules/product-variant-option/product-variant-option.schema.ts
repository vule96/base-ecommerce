import z from 'zod';

export const productVariantOptionSchema = z.object({
  id: z.string().uuid(),
  productVariantId: z.string().uuid(),
  variantOptionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductVariantOptionDTO = z.infer<typeof productVariantOptionSchema>;

export const productVariantOptionCreateDTOSchema = productVariantOptionSchema
  .pick({
    productVariantId: true,
    variantOptionId: true
  })
  .required();

export type ProductVariantOptionCreateDTO = z.infer<typeof productVariantOptionCreateDTOSchema>;

export const productVariantOptionUpdateDTOSchema = productVariantOptionSchema
  .pick({ productVariantId: true, variantOptionId: true })
  .partial();

export type ProductVariantOptionUpdateDTO = z.infer<typeof productVariantOptionCreateDTOSchema>;

export const productVariantOptionIdDTOSchema = productVariantOptionSchema
  .pick({
    id: true
  })
  .required();

export type ProductVariantOptionIdDTO = z.infer<typeof productVariantOptionIdDTOSchema>;
