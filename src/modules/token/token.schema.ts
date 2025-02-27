import z from 'zod';

export const tokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string(),
  isBlacklisted: z.boolean(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  expiresAt: z.date(),
  createdAt: z.date()
});

export type TokenDTO = z.infer<typeof tokenSchema>;

export const tokenCreateDTOSchema = tokenSchema
  .pick({
    token: true,
    userId: true,
    isBlacklisted: true,
    ipAddress: true,
    userAgent: true,
    expiresAt: true
  })
  .partial()
  .required({ token: true, userId: true, expiresAt: true });

export type TokenCreateDTO = z.infer<typeof tokenCreateDTOSchema>;

export const tokenIdDTOSchema = tokenSchema
  .pick({
    id: true
  })
  .required();

export type TokenIdDTO = z.infer<typeof tokenIdDTOSchema>;

export const tokenCondDTOSchema = tokenSchema
  .pick({
    token: true,
    isBlacklisted: true,
    ipAddress: true,
    userAgent: true,
    expiresAt: true
  })
  .partial();

export type TokenCondDTO = z.infer<typeof tokenCondDTOSchema>;
