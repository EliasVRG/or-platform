import api from './api';
import type { ApiResponse, Enrollment } from '../types';

export const EnrollmentsService = {
  findAll: () =>
    api.get<ApiResponse<Enrollment[]>>('/enrollments').then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`).then((r) => r.data.data),

  findByStudent: (studentId: string) =>
    api.get<ApiResponse<Enrollment[]>>('/enrollments', { params: { studentId } }).then((r) => r.data.data),

  findByCourse: (courseId: string) =>
    api.get<ApiResponse<Enrollment[]>>('/enrollments', { params: { courseId } }).then((r) => r.data.data),

  create: (payload: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'student' | 'course'>) =>
    api.post<ApiResponse<Enrollment>>('/enrollments', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'student' | 'course'>>) =>
    api.patch<ApiResponse<Enrollment>>(`/enrollments/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/enrollments/${id}`),

  hardRemove: (id: string) =>
    api.delete(`/enrollments/${id}/hard`),
};
