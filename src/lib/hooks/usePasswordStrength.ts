import { useMemo } from 'react';

export interface PasswordStrength {
  score: number; // 0-100
  label: string; // "słabe", "średnie", "silne"
  color: string; // klasa Tailwind dla koloru
  suggestions: string[]; // sugestie poprawy
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: 'Brak',
        color: 'bg-gray-300',
        suggestions: []
      };
    }

    // Check length
    const lengthScore = Math.min(password.length / 12, 1) * 25;
    
    // Check for uppercase letters
    const hasUppercase = /[A-Z]/.test(password);
    
    // Check for lowercase letters
    const hasLowercase = /[a-z]/.test(password);
    
    // Check for numbers
    const hasNumbers = /[0-9]/.test(password);
    
    // Check for special characters
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    // Calculate variety score
    const varietyScore = (hasUppercase ? 25 : 0) + 
                         (hasLowercase ? 15 : 0) + 
                         (hasNumbers ? 25 : 0) + 
                         (hasSpecial ? 35 : 0);
    
    // Final score as percentage
    const finalScore = Math.min(Math.round((lengthScore + varietyScore) / 2), 100);
    
    // Determine label and color based on score
    let label, color;
    const suggestions = [];
    
    if (finalScore < 25) {
      label = 'Bardzo słabe';
      color = 'bg-red-500';
      suggestions.push('Hasło jest zbyt krótkie');
      if (!hasUppercase) suggestions.push('Dodaj wielkie litery');
      if (!hasNumbers) suggestions.push('Dodaj cyfry');
      if (!hasSpecial) suggestions.push('Dodaj znaki specjalne');
    } else if (finalScore < 50) {
      label = 'Słabe';
      color = 'bg-orange-500';
      if (!hasUppercase) suggestions.push('Dodaj wielkie litery');
      if (!hasNumbers) suggestions.push('Dodaj cyfry');
      if (!hasSpecial) suggestions.push('Dodaj znaki specjalne');
    } else if (finalScore < 75) {
      label = 'Dobre';
      color = 'bg-yellow-500';
      if (!hasSpecial) suggestions.push('Dodaj znaki specjalne dla większego bezpieczeństwa');
      if (password.length < 10) suggestions.push('Wydłuż hasło dla większego bezpieczeństwa');
    } else {
      label = 'Silne';
      color = 'bg-green-500';
    }
    
    return {
      score: finalScore,
      label,
      color,
      suggestions
    };
  }, [password]);
} 