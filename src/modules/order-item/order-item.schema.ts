import z from 'zod';

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().nonnegative().default(0),
  price: z.number().int().nonnegative().default(0),
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid()
});

export type OrderItemDTO = z.infer<typeof orderItemSchema>;

export const orderItemCreateDTOSchema = orderItemSchema
  .pick({
    quantity: true,
    price: true,
    orderId: true,
    productVariantId: true
  })
  .required();

export type OrderItemCreateDTO = z.infer<typeof orderItemCreateDTOSchema>;

export const orderItemUpdateDTOSchema = orderItemSchema
  .pick({ quantity: true, price: true, orderId: true, productVariantId: true })
  .partial();

export type OrderItemUpdateDTO = z.infer<typeof orderItemUpdateDTOSchema>;

export const orderItemIdDTOSchema = orderItemSchema
  .pick({
    id: true
  })
  .required();

export type OrderItemIdDTO = z.infer<typeof orderItemIdDTOSchema>;
