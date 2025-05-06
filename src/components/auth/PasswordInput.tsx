import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import type { PasswordInputProps } from './types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function PasswordInput({
  id,
  name,
  value,
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  showStrengthIndicator = false,
  onChange,
  onBlur,
  'data-testid': dataTestId,
  ...restProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(error && "text-destructive")}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(error && "border-destructive")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          data-testid={dataTestId}
          {...restProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-[32px] h-10 w-10"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
          data-testid={`${dataTestId}-toggle`}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {showStrengthIndicator && typeof value === 'string' && value && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
} 