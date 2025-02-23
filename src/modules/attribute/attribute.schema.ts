import z from 'zod';

import { ErrNameAtLeast2Chars } from '~/modules/attribute/attribute.error';

export const attributeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameAtLeast2Chars.message),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type AttributeDTO = z.infer<typeof attributeSchema>;

export const attributeCreateDTOSchema = attributeSchema
  .pick({
    name: true
  })
  .required();

export type AttributeCreateDTO = z.infer<typeof attributeCreateDTOSchema>;

export const attributeUpdateDTOSchema = attributeSchema.pick({ name: true }).partial();

export type AttributeUpdateDTO = z.infer<typeof attributeUpdateDTOSchema>;

export const attributeIdDTOSchema = attributeSchema
  .pick({
    id: true
  })
  .required();

export type AttributeIdDTO = z.infer<typeof attributeIdDTOSchema>;
