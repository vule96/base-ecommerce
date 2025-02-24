import z from 'zod';

import { ErrValueAtLeast2Chars } from '~/modules/attribute-value/attribute-value.error';

export const attributeValueSchema = z.object({
  id: z.string().uuid(),
  value: z.string().min(2, ErrValueAtLeast2Chars.message),
  attributeId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type AttributeValueDTO = z.infer<typeof attributeValueSchema>;

export const attributeValueCreateDTOSchema = attributeValueSchema
  .pick({
    value: true,
    attributeId: true
  })
  .required();

export type AttributeValueCreateDTO = z.infer<typeof attributeValueCreateDTOSchema>;

export const attributeValueUpdateDTOSchema = attributeValueSchema.pick({ value: true, attributeId: true }).partial();

export type AttributeValueUpdateDTO = z.infer<typeof attributeValueUpdateDTOSchema>;

export const attributeValueIdDTOSchema = attributeValueSchema
  .pick({
    id: true
  })
  .required();

export type AttributeValueIdDTO = z.infer<typeof attributeValueIdDTOSchema>;
