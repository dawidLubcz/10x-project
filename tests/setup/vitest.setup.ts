import '@testing-library/jest-dom';
// Polyfill TextEncoder/TextDecoder for esbuild in Vitest environment
import { Buffer } from 'buffer';

// Use Buffer to polyfill TextEncoder/Decoder such that encode returns global Uint8Array
global.TextEncoder = class {
  encode(input: string): Uint8Array {
    return Uint8Array.from(Buffer.from(input, 'utf-8'));
  }
} as any;

global.TextDecoder = class {
  decode(input: Uint8Array | ArrayBuffer): string {
    const buffer = Buffer.from(input as any);
    return buffer.toString('utf-8');
  }
} as any;

import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';

// Configure any global mocks or settings
// This file runs before each test suite

// Example of MSW setup for API mocking
// const server = setupServer(/* Your request handlers */);

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close()); 