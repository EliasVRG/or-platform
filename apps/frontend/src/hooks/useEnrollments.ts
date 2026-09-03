import { useCallback, useEffect, useState } from 'react';
import { EnrollmentsService } from '../services/enrollments.service';
import type { Enrollment } from '../types';

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EnrollmentsService.findAll();
      setEnrollments(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const createEnrollment = async (payload: Parameters<typeof EnrollmentsService.create>[0]) => {
    const created = await EnrollmentsService.create(payload);
    setEnrollments((prev) => [...prev, created]);
    return created;
  };

  const updateEnrollment = async (id: string, payload: Parameters<typeof EnrollmentsService.update>[1]) => {
    const updated = await EnrollmentsService.update(id, payload);
    setEnrollments((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const removeEnrollment = async (id: string) => {
    await EnrollmentsService.remove(id);
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  const hardRemoveEnrollment = async (id: string) => {
    await EnrollmentsService.hardRemove(id);
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    enrollments,
    loading,
    error,
    refetch: fetchEnrollments,
    createEnrollment,
    updateEnrollment,
    removeEnrollment,
    hardRemoveEnrollment,
  };
}
