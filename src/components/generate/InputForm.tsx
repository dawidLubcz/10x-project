import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { InputFormData } from '../types/generateView';

interface InputFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: (data: InputFormData) => void;
  isGenerating: boolean;
}

export const InputForm = ({
  inputText,
  setInputText,
  onSubmit,
  isGenerating
}: InputFormProps) => {
  const MAX_LENGTH = 10000;
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate input text whenever it changes
  useEffect(() => {
    if (inputText.length === 0) {
      setIsValid(false);
      setError('Tekst nie może być pusty');
    } else if (inputText.length > MAX_LENGTH) {
      setIsValid(false);
      setError(`Tekst nie może przekraczać ${MAX_LENGTH} znaków`);
    } else {
      setIsValid(true);
      setError(null);
    }
  }, [inputText]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isValid && !isGenerating) {
      onSubmit({ inputText });
    }
  }, [isValid, isGenerating, inputText, onSubmit]);

  const charsRemaining = MAX_LENGTH - inputText.length;
  const isOverLimit = charsRemaining < 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-7xl mx-auto p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Wprowadź tekst źródłowy</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {charsRemaining} znaków pozostało
            </span>
          </div>
          
          <Textarea
            id="inputText"
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
            placeholder="Wprowadź tekst do wygenerowania fiszek (maks. 10000 znaków)"
            className={`min-h-36 w-full rounded-md border ${isOverLimit ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 dark:border-gray-600'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            disabled={isGenerating}
          />
          
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={!isValid || isGenerating}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:pointer-events-none"
        >
          {isGenerating ? 'Generowanie...' : 'Generuj fiszki'}
        </Button>
      </div>
    </form>
  );
}; 