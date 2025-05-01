import React from 'react';
import { Progress } from '../ui/progress';
import { usePasswordStrength } from '../../lib/hooks/usePasswordStrength';
import type { PasswordStrengthIndicatorProps } from './types';

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = usePasswordStrength(password);
  
  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Siła hasła:</span>
        <span className="text-xs font-medium">{strength.label}</span>
      </div>
      
      <Progress value={strength.score} className={`h-1 ${strength.color}`} />
      
      {strength.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
          {strength.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-1">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 