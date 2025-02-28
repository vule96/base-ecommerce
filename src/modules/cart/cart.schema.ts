import z from 'zod';

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

export type CartIdDTO = z.infer<typeof cartIdDTOSchema>;
