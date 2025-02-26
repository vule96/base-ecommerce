import z from 'zod';

import { ErrBarcodeAtLeast2Chars, ErrSkuAtLeast2Chars } from '~/modules/product-variant/product-variant.error';

export const productVariantSchema = z.object({
  id: z.string().uuid(),
  price: z.number().int().nonnegative().default(0),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().min(2, ErrSkuAtLeast2Chars.message),
  barcode: z.string().min(2, ErrBarcodeAtLeast2Chars.message).optional(),
  productId: z.string().uuid(),
  variantOptionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductVariantDTO = z.infer<typeof productVariantSchema>;

export const productVariantCreateDTOSchema = productVariantSchema
  .pick({
    variantOptionId: true,
    productId: true,
    stock: true,
    price: true,
    sku: true,
    barcode: true
  })
  .extend({
    barcode: z.string().min(2, ErrBarcodeAtLeast2Chars.message).optional()
  });

export type ProductVariantCreateDTO = z.infer<typeof productVariantCreateDTOSchema>;

export const productVariantUpdateDTOSchema = productVariantSchema
  .pick({ variantOptionId: true, productId: true, stock: true, price: true, sku: true, barcode: true })
  .partial();

export type ProductVariantUpdateDTO = z.infer<typeof productVariantUpdateDTOSchema>;

export const productVariantIdDTOSchema = productVariantSchema
  .pick({
    id: true
  })
  .required();

export type ProductVariantIdDTO = z.infer<typeof productVariantIdDTOSchema>;
