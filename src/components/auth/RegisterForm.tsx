import React from 'react';
import { Button } from '../ui/button';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { FormErrorMessage } from './FormErrorMessage';
import { useForm } from '../../lib/hooks/useForm';
import { useAuth } from '../../lib/hooks/useAuth';
import type { RegisterFormState } from './types';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const initialState: RegisterFormState = {
    email: '',
    password: '',
    isLoading: false,
    error: null,
    validationErrors: {}
  };
  
  const { values, errors, isSubmitting, setIsSubmitting, handleChange, handleSubmit, setErrors } = useForm<RegisterFormState>(initialState);
  const { register, error: authError, loading } = useAuth();
  
  const validators = {
    email: (value: string) => {
      if (!value) return 'Email jest wymagany';
      if (!value.includes('@')) return 'Niepoprawny format adresu email';
      return null;
    },
    password: (value: string) => {
      if (!value) return 'Hasło jest wymagane';
      if (value.length < 8) return 'Hasło musi mieć co najmniej 8 znaków';
      return null;
    }
  };
  
  const onSubmitForm = async (formValues: RegisterFormState) => {
    setIsSubmitting(true);
    try {
      const result = await register({
        email: formValues.email,
        password: formValues.password
      });
      
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja formularza
    const emailError = validators.email(values.email);
    const passwordError = validators.password(values.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }
    
    // Jeśli walidacja przeszła pomyślnie, wysyłamy formularz
    onSubmitForm(values);
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4" data-test-id="register-form">
      <FormErrorMessage error={authError} />
      
      <InputField
        id="register-email"
        name="email"
        type="email"
        value={values.email}
        label="Email"
        placeholder="twoj@email.com"
        error={errors.email}
        required
        onChange={handleChange}
        data-test-id="register-email-input"
      />
      
      <PasswordInput
        id="register-password"
        name="password"
        value={values.password}
        label="Hasło"
        placeholder="Twoje hasło"
        error={errors.password}
        required
        showStrengthIndicator={true}
        onChange={handleChange}
        data-test-id="register-password-input"
      />
      
      <div className="text-sm text-muted-foreground">
        <p>Hasło musi mieć co najmniej 8 znaków.</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || loading}
        data-test-id="register-submit-button"
      >
        {isSubmitting || loading ? 'Rejestracja...' : 'Zarejestruj się'}
      </Button>
    </form>
  );
} 