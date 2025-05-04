export interface AuthTabsProps {
  defaultTab?: "login" | "register";
}

export interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  'data-test-id'?: string;
}

export interface PasswordInputProps extends Omit<InputFieldProps, 'type'> {
  showStrengthIndicator?: boolean;
}

export interface FormErrorMessageProps {
  error: string | null;
}

export interface PasswordStrengthIndicatorProps {
  password: string;
}

export interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  validationErrors: {
    email?: string;
    password?: string;
  };
}

export interface RegisterFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  validationErrors: {
    email?: string;
    password?: string;
  };
} 