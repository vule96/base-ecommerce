import z from 'zod';

import {
  ErrDescriptionAtLeast2Chars,
  ErrNameAtLeast2Chars,
  ErrSlugAtLeast2Chars,
  ErrStatusInvalid
} from '~/modules/product/product.error';
import { ProductStatus } from '~/shared/interface';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  slug: z.string().min(2, ErrSlugAtLeast2Chars.message),
  description: z.string().min(2, ErrDescriptionAtLeast2Chars.message),
  price: z.number().int().nonnegative().default(0),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.string().uuid(),
  status: z.nativeEnum(ProductStatus, ErrStatusInvalid),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductDTO = z.infer<typeof productSchema>;

export const productCreateDTOSchema = productSchema
  .pick({
    name: true,
    description: true,
    categoryId: true,
    stock: true,
    price: true
  })
  .required();

export type ProductCreateDTO = z.infer<typeof productCreateDTOSchema>;

export const productUpdateDTOSchema = productSchema
  .pick({ name: true, description: true, categoryId: true, stock: true, price: true, status: true })
  .partial();

export type ProductUpdateDTO = z.infer<typeof productUpdateDTOSchema>;

export const productIdDTOSchema = productSchema
  .pick({
    id: true
  })
  .required();

export type ProductIdDTO = z.infer<typeof productIdDTOSchema>;

export const productAttributeSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  attributeId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductAttributeDTO = z.infer<typeof productAttributeSchema>;

export const productAttributeCreateDTOSchema = productAttributeSchema.pick({
  productId: true,
  attributeId: true
});

export type ProductAttributeCreateDTO = z.infer<typeof productAttributeCreateDTOSchema>;
