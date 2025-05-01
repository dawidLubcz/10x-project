import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const validate = useCallback((validators: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    for (const field in validators) {
      const error = validators[field](values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [values]);
  
  const handleSubmit = useCallback((validators: Record<keyof T, (value: any) => string | null>, onSubmit: (values: T) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      
      if (validate(validators)) {
        await onSubmit(values);
      }
      
      setIsSubmitting(false);
    };
  }, [isSubmitting, validate, values]);
  
  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit,
    reset,
    setValues,
    setErrors,
    setIsSubmitting
  };
} 