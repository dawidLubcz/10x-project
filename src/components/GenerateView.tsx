import { useState } from 'react';
import { InputForm } from './generate/InputForm';
import { GenerationStatus } from './generate/GenerationStatus';
import { FlashcardList } from './generate/FlashcardList';
import { EditFlashcardModal } from './generate/EditFlashcardModal';
import { useGenerateFlashcards } from './hooks/useGenerateFlashcards';
import type { FlashcardViewModel, EditFlashcardData } from './types/generateView';

export const GenerateView = () => {
  const {
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
  } = useGenerateFlashcards();

  const handleInputSubmit = (data: { inputText: string }) => {
    generateFlashcards(data.inputText);
  };

  const handleEditSave = (data: EditFlashcardData) => {
    if (editingFlashcard) {
      saveEditedFlashcard(editingFlashcard.id, data);
    }
  };

  return (
    <div className="space-y-8">
      <InputForm 
        inputText={inputText} 
        setInputText={setInputText} 
        onSubmit={handleInputSubmit} 
        isGenerating={generationStatus.status === 'generating'} 
      />
      
      <GenerationStatus 
        status={generationStatus.status} 
        message={generationStatus.message} 
      />
      
      {currentGeneration && (
        <FlashcardList 
          generation={currentGeneration} 
          onAccept={acceptFlashcard} 
          onReject={rejectFlashcard} 
          onEdit={editFlashcard} 
        />
      )}
      
      <EditFlashcardModal 
        flashcard={editingFlashcard} 
        isOpen={!!editingFlashcard} 
        onClose={cancelEdit} 
        onSave={handleEditSave} 
      />
    </div>
  );
}; 