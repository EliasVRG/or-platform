import { z } from 'zod';

export const enrollmentSchema = z.object({
  studentId: z.string().uuid('ID do aluno inválido'),
  courseId: z.string().uuid('ID do curso inválido'),
  status: z.enum(['pending', 'active', 'canceled', 'completed']).default('pending'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
