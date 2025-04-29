import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { GenerationStatusType } from '../types/generateView';

interface GenerationStatusProps {
  status: GenerationStatusType;
  message?: string;
}

export const GenerationStatus = ({ status, message }: GenerationStatusProps) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'generating') {
    return (
      <div className="max-w-7xl mx-auto p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Generowanie fiszek...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-7xl mx-auto p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300">
            {message || 'Wystąpił błąd podczas generowania fiszek. Spróbuj ponownie.'}
          </span>
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="max-w-7xl mx-auto p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-3 flex-shrink-0" />
          <span className="text-green-700 dark:text-green-300">
            Fiszki zostały wygenerowane. Możesz teraz przejrzeć je poniżej.
          </span>
        </div>
      </div>
    );
  }

  return null;
}; 