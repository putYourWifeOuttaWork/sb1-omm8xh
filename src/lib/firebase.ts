import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  EmailAuthProvider, 
  PhoneAuthProvider,
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyARAwqPtLidvBiNWJ6SBm4d-qR3KNtCacQ",
  authDomain: "deflationproof.firebaseapp.com",
  projectId: "deflationproof",
  storageBucket: "deflationproof.firebasestorage.app",
  messagingSenderId: "916854852623",
  appId: "1:916854852623:web:a68fd1d16a0b1aa174a77a",
  measurementId: "G-0307BX3BGK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Email link authentication settings
export const actionCodeSettings = {
  url: window.location.origin + '/auth/email-signin',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.deflationproof.ios'
  },
  android: {
    packageName: 'com.deflationproof.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'deflationproof.page.link'
};

// Initialize Firebase UI
let uiInstance: firebaseui.auth.AuthUI | null = null;

export const getUI = () => {
  if (!uiInstance) {
    uiInstance = new firebaseui.auth.AuthUI(auth);
  }
  return uiInstance;
};

// Configure FirebaseUI
export const uiConfig: firebaseui.auth.Config = {
  signInOptions: [
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        prompt: 'select_account'
      }
    },
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    },
    {
      provider: PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image',
        size: 'normal',
        badge: 'bottomleft'
      },
      defaultCountry: 'US'
    }
  ],
  signInFlow: 'popup',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

// Email link authentication helpers
export const sendSignInLink = async (email: string) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return true;
  } catch (error) {
    console.error('Error sending sign in link:', error);
    return false;
  }
};

export const completeSignInWithEmailLink = async () => {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;

  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }
  if (!email) return null;

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
    return result;
  } catch (error) {
    console.error('Error signing in with email link:', error);
    return null;
  }
};