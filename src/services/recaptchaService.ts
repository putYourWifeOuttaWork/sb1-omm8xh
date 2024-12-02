import { fetchWithRetry } from './apiService';

const RECAPTCHA_SECRET_KEY = '6Lc8RZAqAAAAACTS6_7-TLx1bivtK-xEc9dxHxmc';
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export async function verifyRecaptchaToken(token: string, expectedAction: string): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    });

    const response = await fetchWithRetry(`${VERIFY_URL}?${params}`, {
      method: 'POST'
    });

    const data = await response.json() as RecaptchaVerifyResponse;

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    // Verify the action matches what we expect
    if (data.action !== expectedAction) {
      console.error('reCAPTCHA action mismatch:', { expected: expectedAction, received: data.action });
      return false;
    }

    // Check the score - 0.5 is a recommended threshold
    return data.score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}