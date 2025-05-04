import React from 'react';
import { Button } from '../ui/button';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { FormErrorMessage } from './FormErrorMessage';
import { useForm } from '../../lib/hooks/useForm';
import { useAuth } from '../../lib/hooks/useAuth';
import type { LoginFormState } from './types';
import { loginSchema } from '../../lib/schemas/login.schema';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const initialState: LoginFormState = {
    email: '',
    password: '',
    isLoading: false,
    error: null,
    validationErrors: {}
  };
  
  const { values, errors, isSubmitting, setIsSubmitting, handleChange, setErrors } = useForm<LoginFormState>(initialState);
  const { login, error: authError, loading } = useAuth();
  
  const validators = {
    email: (value: string) => {
      try {
        loginSchema.shape.email.parse(value);
        return null;
      } catch (error: any) {
        return error.errors?.[0]?.message || 'Niepoprawny format adresu email';
      }
    },
    password: (value: string) => {
      try {
        loginSchema.shape.password.parse(value);
        return null;
      } catch (error: any) {
        return error.errors?.[0]?.message || 'Hasło jest wymagane';
      }
    }
  };
  
  const onSubmitForm = async (formValues: LoginFormState) => {
    setIsSubmitting(true);
    try {
      const result = await login({
        email: formValues.email,
        password: formValues.password
      });
      
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validators.email(values.email);
    const passwordError = validators.password(values.password);
    
    const newErrors: Partial<Record<keyof LoginFormState, string>> = {};
    
    if (emailError) {
      newErrors.email = emailError;
    }
    
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    setErrors(newErrors);
    
    if (!emailError && !passwordError) {
      onSubmitForm(values);
    }
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4" data-testid="login-form">
      <FormErrorMessage error={authError} />
      
      <InputField
        id="login-email"
        name="email"
        type="email"
        value={values.email}
        label="Email"
        placeholder="twoj@email.com"
        error={errors.email}
        required
        onChange={handleChange}
        data-testid="login-email-input"
      />
      
      <PasswordInput
        id="login-password"
        name="password"
        value={values.password}
        label="Hasło"
        placeholder="Twoje hasło"
        error={errors.password}
        required
        onChange={handleChange}
        data-testid="login-password-input"
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || loading}
        data-testid="login-submit-button"
      >
        {isSubmitting || loading ? 'Logowanie...' : 'Zaloguj się'}
      </Button>
    </form>
  );
} 