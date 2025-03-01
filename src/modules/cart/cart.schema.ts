import z from 'zod';

import { cartItemSchema } from '~/modules/cart-item/cart-item.schema';

export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type CartDTO = z.infer<typeof cartSchema>;

export const cartCreateDTOSchema = cartSchema
  .pick({
    userId: true
  })
  .required();

export type CartCreateDTO = z.infer<typeof cartCreateDTOSchema>;

export const cartUpdateDTOSchema = cartSchema.pick({ userId: true }).partial();

export type CartUpdateDTO = z.infer<typeof cartUpdateDTOSchema>;

export const cartIdDTOSchema = cartSchema
  .pick({
    id: true
  })
  .required();

export const cartCondDTOSchema = cartSchema
  .pick({
    userId: true
  })
  .partial();

export type CartCondDTO = z.infer<typeof cartCondDTOSchema>;

export type CartIdDTO = z.infer<typeof cartIdDTOSchema>;

export const cartAddItemDTOSchema = cartItemSchema.omit({ id: true, cartId: true });

export type CartAddItemDTO = z.infer<typeof cartAddItemDTOSchema>;
