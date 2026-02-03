import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  cover: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  rating: z.coerce.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').default(0),
  pages: z.coerce.number().positive('Pages must be a positive number').optional().or(z.literal(0)),
  genre: z.string().optional(),
  status: z.enum(['want-to-read', 'reading', 'completed'], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
});

export type BookFormValues = z.infer<typeof bookSchema>;
