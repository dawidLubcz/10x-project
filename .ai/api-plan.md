# REST API Plan

## 1. Resources

- **Users** (Table: `users`)
- **Flashcards** (Table: `flashcards`)
- **Generations** (Table: `generations`)
- **Generation Error Logs** (Table: `generation_error_logs`)

## 2. Endpoints

### 2.1 Users

#### 2.1.1 Register a New User
- **HTTP Method:** POST
- **URL:** `/api/users/register`
- **Description:** Create a new user account.
- **Request JSON:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": "UUID",
    "email": "string",
    "created_at": "timestamp"
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request (validation errors)
  - 409 Conflict (email already exists)

#### 2.1.2 Login
- **HTTP Method:** POST
- **URL:** `/api/users/login`
- **Description:** Authenticate a user and return a JWT token.
- **Request JSON:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response JSON:**
  ```json
  {
    "token": "JWT token",
    "user": {
      "id": "UUID",
      "email": "string"
    }
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 400 Bad Request
  - 401 Unauthorized

#### 2.1.3 Get User Profile
- **HTTP Method:** GET
- **URL:** `/api/users/profile`
- **Description:** Retrieve the authenticated user's profile details.
- **Response JSON:**
  ```json
  {
    "id": "UUID",
    "email": "string",
    "created_at": "timestamp"
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 401 Unauthorized

### 2.2 Flashcards

#### 2.2.1 Create a Flashcard (Manual Entry)
- **HTTP Method:** POST
- **URL:** `/api/flashcards`
- **Description:** Manually create a new flashcard.
- **Request JSON:**
  ```json
  {
    "front": "string (max 200 characters)",
    "back": "string (max 500 characters)",
    "source": "manual"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": "number",
    "front": "string",
    "back": "string",
    "user_id": "UUID",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request (validation failure)
  - 401 Unauthorized

#### 2.2.2 List Flashcards
- **HTTP Method:** GET
- **URL:** `/api/flashcards`
- **Description:** Retrieve a list of flashcards for the authenticated user.
- **Query Parameters:**
  - `page`: number (optional, for pagination)
  - `limit`: number (optional, for pagination)
  - `sort_by`: field name (optional)
  - `filter[source]`: string (optional, e.g., 'manual', 'ai-full', 'ai-edited')
- **Response JSON:**
  ```json
  {
    "flashcards": [
      {
        "id": "number",
        "front": "string",
        "back": "string",
        "user_id": "UUID",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
      // ... more flashcards
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 401 Unauthorized

#### 2.2.3 Get a Single Flashcard
- **HTTP Method:** GET
- **URL:** `/api/flashcards/{id}`
- **Description:** Retrieve details of a specific flashcard by its ID.
- **Response JSON:**
  ```json
  {
    "id": "number",
    "front": "string",
    "back": "string",
    "user_id": "UUID",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 404 Not Found
  - 401 Unauthorized

#### 2.2.4 Update a Flashcard
- **HTTP Method:** PUT/PATCH
- **URL:** `/api/flashcards/{id}`
- **Description:** Edit an existing flashcard (both manual or AI-generated once accepted/edited).
- **Request JSON:** (fields to update)
  ```json
  {
    "front": "string (max 200 characters, optional)",
    "back": "string (max 500 characters, optional)"
  }
  ```
- **Response JSON:** Updated flashcard object (same as GET single flashcard)
- **Success Code:** 200 OK
- **Error Codes:**
  - 400 Bad Request (validation failure)
  - 401 Unauthorized
  - 404 Not Found

#### 2.2.5 Delete a Flashcard
- **HTTP Method:** DELETE
- **URL:** `/api/flashcards/{id}`
- **Description:** Delete a flashcard owned by the authenticated user.
- **Success Code:** 204 No Content
- **Error Codes:**
  - 401 Unauthorized
  - 404 Not Found

### 2.3 Generations (AI-Generated Flashcards)

#### 2.3.1 Initiate Flashcard Generation via AI
- **HTTP Method:** POST
- **URL:** `/api/generations`
- **Description:** Submit text (up to 100 characters) to generate flashcards using AI. The endpoint validates input length and returns generated flashcards for review.
- **Request JSON:**
  ```json
  {
    "inputText": "string (max 100 characters)"
  }
  ```
- **Response JSON:**
  ```json
  {
    "generationId": "number",
    "flashcards": [
      {
        "front": "string (max 1000 characters)",
        "back": "string (max 1000 characters)",
        "source": "ai-full"  // or "ai-edited" if later modified
      }
    ]
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request (input too long or other validation issues)
  - 401 Unauthorized

#### 2.3.2 Accept, Edit, or Reject Generated Flashcards
- **HTTP Method:** PATCH
- **URL:** `/api/generations/{generationId}/flashcards/{flashcardId}`
- **Description:** Update the status of an AI-generated flashcard. The user can accept, edit, or reject the flashcard.
- **Request JSON:**
  ```json
  {
    "action": "accept" | "reject" | "edit",
    "front": "string (optional, for edit)",
    "back": "string (optional, for edit)"
  }
  ```
- **Response JSON:** Updated flashcard object if accepted/edited, or a confirmation message if rejected.
- **Success Code:** 200 OK
- **Error Codes:**
  - 400 Bad Request
  - 401 Unauthorized
  - 404 Not Found

### 2.4 Generation Error Logs

#### 2.4.1 Log Generation Error
- **HTTP Method:** POST
- **URL:** `/api/generations/errors`
- **Description:** Record an error encountered during flashcard generation via AI.
- **Request JSON:**
  ```json
  {
    "model": "string",
    "source_text_hash": "string",
    "source_text_length": number,
    "error_code": "string",
    "error_message": "string"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": "number",
    "created_at": "timestamp"
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request
  - 401 Unauthorized

## 3. Authentication and Authorization

- **Mechanism:** JWT-based authentication.
- **Implementation Details:**
  - Clients must include an `Authorization` header with the bearer token on protected endpoints.
  - Endpoints verify that the `user_id` in the request matches the ID from the JWT payload.
  - Additional protection via row-level security is enforced in the database (e.g., `auth.uid() = user_id`).

## 4. Validation and Business Logic

- **Input Validation:**
  - For user registration: Validate email format and enforce password strength.
  - For flashcards: Enforce that `front` does not exceed 200 characters and `back` does not exceed 500 characters.
  - For generations: Ensure input text is no more than 100 characters and generated flashcards do not exceed 1000 characters per field.
- **Business Logic Implementation:**
  - AI-generated flashcards are initially held in a pending state for user review. Users can accept, edit, or reject them.
  - Once accepted, flashcards become part of the user's permanent collection.
  - The generation endpoint updates counts in the `generations` record, including total generated and accepted (unedited vs. edited) flashcards.
  - Endpoints support pagination, filtering, and sorting for list operations.

## 5. Security and Performance Considerations

- **Security:**
  - Enforce JWT authentication on sensitive endpoints.
  - Utilize row-level security in the database to ensure users can only access their own data.
  - Validate all incoming data on the server-side to prevent injection and malformed data issues.
  - Implement rate limiting to prevent abuse of the generation endpoint due to potentially expensive AI calls.
- **Performance:**
  - Use pagination and filtering for list endpoints to avoid sending excessively large payloads.
  - Leverage database indexes (e.g., on `user_id` and `created_at`) for efficient querying.
  - Cache frequently requested data where appropriate.

## Assumptions

- The API design assumes that the frontend client (built with Astro/React) will handle UI rendering and error display.
- There is an underlying middleware that extracts and validates JWT tokens before reaching these endpoints.
- AI processing is handled by an external service and integrated through the backend generation endpoint.
- All timestamps are in ISO 8601 format. 