import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import type { PasswordInputProps } from './types';

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
  onBlur
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <InputField
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          label={label}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-[32px]"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {showStrengthIndicator && value && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
} 