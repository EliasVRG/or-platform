import api from './api';
import type { ApiResponse, Course } from '../types';

export const CoursesService = {
  findAll: () =>
    api.get<ApiResponse<Course[]>>('/courses').then((r) => r.data.data),

  findActive: () =>
    api.get<ApiResponse<Course[]>>('/courses/active').then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Course>>(`/courses/${id}`).then((r) => r.data.data),

  create: (payload: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Course>>('/courses', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<ApiResponse<Course>>(`/courses/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/courses/${id}`),
};
