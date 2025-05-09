# 10xProject
# A training project completed as part of the 10xDevs course: https://www.10xdevs.pl/

![Version](https://img.shields.io/badge/version-0.0.1-blue)

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Testing](#testing)
- [Project Status](#project-status)
- [License](#license)

## Overview

10xProject is a web application that enables users to quickly create high-quality educational flashcards using artificial intelligence. The application solves the time-consuming problem of manually creating flashcards, which often discourages users from using the effective spaced repetition learning method.

### Key Features
- AI-powered flashcard generation based on input text
- Manual flashcard creation
- Flashcard management (viewing, editing, deleting)
- User account system for storing flashcards
- Integration with spaced repetition algorithm

### Target Audience
- Students from various fields
- Professionals seeking effective tools for learning and development

## Tech Stack

### Frontend
- [Astro 5](https://astro.build/) for fast, efficient page rendering with minimal JavaScript
- [React 19](https://react.dev/) for interactive components
- [TypeScript 5](https://www.typescriptlang.org/) for static typing
- [Tailwind 4](https://tailwindcss.com/) for styling
- [Shadcn/ui](https://ui.shadcn.com/) for accessible React components

### Backend
- [Supabase](https://supabase.com/) as a comprehensive backend solution:
  - PostgreSQL database
  - Built-in user authentication
  - SDKs in multiple languages (Backend-as-a-Service)

### AI
- [Openrouter.ai](https://openrouter.ai/) for communication with AI models:
  - Access to a wide range of models (OpenAI, Anthropic, Google, etc.)
  - Financial limits on API keys

### Testing
- [Vitest](https://vitest.dev/) for unit and integration testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for React components testing
- [Playwright](https://playwright.dev/) for end-to-end testing
- [MSW](https://mswjs.io/) (Mock Service Worker) for API mocking

### CI/CD & Hosting
- GitHub Actions for CI/CD pipelines
- DigitalOcean for application hosting via Docker image

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) version 22.14.0
- npm or yarn package manager

### Installation

1. Clone the repository and go to the directory

2. Use the correct Node.js version
```bash
nvm use
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` (default Astro port)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Lint the codebase using ESLint
- `npm run lint:fix` - Lint and fix issues automatically
- `npm run format` - Format code using Prettier
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Project Scope

### MVP Features
- AI-powered flashcard generation (up to 100 characters of input text)
- Manual flashcard creation and management
- User authentication system

### Limitations
- Polish language only for generated flashcards
- Flashcard format: question and answer only
- Maximum 1000 characters for input text
- Maximum 10000 characters per flashcard
- Data stored in Supabase (user accounts and flashcards)

## Testing

### Testing Strategy
The project implements a comprehensive testing approach including:

- **Unit Tests**: Verifying the correctness of individual components, functions, and classes using Vitest and React Testing Library
- **Integration Tests**: Checking interactions between different modules of the application
- **API Tests**: Validating endpoints and their responses
- **E2E Tests**: Testing complete user flows from end to end with Playwright
- **UI/UX Tests**: Ensuring proper functioning of the user interface and user experience

### Running Tests
- Run unit tests: `npm run test`
- Run end-to-end tests: `npm run test:e2e`
- Check test coverage: `npm run test:coverage`

## Project Status

This project is currently in early development stage.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
