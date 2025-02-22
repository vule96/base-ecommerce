import z from 'zod';

import {
  ErrDescriptionAtLeast2Chars,
  ErrNameAtLeast2Chars,
  ErrShortDescriptionAtLeast2Chars,
  ErrSlugAtLeast2Chars,
  ErrStatusInvalid
} from '~/modules/product/product.error';
import { ProductStatus } from '~/shared/interface';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  slug: z.string().min(2, ErrSlugAtLeast2Chars.message),
  description: z.string().min(2, ErrDescriptionAtLeast2Chars.message),
  shortDescription: z.string().min(2, ErrShortDescriptionAtLeast2Chars.message),
  categoryId: z.string().uuid(),
  status: z.nativeEnum(ProductStatus, ErrStatusInvalid),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Product = z.infer<typeof productSchema>;

export const productCreateDTOSchema = productSchema
  .pick({
    name: true,
    description: true,
    shortDescription: true,
    categoryId: true
  })
  .required();

export type ProductCreateDTO = z.infer<typeof productCreateDTOSchema>;

export const productUpdateDTOSchema = productSchema
  .pick({ name: true, description: true, shortDescription: true, categoryId: true, status: true })
  .partial();

export type ProductUpdateDTO = z.infer<typeof productUpdateDTOSchema>;

export const productIdDTOSchema = productSchema
  .pick({
    id: true
  })
  .required();

export type ProductIdDTO = z.infer<typeof productIdDTOSchema>;
