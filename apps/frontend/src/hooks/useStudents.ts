import { useCallback, useEffect, useState } from 'react';
import { StudentsService } from '../services/students.service';
import type { Student } from '../types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StudentsService.findAll();
      setStudents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = async (payload: Parameters<typeof StudentsService.create>[0]) => {
    const created = await StudentsService.create(payload);
    setStudents((prev) => [...prev, created]);
    return created;
  };

  const updateStudent = async (id: string, payload: Parameters<typeof StudentsService.update>[1]) => {
    const updated = await StudentsService.update(id, payload);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const removeStudent = async (id: string) => {
    await StudentsService.remove(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    removeStudent,
  };
}
