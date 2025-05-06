export interface AuthTabsProps {
  defaultTab?: "login" | "register";
}

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  'data-testid'?: string;
}

export interface PasswordInputProps extends InputFieldProps {
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
  validationErrors: Record<string, string>;
}

export type RegisterFormState = LoginFormState; 