import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from './types';

/**
 * Komponent paginacji do nawigowania po stronach
 */
export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  // Obliczanie liczby stron
  const totalPages = useMemo(() => {
    return Math.ceil(pagination.total / pagination.limit);
  }, [pagination.total, pagination.limit]);

  // Generowanie tablicy stron do wyświetlenia
  const pages = useMemo(() => {
    // Zawsze pokazuj pierwszą i ostatnią stronę
    // Dla aktualnej strony pokazuj 1 stronę przed i 1 po (jeśli istnieją)
    // Jeśli między blokami stron jest przerwa, dodaj separator "..."
    
    const currentPage = pagination.page;
    const items: (number | 'separator')[] = [];
    
    if (totalPages <= 7) {
      // Jeśli jest mniej niż 7 stron, pokaż wszystkie
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Zawsze pokazuj stronę 1
      items.push(1);
      
      // Jeśli aktualna strona jest blisko początku
      if (currentPage <= 3) {
        items.push(2, 3, 4, 'separator', totalPages);
      } 
      // Jeśli aktualna strona jest blisko końca
      else if (currentPage >= totalPages - 2) {
        items.push('separator', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } 
      // Jeśli aktualna strona jest w środku
      else {
        items.push('separator', currentPage - 1, currentPage, currentPage + 1, 'separator', totalPages);
      }
    }
    
    return items;
  }, [pagination.page, totalPages]);

  // Przejście do poprzedniej strony
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };

  // Przejście do następnej strony
  const handleNextPage = () => {
    if (pagination.page < totalPages) {
      onPageChange(pagination.page + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Przycisk Poprzednia strona */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevPage}
        disabled={pagination.page === 1}
        aria-label="Poprzednia strona"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Numery stron */}
      {pages.map((page, index) => {
        if (page === 'separator') {
          return (
            <div key={`separator-${index}`} className="px-3 py-1.5 text-sm text-muted-foreground">
              ...
            </div>
          );
        }
        
        return (
          <Button
            key={page}
            variant={pagination.page === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            className="w-9 h-9"
          >
            {page}
          </Button>
        );
      })}
      
      {/* Przycisk Następna strona */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={pagination.page === totalPages}
        aria-label="Następna strona"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}; 