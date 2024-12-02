import React from 'react';
import { X, Shield } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { MAX_FREE_POSITIONS } from '../utils/permissions';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  showSignIn?: boolean;
}

export function UpgradeModal({ isOpen, onClose, showSignIn }: UpgradeModalProps) {
  const [user] = useAuthState(auth);
  
  const handleSignIn = () => {
    onClose();
    (window as any).openAuthModal?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-dark-element rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-accent-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In Required
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You've hit your limit of free management. Please Sign-in.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" />
            <span className="text-gray-700 dark:text-gray-300">
              Sign in to create unlimited positions
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-accent-blue flex-shrink-0 mt-1" />
            <span className="text-gray-700 dark:text-gray-300">
              Get access to the Community section
            </span>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          className="w-full bg-accent-blue dark:bg-accent-teal text-white py-3 rounded-lg
            hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span>Sign In to Continue</span>
        </button>
      </div>
    </div>
  );
}