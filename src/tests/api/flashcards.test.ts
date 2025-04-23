/**
 * Testy integracyjne dla API fiszek
 *
 * Uwaga: Ten plik zawiera przykładową strukturę testów integracyjnych.
 * W rzeczywistym projekcie należy skonfigurować odpowiednio środowisko testowe
 * i zadbać o izolację testów od produkcyjnej bazy danych.
 */

import { expect, describe, it, beforeEach, afterEach } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { FlashcardSource } from '../../types';

// Konfiguracja testowa - w rzeczywistym projekcie powinna korzystać ze zmiennych środowiskowych
const supabaseUrl = process.env.SUPABASE_TEST_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_TEST_KEY || 'test-key';
const apiUrl = process.env.API_TEST_URL || 'http://localhost:4321/api';

// Klient Supabase do testów
const supabase = createClient(supabaseUrl, supabaseKey);

// Dane testowe
let testUserId: string;
let testAuthToken: string;
let createdFlashcardIds: number[] = [];

// Helper do czyszczenia danych po testach
async function cleanupTestData() {
  if (createdFlashcardIds.length > 0) {
    await supabase
      .from('flashcards')
      .delete()
      .in('id', createdFlashcardIds);
    createdFlashcardIds = [];
  }
}

// Helper do tworzenia tymczasowego użytkownika testowego
async function createTestUser() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'test-password-123';
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  
  testUserId = data.user!.id;
  
  // Logowanie aby uzyskać token
  const { data: authData } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  testAuthToken = authData.session!.access_token;
}

// Helper do usuwania użytkownika testowego
async function removeTestUser() {
  if (testUserId) {
    // W rzeczywistym projekcie potrzebna byłaby funkcja admina do usunięcia użytkownika
    await supabase.auth.admin.deleteUser(testUserId);
  }
}

describe('Flashcards API', () => {
  beforeEach(async () => {
    await createTestUser();
  });
  
  afterEach(async () => {
    await cleanupTestData();
    await removeTestUser();
  });
  
  describe('POST /api/flashcards', () => {
    it('should create a new flashcard', async () => {
      const flashcardData = {
        front: 'Test question',
        back: 'Test answer',
        source: FlashcardSource.MANUAL
      };
      
      const response = await fetch(`${apiUrl}/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testAuthToken}`
        },
        body: JSON.stringify(flashcardData)
      });
      
      expect(response.status).toBe(201);
      
      const flashcard = await response.json();
      createdFlashcardIds.push(flashcard.id);
      
      expect(flashcard).toEqual(expect.objectContaining({
        id: expect.any(Number),
        front: flashcardData.front,
        back: flashcardData.back,
        user_id: testUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
    });
    
    it('should return 400 for invalid flashcard data', async () => {
      const invalidData = {
        front: 'a'.repeat(201), // Przekracza limit 200 znaków
        back: 'Test answer',
        source: FlashcardSource.MANUAL
      };
      
      const response = await fetch(`${apiUrl}/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testAuthToken}`
        },
        body: JSON.stringify(invalidData)
      });
      
      expect(response.status).toBe(400);
      
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
    
    it('should return 401 when not authenticated', async () => {
      const flashcardData = {
        front: 'Test question',
        back: 'Test answer',
        source: FlashcardSource.MANUAL
      };
      
      const response = await fetch(`${apiUrl}/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Brak tokenu autoryzacji
        },
        body: JSON.stringify(flashcardData)
      });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/flashcards', () => {
    beforeEach(async () => {
      // Przygotowanie danych testowych - dodanie kilku fiszek
      const flashcards = [
        {
          front: 'Question 1',
          back: 'Answer 1',
          source: FlashcardSource.MANUAL,
          user_id: testUserId
        },
        {
          front: 'Question 2',
          back: 'Answer 2',
          source: FlashcardSource.AI_FULL,
          user_id: testUserId
        },
        {
          front: 'Question 3',
          back: 'Answer 3',
          source: FlashcardSource.AI_EDITED,
          user_id: testUserId
        }
      ];
      
      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcards)
        .select();
      
      if (error) throw error;
      createdFlashcardIds = data.map(f => f.id);
    });
    
    it('should retrieve flashcards with default pagination', async () => {
      const response = await fetch(`${apiUrl}/flashcards`, {
        headers: {
          'Authorization': `Bearer ${testAuthToken}`
        }
      });
      
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result).toHaveProperty('flashcards');
      expect(result).toHaveProperty('pagination');
      expect(result.flashcards.length).toBe(3);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 3
      });
    });
    
    it('should filter flashcards by source', async () => {
      const response = await fetch(`${apiUrl}/flashcards?filter[source]=manual`, {
        headers: {
          'Authorization': `Bearer ${testAuthToken}`
        }
      });
      
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.flashcards.length).toBe(1);
      expect(result.flashcards[0].source).toBe(FlashcardSource.MANUAL);
    });
    
    it('should paginate results correctly', async () => {
      const response = await fetch(`${apiUrl}/flashcards?page=1&limit=2`, {
        headers: {
          'Authorization': `Bearer ${testAuthToken}`
        }
      });
      
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.flashcards.length).toBe(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3
      });
    });
    
    it('should sort flashcards by specified field', async () => {
      const response = await fetch(`${apiUrl}/flashcards?sort_by=front`, {
        headers: {
          'Authorization': `Bearer ${testAuthToken}`
        }
      });
      
      expect(response.status).toBe(200);
      
      const result = await response.json();
      // Sprawdzenie kolejności sortowania
      const fronts = result.flashcards.map(f => f.front);
      const sortedFronts = [...fronts].sort();
      expect(fronts).toEqual(sortedFronts);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await fetch(`${apiUrl}/flashcards`);
      expect(response.status).toBe(401);
    });
  });
}); 