import React from 'react';
import { UserProfile } from '../../types/user';
import { formatCurrency } from '../../utils/formatters';
import { TIER_LABELS } from '../../utils/permissions';
import { Shield, User, CreditCard, Trash2 } from 'lucide-react';

interface UserTableProps {
  users: UserProfile[];
  onDeleteUser: (userId: string) => void;
  onUpdateTier: (userId: string, tier: 'admin' | 'paid' | 'unpaid') => void;
}

export function UserTable({ users, onDeleteUser, onUpdateTier }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-dark-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Positions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-element divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => {
            const lastPayment = user.paymentHistory?.[0];
            return (
              <tr key={user.uid}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-gray-400" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.tier}
                    onChange={(e) => onUpdateTier(user.uid, e.target.value as 'admin' | 'paid' | 'unpaid')}
                    className="text-sm bg-transparent border-0 focus:ring-0"
                  >
                    {Object.entries(TIER_LABELS).filter(([tier]) => user.email === 'weisbergmm@gmail.com' || tier !== 'admin').map(([tier, label]) => (
                      <option key={tier} value={tier}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.positionCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lastPayment ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(lastPayment.amount)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(lastPayment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No payments</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onDeleteUser(user.uid)}
                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}