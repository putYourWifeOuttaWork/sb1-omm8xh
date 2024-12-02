import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { hasAdminAccess } from '../utils/permissions';
import { fetchUsers, updateUserTier, deleteUser } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Trash2, Edit, Search, Shield, RefreshCw } from 'lucide-react';
import { UserTable } from '../components/admin/UserTable';
import { UserProfile } from '../types/user';
import { useUserProfile } from '../hooks/useUserProfile';

export function AdminPanel() {
  const [user] = useAuthState(auth);
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || !hasAdminAccess(profile)) {
      navigate('/');
      return;
    }

    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await fetchUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  const handleUpdateTier = async (userId: string, tier: 'admin' | 'paid' | 'unpaid') => {
    try {
      await updateUserTier(userId, tier);
      loadUsers();
    } catch (error) {
      console.error('Error updating user tier:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !hasAdminAccess(profile)) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-element rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Admin Panel
          </h1>
          <button
            onClick={loadUsers}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onDeleteUser={handleDeleteUser}
              onUpdateTier={handleUpdateTier}
            />
          )}
        </div>
      </div>
    </div>
  );
}