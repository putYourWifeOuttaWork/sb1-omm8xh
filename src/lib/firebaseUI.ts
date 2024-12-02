import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { Auth } from 'firebase/auth';

let uiInstance: firebaseui.auth.AuthUI | null = null;

export function initializeUI(auth: Auth) {
  if (!uiInstance) {
    uiInstance = new firebaseui.auth.AuthUI(auth);
  }
  return uiInstance;
}