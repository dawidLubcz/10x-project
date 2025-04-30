import { z } from 'zod';
import fetch, { Response as FetchResponse } from 'node-fetch';
import https from 'node:https';

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
    schema: any;
  };
}

export interface ChatResponse {
  content: string;
  structured: any;
}

export interface OpenRouterOptions {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultParams?: Record<string, any>;
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
  private params: Record<string, any>;
  private readonly headers: HeadersInit;
  private readonly agent: https.Agent;

  constructor(options: OpenRouterOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://openrouter.ai/api/v1';
    this.model = options.defaultModel || 'qwen/qwen3-1.7b:free';
    this.params = options.defaultParams || {};
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://10x-project.vercel.app/',
      'X-Title': '10xCards'
    };
    // Create HTTPS agent that accepts all certificates
    this.agent = new https.Agent({
      rejectUnauthorized: false
    });
  }

  public setModel(model: string): void {
    this.model = model;
  }

  public setParams(params: Record<string, any>): void {
    this.params = params;
  }

  private buildPayload(
    messages: ChatMessage[],
    options?: {
      model?: string;
      params?: Record<string, any>;
      responseFormat?: ResponseFormat;
    }
  ): Record<string, any> {
    return {
      messages,
      model: options?.model || this.model,
      ...this.params,
      ...options?.params,
      response_format: options?.responseFormat,
    };
  }

  private validateResponse(raw: any, format?: ResponseFormat): boolean {
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

  private parseResponse(raw: any, format?: ResponseFormat): ChatResponse {
    console.log('Raw API response:', JSON.stringify(raw, null, 2));
    
    const content = raw.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Invalid API response format:', raw);
      throw new ValidationError('Invalid response format from API');
    }

    let structured = null;
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
    };
  }

  private async handleError(response: FetchResponse): Promise<never> {
    const status = response.status;
    const retryAfter = response.headers.get('retry-after');

    switch (status) {
      case 401:
        throw new AuthenticationError();
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
      case 504:
        throw new ServerError('Server error occurred');
    }

    throw new OpenRouterError('Unknown error occurred');
  }

  public async sendChat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      params?: Record<string, any>;
      responseFormat?: ResponseFormat;
    }
  ): Promise<ChatResponse> {
    const payload = this.buildPayload(messages, options);
    console.log('Sending request to OpenRouter:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        agent: this.agent
      });

      if (!response.ok) {
        await this.handleError(response);
      }

      const data = await response.json();
      return this.parseResponse(data, options?.responseFormat);
    } catch (error) {
      console.error('OpenRouter API error:', error);
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError(error instanceof Error ? error.message : 'Network error occurred');
    }
  }
} 