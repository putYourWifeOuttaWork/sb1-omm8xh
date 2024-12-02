import { getAppCheckToken } from '../lib/appCheck';

const API_BASE_URL = 'https://us-central1-deflationproof.cloudfunctions.net';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchWithAppCheck<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getAppCheckToken();
    if (!token) {
      throw new Error('Failed to get App Check token');
    }

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('X-Firebase-AppCheck', token);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function fetchWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<ApiResponse<T>> {
  try {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetchWithAppCheck<T>(endpoint, options);
        if (response.success) return response;
        lastError = new Error(response.error || 'Request failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
          await getAppCheckToken(true); // Force refresh token on retry
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}