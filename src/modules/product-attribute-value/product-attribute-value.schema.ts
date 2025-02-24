import z from 'zod';

import { ErrValueAtLeast2Chars } from '~/modules/product-attribute-value/product-attribute-value.error';

export const productAttributeValueSchema = z.object({
  id: z.string().uuid(),
  value: z.string().min(2, ErrValueAtLeast2Chars.message),
  productId: z.string().uuid(),
  attributeId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductAttributeValueDTO = z.infer<typeof productAttributeValueSchema>;

export const productAttributeValueCreateDTOSchema = productAttributeValueSchema
  .pick({
    value: true,
    attributeId: true,
    productId: true
  })
  .required();

export type ProductAttributeValueCreateDTO = z.infer<typeof productAttributeValueCreateDTOSchema>;

export const productAttributeValueUpdateDTOSchema = productAttributeValueSchema
  .pick({ value: true, attributeId: true, productId: true })
  .partial();

export type ProductAttributeValueUpdateDTO = z.infer<typeof productAttributeValueUpdateDTOSchema>;

export const productAttributeValueIdDTOSchema = productAttributeValueSchema
  .pick({
    id: true
  })
  .required();

export type ProductAttributeValueIdDTO = z.infer<typeof productAttributeValueIdDTOSchema>;
