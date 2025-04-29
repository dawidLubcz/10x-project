import React, { useCallback, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { FlashcardFiltersProps } from './types';
import type { FlashcardSource } from '../../types';

/**
 * Komponent do filtrowania i sortowania fiszek
 */
export const FlashcardFilters: React.FC<FlashcardFiltersProps> = ({
  currentFilters,
  onFilterChange,
}) => {
  // Opcje źródeł fiszek
  const sourceOptions = [
    { value: '', label: 'Wszystkie' },
    { value: 'manual', label: 'Ręcznie utworzone' },
    { value: 'ai-full', label: 'Wygenerowane przez AI' },
    { value: 'ai-edited', label: 'Edytowane przez AI' }
  ];

  // Opcje sortowania
  const sortOptions = [
    { value: 'created_at', label: 'Data utworzenia' },
    { value: 'updated_at', label: 'Data aktualizacji' },
    { value: 'front', label: 'Pytanie (A-Z)' }
  ];

  // Logging current filters for debugging
  useEffect(() => {
    console.log('Current filters:', currentFilters);
  }, [currentFilters]);

  // Obsługa zmiany filtra źródła
  const handleSourceChange = useCallback((value: string) => {
    console.log('Source changed to:', value);
    onFilterChange({
      filter: value ? { source: value as FlashcardSource } : undefined
    });
  }, [onFilterChange]);

  // Obsługa zmiany sortowania
  const handleSortChange = useCallback((value: string) => {
    console.log('Sort changed to:', value);
    // Use type assertion to handle the sort_by type
    onFilterChange({ sort_by: value as 'created_at' | 'updated_at' | 'front' });
  }, [onFilterChange]);

  // Resetowanie wszystkich filtrów
  const handleResetFilters = useCallback(() => {
    console.log('Resetting filters');
    onFilterChange({
      filter: undefined,
      sort_by: 'created_at'
    });
  }, [onFilterChange]);

  const hasActiveFilters = !!(
    currentFilters.filter?.source || 
    (currentFilters.sort_by && currentFilters.sort_by !== 'created_at')
  );

  // Get the label for the current source filter
  const getSourceLabel = () => {
    const selectedSource = sourceOptions.find(option => option.value === currentFilters.filter?.source);
    return selectedSource ? selectedSource.label : 'Źródło fiszek';
  };

  // Get the label for the current sort option
  const getSortLabel = () => {
    const selectedSort = sortOptions.find(option => option.value === currentFilters.sort_by);
    return selectedSort ? selectedSort.label : 'Sortuj wg';
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex flex-wrap gap-3">
        {/* Filtr źródła */}
        <div>
          <Select
            value={currentFilters.filter?.source || ''}
            onValueChange={handleSourceChange}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Źródło fiszek">
                {getSourceLabel()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sortowanie */}
        <div>
          <Select
            value={currentFilters.sort_by || 'created_at'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sortuj wg">
                {getSortLabel()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Przycisk resetowania filtrów */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="h-9 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          Resetuj filtry
        </Button>
      )}
    </div>
  );
}; 