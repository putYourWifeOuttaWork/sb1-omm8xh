import React, { useState } from 'react';
import { sendSignInLink } from '../../lib/firebase';
import { Mail } from 'lucide-react';

interface EmailLinkAuthProps {
  onClose: () => void;
}

export function EmailLinkAuth({ onClose }: EmailLinkAuthProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const success = await sendSignInLink(email);
      if (success) {
        setStatus('sent');
      } else {
        throw new Error('Failed to send sign in link');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to send sign in link. Please try again.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center">
        <Mail className="w-12 h-12 mx-auto text-accent-blue dark:text-accent-teal mb-4" />
        <h3 className="text-lg font-semibold mb-2">Check your email</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We sent a sign in link to {email}
        </p>
        <button
          onClick={onClose}
          className="text-accent-blue dark:text-accent-teal hover:underline"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
            bg-white dark:bg-dark-element text-gray-900 dark:text-white"
          placeholder="Enter your email"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-accent-blue dark:bg-accent-teal text-white py-3 rounded-lg
          hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Sign In Link'}
      </button>
    </form>
  );
}