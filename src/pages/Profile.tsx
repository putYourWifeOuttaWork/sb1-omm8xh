import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { User, Settings, Mail, LogOut, Key, AlertTriangle, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile, updateEmail, sendEmailVerification, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { TIER_LABELS } from '../utils/permissions';

export function Profile() {
  const [user, loading] = useAuthState(auth);
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updateMessage, setUpdateMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (user) {
        await updateProfile(user, { displayName });
        if (email !== user.email) {
          await updateEmail(user, email);
        }
        setUpdateMessage('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      setUpdateMessage('Failed to update profile. Please try again.');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
        setUpdateMessage('Verification email sent!');
      }
    } catch (error) {
      setUpdateMessage('Failed to send verification email.');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (user?.email) {
        await sendPasswordResetEmail(auth, user.email);
        setUpdateMessage('Password reset email sent!');
      }
    } catch (error) {
      setUpdateMessage('Failed to send password reset email.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await deleteUser(user);
        navigate('/');
      }
    } catch (error) {
      setUpdateMessage('Failed to delete account. You may need to re-authenticate.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-element rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <User className="w-6 h-6 mr-2" />
            Profile Settings
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          {updateMessage && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
              {updateMessage}
            </div>
          )}

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Display Name</div>
                      <div className="font-medium">{user.displayName || 'Not set'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </div>
                  {!user.emailVerified && (
                    <button
                      onClick={handleVerifyEmail}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Verify Email
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Account Status */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Account Status
          </h2>
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Membership Level:</span>
              <span className="font-medium text-accent-blue dark:text-accent-teal">
                {TIER_LABELS[profile?.tier || 'unpaid']}
              </span>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </h2>
          <div className="bg-gray-50 dark:bg-dark-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-dark-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    Last login
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Security
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleResetPassword}
              className="w-full p-4 bg-gray-50 dark:bg-dark-200 rounded-lg text-left hover:bg-gray-100 
                dark:hover:bg-dark-300 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-700 dark:text-gray-300">Reset Password</span>
              <Key className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left hover:bg-red-100 
                dark:hover:bg-red-900/30 transition-colors flex items-center justify-between"
            >
              <span className="text-red-700 dark:text-red-300">Delete Account</span>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-element rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Delete Account?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}