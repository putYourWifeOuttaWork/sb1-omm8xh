import { getAppCheckToken } from '../../lib/appCheck';

export const API_CONFIG = {
  BASE_URL: 'https://us-central1-deflationproof.cloudfunctions.net',
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000,
  TIMEOUT: 30000
};

export async function getHeaders(): Promise<Headers> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  const token = await getAppCheckToken();
  if (token) {
    headers.set('X-Firebase-AppCheck', token);
  }
  
  return headers;
}