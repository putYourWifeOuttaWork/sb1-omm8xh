import { API_CONFIG, getHeaders } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: new Headers({
        ...Object.fromEntries(headers.entries()),
        ...Object.fromEntries(new Headers(options.headers || {}).entries())
      }),
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout');
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function fetchWithRetry<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < API_CONFIG.MAX_RETRIES; attempt++) {
    try {
      return await fetchApi<T>(endpoint, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error instanceof ApiError && error.status === 401) {
        break;
      }
      
      if (attempt < API_CONFIG.MAX_RETRIES - 1) {
        const delay = API_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        await getAppCheckToken(true); // Force refresh token on retry
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Max retries exceeded'
  };
}