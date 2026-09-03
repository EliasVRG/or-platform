import { useCallback, useEffect, useState } from 'react';
import { CoursesService } from '../services/courses.service';
import type { Course } from '../types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CoursesService.findAll();
      setCourses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (payload: Parameters<typeof CoursesService.create>[0]) => {
    const created = await CoursesService.create(payload);
    setCourses((prev) => [...prev, created]);
    return created;
  };

  const updateCourse = async (id: string, payload: Parameters<typeof CoursesService.update>[1]) => {
    const updated = await CoursesService.update(id, payload);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const removeCourse = async (id: string) => {
    await CoursesService.remove(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const hardRemoveCourse = async (id: string) => {
    await CoursesService.hardRemove(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    removeCourse,
    hardRemoveCourse,
  };
}
