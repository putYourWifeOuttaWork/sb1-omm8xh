import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Phone, ArrowRight } from 'lucide-react';

interface PhoneAuthUIProps {
  onSuccess?: () => void;
}

export function PhoneAuthUI({ onSuccess }: PhoneAuthUIProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        callback: (response: any) => {
          // reCAPTCHA solved, continue with phone auth
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
          if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
            delete (window as any).recaptchaVerifier;
          }
        }
      });
    }
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    try {
      setupRecaptcha();
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      const result = await signInWithPhoneNumber(
        auth, 
        formattedNumber,
        (window as any).recaptchaVerifier
      );
      setConfirmationResult(result);
      setVerificationId(result.verificationId);
    } catch (err) {
      console.error('Error sending code:', err);
      setError('Failed to send verification code. Please try again.');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        delete (window as any).recaptchaVerifier;
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!confirmationResult) {
      setError('Please request a verification code first.');
      return;
    }

    try {
      const credential = await confirmationResult.confirm(verificationCode);
      if (credential.user) {
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {!verificationId ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 555-5555"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>
          
          <div id="recaptcha-container"></div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-accent-blue dark:bg-accent-teal 
              text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            <span>Send Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-accent-blue dark:bg-accent-teal 
              text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            <span>Verify Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}