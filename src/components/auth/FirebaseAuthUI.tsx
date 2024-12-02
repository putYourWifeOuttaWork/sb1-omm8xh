import React, { useEffect } from 'react';
import { auth, getUI, uiConfig } from '../../lib/firebase';
import 'firebaseui/dist/firebaseui.css';

interface FirebaseAuthUIProps {
  signInSuccessUrl: string;
  onSignInSuccess?: () => void;
}

export function FirebaseAuthUI({ signInSuccessUrl, onSignInSuccess }: FirebaseAuthUIProps) {
  useEffect(() => {
    const ui = getUI();
    const container = document.getElementById('firebaseui-auth-container');
    if (!ui || !container) return;

    const config = {
      ...uiConfig,
      callbacks: {
        ...uiConfig.callbacks,
        signInSuccessWithAuthResult: (authResult: any) => {
          if (onSignInSuccess) {
            onSignInSuccess();
          }
          return false;
        }
      },
      signInSuccessUrl
    };

    ui.start('#firebaseui-auth-container', config);

    return () => {
      ui?.reset();
    };
  }, [signInSuccessUrl, onSignInSuccess]);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div id="firebaseui-auth-container" className="w-full"></div>
    </div>
  );
}