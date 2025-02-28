import z from 'zod';

import { ErrStatusInvalid } from '~/modules/order/order.error';
import { OrderStatus } from '~/shared/interface';

export const orderSchema = z.object({
  id: z.string().uuid(),
  totalAmount: z.number().int().nonnegative().default(0),
  status: z.nativeEnum(OrderStatus, ErrStatusInvalid),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type OrderDTO = z.infer<typeof orderSchema>;

export const orderCreateDTOSchema = orderSchema
  .pick({
    totalAmount: true,
    status: true,
    userId: true
  })
  .required();

export type OrderCreateDTO = z.infer<typeof orderCreateDTOSchema>;

export const orderUpdateDTOSchema = orderSchema.pick({ totalAmount: true, status: true, userId: true }).partial();

export type OrderUpdateDTO = z.infer<typeof orderUpdateDTOSchema>;

export const orderIdDTOSchema = orderSchema
  .pick({
    id: true
  })
  .required();

export type OrderIdDTO = z.infer<typeof orderIdDTOSchema>;
