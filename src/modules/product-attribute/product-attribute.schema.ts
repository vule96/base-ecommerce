import z from 'zod';

export const productAttributeSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  attributeValueId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProductAttributeDTO = z.infer<typeof productAttributeSchema>;

export const productAttributeCreateDTOSchema = productAttributeSchema
  .pick({
    attributeValueId: true,
    productId: true
  })
  .required();

export type ProductAttributeCreateDTO = z.infer<typeof productAttributeCreateDTOSchema>;

export const productAttributeUpdateDTOSchema = productAttributeSchema
  .pick({ attributeValueId: true, productId: true })
  .partial();

export type ProductAttributeUpdateDTO = z.infer<typeof productAttributeUpdateDTOSchema>;

export const productAttributeIdDTOSchema = productAttributeSchema
  .pick({
    id: true
  })
  .required();

export type ProductAttributeIdDTO = z.infer<typeof productAttributeIdDTOSchema>;
