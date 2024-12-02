import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebase';

const RECAPTCHA_SITE_KEY = '6Lc8RZAqAAAAACeztsPRC3m1NK9QSsZ24PLYxSSK';

let appCheckInstance: ReturnType<typeof initializeAppCheck> | null = null;

export async function initializeAppCheckToken() {
  if (!appCheckInstance) {
    try {
      // Enable debug token in development
      if (process.env.NODE_ENV === 'development') {
        // @ts-ignore
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      // Initialize reCAPTCHA provider
      const provider = new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY);
      
      // Initialize App Check
      appCheckInstance = initializeAppCheck(app, {
        provider,
        isTokenAutoRefreshEnabled: true
      });

      console.log('App Check initialized successfully');
      return appCheckInstance;
    } catch (error) {
      console.error('Failed to initialize App Check:', error);
      return null;
    }
  }
  return appCheckInstance;
}

export async function getAppCheckToken(forceRefresh = false) {
  try {
    const instance = await initializeAppCheckToken();
    if (!instance) throw new Error('App Check not initialized');

    const token = await instance.getToken(forceRefresh);
    return token.token;
  } catch (error) {
    console.error('Error getting App Check token:', error);
    return null;
  }
}