import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type StudentFormData = z.infer<typeof studentSchema>;
