import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { InputFieldProps } from './types';
import { cn } from "@/lib/utils";

export function InputField({
  id,
  name,
  type,
  value,
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  onChange,
  onBlur,
  'data-testid': dataTestId
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
      <Input
        id={id}
        name={name}
        type={type}
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
      />
    </div>
  );
} 