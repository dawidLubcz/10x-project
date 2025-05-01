import React from 'react';
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from 'lucide-react';
import type { FormErrorMessageProps } from './types';

export function FormErrorMessage({ error }: FormErrorMessageProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon className="h-4 w-4 mr-2" />
      <AlertTitle>{error}</AlertTitle>
    </Alert>
  );
} 