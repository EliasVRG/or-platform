import api from './api';
import type { ApiResponse, Student } from '../types';

export const StudentsService = {
  findAll: () =>
    api.get<ApiResponse<Student[]>>('/students').then((r) => r.data.data),

  findActive: () =>
    api.get<ApiResponse<Student[]>>('/students/active').then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Student>>(`/students/${id}`).then((r) => r.data.data),

  create: (payload: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Student>>('/students', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<ApiResponse<Student>>(`/students/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/students/${id}`),
};
