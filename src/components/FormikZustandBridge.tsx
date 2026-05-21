'use client';

import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useFormStore } from '@/stores/form-store';

/**
 * Syncs Formik validation state into the Zustand form store so any
 * component can read live errors and touched state.
 */
export function FormikZustandBridge() {
  const { errors, touched, isSubmitting, isValidating } = useFormikContext();
  const setErrors = useFormStore((s) => s.setErrors);
  const setTouched = useFormStore((s) => s.setTouched);
  const setIsSubmitting = useFormStore((s) => s.setIsSubmitting);
  const setIsValidating = useFormStore((s) => s.setIsValidating);

  useEffect(() => {
    const formatted: Record<string, string> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formatted[key] = value;
      }
    });
    setErrors(formatted);
  }, [errors, setErrors]);

  useEffect(() => {
    setTouched(touched as Record<string, boolean>);
  }, [touched, setTouched]);

  useEffect(() => {
    setIsSubmitting(isSubmitting);
  }, [isSubmitting, setIsSubmitting]);

  useEffect(() => {
    setIsValidating(isValidating);
  }, [isValidating, setIsValidating]);

  return null;
}
