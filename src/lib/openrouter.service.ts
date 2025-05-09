import { z } from 'zod';

type FetchResponse = Response;

// Types and interfaces
export type MessageRole = 'system' | 'user';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: unknown;
  };
}

export interface ChatResponse {
  content: string;
  structured: unknown;
  model?: string;
}

// Define a type for the raw API response structure
export interface ApiRawResponse {
  choices?: { message?: { content?: unknown } }[];
  model?: string;
  [key: string]: unknown;
}

export interface OpenRouterOptions {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultParams?: Record<string, unknown>;
}

// Custom error classes
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message = 'Response validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServerError extends OpenRouterError {
  constructor(message = 'Server error occurred') {
    super(message);
    this.name = 'ServerError';
  }
}

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private model: string;
  private params: Record<string, unknown>;
  private readonly headers: HeadersInit;

  constructor(options: OpenRouterOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://openrouter.ai/api/v1';
    this.model = options.defaultModel || 'qwen/qwen3-1.7b:free';
    this.params = options.defaultParams || {};
    
    // Get the hostname dynamically if possible
    const hostname = typeof self !== 'undefined' && self.location 
      ? self.location.hostname 
      : 'pages.dev';
    
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': `https://${hostname}/`,
      'X-Title': '10xProject',
      'User-Agent': '10xProject/1.0'
    };
  }

  public setModel(model: string): void {
    this.model = model;
  }

  public setParams(params: Record<string, unknown>): void {
    this.params = params;
  }

  private buildPayload(
    messages: ChatMessage[],
    options?: {
      model?: string;
      params?: Record<string, unknown>;
      responseFormat?: ResponseFormat;
    }
  ): Record<string, unknown> {
    return {
      messages,
      model: options?.model || this.model,
      ...this.params,
      ...options?.params,
      response_format: options?.responseFormat,
    };
  }

  private validateResponse(raw: unknown, format?: ResponseFormat): boolean {
    if (!format) return true;

    try {
      // Simplified schema validation
      const schema = z.object({
        flashcards: z.array(z.object({
          front: z.string(),
          back: z.string()
        })).min(1)
      });
      
      const result = schema.safeParse(raw);
      return result.success;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }

  private parseResponse(raw: unknown, format?: ResponseFormat): ChatResponse {
    // Log the raw response
    console.log('Raw API response:', JSON.stringify(raw, null, 2));
    // Cast raw to ApiRawResponse for structured property access
    const rawObj = raw as ApiRawResponse;
    const content = rawObj.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Invalid API response format:', rawObj);
      throw new ValidationError('Invalid response format from API');
    }

    let structured: unknown = null;
    if (format?.type === 'json_schema') {
      try {
        // If content is already an object, don't parse it
        if (typeof content === 'string') {
          structured = JSON.parse(content);
        } else {
          structured = content;
        }
        console.log('Parsed structured content:', JSON.stringify(structured, null, 2));
        
        if (!this.validateResponse(structured, format)) {
          console.error('Response validation failed:', structured);
          console.error('Expected schema:', format.json_schema.schema);
          throw new ValidationError('Response does not match schema');
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error('JSON parse error:', error);
          console.error('Content:', content);
          throw new ValidationError('Failed to parse JSON response');
        }
        throw error;
      }
    }

    return {
      content: typeof content === 'string' ? content : JSON.stringify(content),
      structured,
      model: rawObj.model || this.model // Use the model from response or fall back to the default
    };
  }

  private async handleError(response: FetchResponse): Promise<never> {
    const status = response.status;
    const retryAfter = response.headers.get('retry-after');

    switch (status) {
      case 401:
        throw new AuthenticationError();
      case 403:
        throw new OpenRouterError('Access forbidden - API key may be invalid or missing required permissions');
      case 429:
        throw new RateLimitError(
          retryAfter
            ? `Rate limit exceeded. Retry after ${retryAfter} seconds`
            : undefined
        );
      case 408:
        throw new OpenRouterError('Request timeout');
      case 500:
      case 501:
      case 502:
      case 503:
        throw new ServerError(`Server error occurred with status ${status} - The service may be temporarily unavailable`);
      case 504:
        throw new ServerError('Gateway timeout - The request took too long to process');
    }

    throw new OpenRouterError(`Unknown error occurred with status ${status}`);
  }

  public async sendChat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      params?: Record<string, unknown>;
      responseFormat?: ResponseFormat;
    }
  ): Promise<ChatResponse> {
    const payload = this.buildPayload(messages, options);
    console.log('Sending request to OpenRouter:', JSON.stringify(payload, null, 2));
    
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Prepare fetch options - keep it simple for Cloudflare compatibility
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
        // Add cf property for Cloudflare-specific settings
        cf: {
          // This instructs Cloudflare to cache the SSL certificates
          cacheTtl: 1800,
          // Tell Cloudflare to use its own trusted certificate store
          cacheEverything: true
        }
      };
      
      console.log('Using standard fetch API for compatibility');
      
      // Use the global fetch API available in Cloudflare
      const response = await fetch(`${this.baseUrl}/chat/completions`, fetchOptions);
      
      // Clear timeout after request completes
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Try to get more error details from response body
        try {
          const errorBody = await response.text();
          console.error('OpenRouter error response:', errorBody);
        } catch (bodyError) {
          console.error('Could not read error response body ', bodyError);
        }
        
        await this.handleError(response);
      }

      const data = await response.json();
      return this.parseResponse(data, options?.responseFormat);
    } catch (error) {
      // Clean up timeout if fetch throws
      clearTimeout(timeoutId);
      
      // Handle abort errors specifically
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new OpenRouterError('Request timeout after 30 seconds');
      }
      
      console.error('OpenRouter API error details:', error);
      
      if (error instanceof OpenRouterError) {
        throw error;
      }
      
      throw new OpenRouterError(error instanceof Error 
        ? `Network error: ${error.name} - ${error.message}` 
        : 'Unknown network error occurred');
    }
  }
} 