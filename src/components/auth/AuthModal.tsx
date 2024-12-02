import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FirebaseAuthUI } from './FirebaseAuthUI';
import { EmailLinkAuth } from './EmailLinkAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'default' | 'email-link'>('default');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm" data-auth-modal>
      <div className="bg-white dark:bg-dark-element rounded-xl p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sign In
        </h2>

        {authMethod === 'default' ? (
          <>
            <FirebaseAuthUI 
              signInSuccessUrl="/"
              onSignInSuccess={onClose}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMethod('email-link')}
                className="text-accent-blue dark:text-accent-teal hover:underline"
              >
                Sign in with magic link
              </button>
            </div>
          </>
        ) : (
          <>
            <EmailLinkAuth onClose={onClose} />
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMethod('default')}
                className="text-accent-blue dark:text-accent-teal hover:underline"
              >
                Back to other sign in options
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}