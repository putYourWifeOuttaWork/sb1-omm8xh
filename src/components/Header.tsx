import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, Shield, Crown } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { hasAdminAccess } from '../utils/permissions';
import { useUserProfile } from '../hooks/useUserProfile';
import { canAccessCommunity, TIER_LABELS } from '../utils/permissions';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  // Create ref to expose setIsAuthModalOpen
  const authModalRef = React.useRef({ setIsAuthModalOpen });
  
  // Update ref when setIsAuthModalOpen changes
  useEffect(() => {
    authModalRef.current.setIsAuthModalOpen = setIsAuthModalOpen;
  }, [setIsAuthModalOpen]);
  
  // Expose the ref globally
  useEffect(() => {
    (window as any).openAuthModal = () => authModalRef.current.setIsAuthModalOpen(true);
  }, []);
  const location = useLocation();
  const [user] = useAuthState(auth);
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      
      if (isMenuOpen && mobileMenu && menuButton) {
        if (!mobileMenu.contains(event.target as Node) && !menuButton.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Freedom', path: '/' },
    { name: 'Story', path: '/story' },
    ...(user && canAccessCommunity(profile) ? [{ name: 'Community', path: '/community' }] : []),
    { name: 'Manage', path: '/manage' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-element shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <button
              id="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden -ml-2 p-3 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <div className="ml-4 flex lg:ml-0">
              <span className="sr-only">DeflationProof</span>
              <Link 
                to="/" 
                className="text-2xl font-bold text-accent-blue dark:text-accent-teal"
                onClick={() => setIsMenuOpen(false)}
              >
DeflationProof              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-base font-medium ${
                  isActive(item.path)
                    ? 'text-accent-blue dark:text-accent-teal'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2 text-base font-medium text-accent-blue 
                  dark:text-accent-teal hover:opacity-80"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
            {user && (
              <div className="flex items-center space-x-4">
                {hasAdminAccess(profile) && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-base font-medium text-accent-purple 
                      dark:text-accent-purple hover:opacity-80"
                  >
                    <Shield className="w-5 h-5" />
                    <span>{TIER_LABELS[profile?.tier || 'unpaid']}</span>
                  </Link>
                )}
                {profile?.tier === 'paid' && (
                  <div className="flex items-center space-x-2 text-base font-medium text-accent-blue">
                    <Crown className="w-5 h-5" />
                    <span>{TIER_LABELS.paid}</span>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-base font-medium text-accent-blue 
                    dark:text-accent-teal hover:opacity-80"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-base font-medium text-red-600 
                    dark:text-red-400 hover:opacity-80"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden fixed inset-x-0 top-[73px] z-50 transform transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
          }`}
        >
          <div className="bg-white dark:bg-dark-element shadow-lg rounded-b-lg">
            <div className="py-2 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md text-base font-medium min-h-[44px] ${
                    isActive(item.path)
                      ? 'text-accent-blue dark:text-accent-teal bg-blue-50 dark:bg-dark-200'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth/Profile Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                {!user && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center px-4 py-3 text-base font-medium text-accent-blue 
                      dark:text-accent-teal hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md min-h-[44px]"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span>Sign In</span>
                  </button>
                )}
                {user && (
                  <>
                    {hasAdminAccess(profile) && (
                      <Link
                        to="/admin"
                        className="w-full flex items-center px-4 py-3 text-base font-medium text-accent-purple 
                          dark:text-accent-purple hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md min-h-[44px]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5 mr-3" />
                        <span>{TIER_LABELS[profile?.tier || 'unpaid']}</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="w-full flex items-center px-4 py-3 text-base font-medium text-accent-blue 
                        dark:text-accent-teal hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md min-h-[44px]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-base font-medium text-red-600 
                        dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md min-h-[44px]"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}