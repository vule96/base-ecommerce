import z from 'zod';

export const pagingDTOSchema = z.object({
  page: z.coerce.number().min(1, { message: 'Page number must be at least 1' }).default(1),
  limit: z.coerce.number().min(1, { message: 'Limit must be at least 1' }).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional()
});
export type PagingDTO = z.infer<typeof pagingDTOSchema>;

export type PagingDTOResponse = Pick<PagingDTO, 'page' | 'limit'> & { total?: number };

export type Paginated<E> = {
  data: E[];
  paging: PagingDTOResponse;
};
