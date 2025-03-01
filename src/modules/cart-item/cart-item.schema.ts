import z from 'zod';

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().nonnegative().default(0),
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid()
});

export type CartItemDTO = z.infer<typeof cartItemSchema>;

export const cartItemCreateDTOSchema = cartItemSchema
  .pick({
    quantity: true,
    cartId: true,
    productVariantId: true
  })
  .required();

export type CartItemCreateDTO = z.infer<typeof cartItemCreateDTOSchema>;

export const cartItemUpdateDTOSchema = cartItemSchema
  .pick({ quantity: true, cartId: true, productVariantId: true })
  .partial();

export type CartItemUpdateDTO = z.infer<typeof cartItemUpdateDTOSchema>;

export const cartItemIdDTOSchema = cartItemSchema
  .pick({
    id: true
  })
  .required();

export type CartItemIdDTO = z.infer<typeof cartItemIdDTOSchema>;

export const cartItemCondDTOSchema = cartItemSchema
  .pick({
    cartId: true,
    productVariantId: true,
    quantity: true
  })
  .partial();

export type CartItemCondDTO = z.infer<typeof cartItemCondDTOSchema>;
