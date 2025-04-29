import { useState, useCallback } from 'react';
import type { 
  GenerationStatusState, 
  GenerationViewModel, 
  FlashcardViewModel,
  EditFlashcardData
} from '../types/generateView';
import { GenerationStatusType } from '../types/generateView';
import type { GeneratedFlashcardDto } from '../../types';
import { FlashcardSource } from '../../types';

export const useGenerateFlashcards = () => {
  // Input text state
  const [inputText, setInputText] = useState<string>("");
  
  // Generation status state
  const [generationStatus, setGenerationStatus] = useState<GenerationStatusState>({ 
    status: GenerationStatusType.IDLE 
  });
  
  // Current generation state
  const [currentGeneration, setCurrentGeneration] = useState<GenerationViewModel | null>(null);
  
  // Editing flashcard state
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardViewModel | null>(null);

  // Generate flashcards function
  const generateFlashcards = useCallback(async (input: string) => {
    setGenerationStatus({ status: GenerationStatusType.GENERATING });
    try {
      // API call
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: input })
      });
      
      if (!response.ok) {
        throw new Error('Wystąpił błąd podczas generowania fiszek');
      }
      
      const data = await response.json();
      
      // Transform response to ViewModel
      const viewModel: GenerationViewModel = {
        id: data.generation_id,
        flashcards: data.flashcards.map((card: GeneratedFlashcardDto, index: number) => ({
          ...card,
          id: index,
          isEditing: false,
          isProcessing: false,
          status: 'pending'
        })),
        stats: {
          total: data.flashcards.length,
          accepted: 0,
          rejected: 0,
          pending: data.flashcards.length
        }
      };
      
      setCurrentGeneration(viewModel);
      setGenerationStatus({ status: GenerationStatusType.COMPLETED });
    } catch (error) {
      setGenerationStatus({ 
        status: GenerationStatusType.ERROR, 
        message: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas generowania fiszek." 
      });
    }
  }, []);

  // Accept flashcard function
  const acceptFlashcard = useCallback(async (flashcardId: number) => {
    if (!currentGeneration) return;
    
    // Find the flashcard to accept
    const flashcard = currentGeneration.flashcards.find(card => card.id === flashcardId);
    if (!flashcard) {
      console.error('Flashcard not found:', flashcardId);
      return;
    }
    
    // Update flashcard state to processing
    setCurrentGeneration(prev => {
      if (!prev) return null;
      
      const updatedFlashcards = prev.flashcards.map(card => {
        if (card.id === flashcardId) {
          return { ...card, isProcessing: true };
        }
        return card;
      });
      
      return { ...prev, flashcards: updatedFlashcards };
    });
    
    try {
      // API call with flashcard content
      const response = await fetch(`/api/generations/${currentGeneration.id}/flashcards/${flashcardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'accept',
          front: flashcard.front,
          back: flashcard.back
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept flashcard');
      }
      
      // Update state after success
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { 
              ...card, 
              isProcessing: false, 
              status: 'accepted' as const
            };
          }
          return card;
        });
        
        return { 
          ...prev, 
          flashcards: updatedFlashcards,
          stats: {
            ...prev.stats,
            accepted: prev.stats.accepted + 1,
            pending: prev.stats.pending - 1
          }
        };
      });
    } catch (error) {
      // Error handling
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { ...card, isProcessing: false };
          }
          return card;
        });
        
        return { ...prev, flashcards: updatedFlashcards };
      });
      
      console.error('Error accepting flashcard:', error);
    }
  }, [currentGeneration]);

  // Reject flashcard function
  const rejectFlashcard = useCallback(async (flashcardId: number) => {
    if (!currentGeneration) return;
    
    // Update flashcard state
    setCurrentGeneration(prev => {
      if (!prev) return null;
      
      const updatedFlashcards = prev.flashcards.map(card => {
        if (card.id === flashcardId) {
          return { ...card, isProcessing: true };
        }
        return card;
      });
      
      return { ...prev, flashcards: updatedFlashcards };
    });
    
    try {
      // API call
      const response = await fetch(`/api/generations/${currentGeneration.id}/flashcards/${flashcardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject flashcard');
      }
      
      // Update state after success
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { 
              ...card, 
              isProcessing: false, 
              status: 'rejected' as const
            };
          }
          return card;
        });
        
        return { 
          ...prev, 
          flashcards: updatedFlashcards,
          stats: {
            ...prev.stats,
            rejected: prev.stats.rejected + 1,
            pending: prev.stats.pending - 1
          }
        };
      });
    } catch (error) {
      // Error handling
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { ...card, isProcessing: false };
          }
          return card;
        });
        
        return { ...prev, flashcards: updatedFlashcards };
      });
      
      console.error('Error rejecting flashcard:', error);
    }
  }, [currentGeneration]);

  // Edit flashcard function
  const editFlashcard = useCallback((flashcardId: number) => {
    if (!currentGeneration) return;
    
    const flashcard = currentGeneration.flashcards.find(card => card.id === flashcardId);
    if (flashcard) {
      setEditingFlashcard(flashcard);
    }
  }, [currentGeneration]);

  // Cancel edit function
  const cancelEdit = useCallback(() => {
    setEditingFlashcard(null);
  }, []);

  // Save edited flashcard function
  const saveEditedFlashcard = useCallback(async (flashcardId: number, data: EditFlashcardData) => {
    if (!currentGeneration) return;
    
    // Update flashcard state
    setCurrentGeneration(prev => {
      if (!prev) return null;
      
      const updatedFlashcards = prev.flashcards.map(card => {
        if (card.id === flashcardId) {
          return { ...card, isProcessing: true };
        }
        return card;
      });
      
      return { ...prev, flashcards: updatedFlashcards };
    });
    
    try {
      // API call
      const response = await fetch(`/api/generations/${currentGeneration.id}/flashcards/${flashcardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'edit',
          front: data.front,
          back: data.back
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to edit flashcard');
      }
      
      // Update state after success
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { 
              ...card, 
              front: data.front,
              back: data.back,
              source: FlashcardSource.AI_EDITED,
              isProcessing: false 
            };
          }
          return card;
        });
        
        return { ...prev, flashcards: updatedFlashcards };
      });
      
      // Close edit modal
      setEditingFlashcard(null);
    } catch (error) {
      // Error handling
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { ...card, isProcessing: false };
          }
          return card;
        });
        
        return { ...prev, flashcards: updatedFlashcards };
      });
      
      console.error('Error editing flashcard:', error);
    }
  }, [currentGeneration]);

  return {
    inputText,
    setInputText,
    generationStatus,
    currentGeneration,
    editingFlashcard,
    generateFlashcards,
    acceptFlashcard,
    rejectFlashcard,
    editFlashcard,
    cancelEdit,
    saveEditedFlashcard
  };
}; 