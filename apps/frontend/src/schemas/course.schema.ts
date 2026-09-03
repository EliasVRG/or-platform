import { z } from 'zod';

export const courseSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  description: z.string().optional(),
  hours: z.number().positive('Carga horária deve ser maior que 0'),
  price: z.number().min(0, 'Preço não pode ser negativo'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CourseFormData = z.infer<typeof courseSchema>;
