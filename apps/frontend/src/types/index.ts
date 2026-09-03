export type CourseStatus = 'active' | 'inactive';
export type StudentStatus = 'active' | 'inactive';
export type EnrollmentStatus = 'pending' | 'active' | 'canceled' | 'completed';

export interface Course {
  id: string;
  name: string;
  description?: string;
  hours: number;
  price: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  student?: Student;
  course?: Course;
  status: EnrollmentStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}
