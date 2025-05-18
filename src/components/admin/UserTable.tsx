'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface UserTableProps {
  locale?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  createdAt: string;
  lastLogin?: string;
}

/**
 * Компонент для управления пользователями
 * Предоставляет функциональность для управления ролями и приглашениями
 */
export default function UserTable({ locale = 'uk' }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      email: 'admin@centerplus.ua',
      name: 'Адміністратор',
      role: 'ADMIN',
      createdAt: '2025-01-01T10:00:00Z',
      lastLogin: '2025-05-18T09:30:00Z'
    },
    {
      id: 'user-2',
      email: 'manager@centerplus.ua',
      name: 'Менеджер',
      role: 'EDITOR',
      createdAt: '2025-02-15T14:30:00Z',
      lastLogin: '2025-05-17T16:45:00Z'
    },
    {
      id: 'user-3',
      email: 'staff@centerplus.ua',
      name: 'Співробітник',
      role: 'VIEWER',
      createdAt: '2025-03-10T09:15:00Z',
      lastLogin: '2025-05-15T11:20:00Z'
    }
  ]);
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('VIEWER');
  
  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });
  
  // Обработчик изменения роли пользователя
  const handleRoleChange = (userId: string, newRole: 'ADMIN' | 'EDITOR' | 'VIEWER') => {
    // В реальном приложении здесь был бы API-запрос
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };
  
  // Обработчик удаления пользователя
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // В реальном приложении здесь был бы API-запрос
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };
  
  // Обработчик отправки приглашения
  const handleSendInvite = () => {
    if (!newUserEmail) return;
    
    // В реальном приложении здесь был бы API-запрос
    const newUser: User = {
      id: `user-${users.length + 1}`,
      email: newUserEmail,
      name: newUserEmail.split('@')[0] ?? '', // Значение по умолчанию '', если результат undefined
      role: newUserRole,
      createdAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserRole('VIEWER');
    setIsInviteModalOpen(false);
  };
  
  // Получение локализованного названия роли
  const getRoleName = (role: string): string => {
    if (locale === 'uk') {
      switch (role) {
        case 'ADMIN': return 'Адміністратор';
        case 'EDITOR': return 'Редактор';
        case 'VIEWER': return 'Переглядач';
        default: return role;
      }
    } else {
      switch (role) {
        case 'ADMIN': return 'Administrator';
        case 'EDITOR': return 'Editor';
        case 'VIEWER': return 'Viewer';
        default: return role;
      }
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString?: string): string => {
    if (!dateString) return locale === 'uk' ? 'Ніколи' : 'Never';
    
    const date = new Date(dateString);
    
    if (locale === 'uk') {
      return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Управління користувачами' : 'User Management'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Управління ролями та запрошеннями користувачів' : 'Manage user roles and invitations'}
        </p>
      </div>
      
      {/* Панель инструментов */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder={locale === 'uk' ? 'Пошук користувачів...' : 'Search users...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--clr-accent)] focus:border-transparent"
              aria-label={locale === 'uk' ? 'Пошук користувачів' : 'Search users'}
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-3 py-2 bg-[var(--clr-accent)] text-[#1B1B1B] rounded-md hover:bg-[var(--clr-accent-hover)] transition-colors flex items-center"
            aria-label={locale === 'uk' ? 'Запросити користувача' : 'Invite user'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {locale === 'uk' ? 'Запросити' : 'Invite'}
          </button>
        </div>
      </div>
      
      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'uk' ? 'Користувач' : 'User'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'uk' ? 'Роль' : 'Role'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'uk' ? 'Створено' : 'Created'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'uk' ? 'Останній вхід' : 'Last Login'}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'uk' ? 'Дії' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[var(--clr-base)] rounded-full flex items-center justify-center text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')}
                      className="rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] text-sm"
                      aria-label={locale === 'uk' ? 'Змінити роль' : 'Change role'}
                    >
                      <option value="ADMIN">{getRoleName('ADMIN')}</option>
                      <option value="EDITOR">{getRoleName('EDITOR')}</option>
                      <option value="VIEWER">{getRoleName('VIEWER')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                      aria-label={locale === 'uk' ? 'Видалити' : 'Delete'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {locale === 'uk' ? 'Користувачів не знайдено' : 'No users found'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {locale === 'uk' 
                ? 'Спробуйте змінити параметри пошуку або запросіть нових користувачів' 
                : 'Try changing your search parameters or invite new users'}
            </p>
          </div>
        )}
      </div>
      
      {/* Модальное окно приглашения */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--clr-base)]/10 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-[var(--clr-base)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {locale === 'uk' ? 'Запросити користувача' : 'Invite User'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          {locale === 'uk' ? 'Email адреса' : 'Email address'}
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                          placeholder={locale === 'uk' ? 'email@example.com' : 'email@example.com'}
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          {locale === 'uk' ? 'Роль' : 'Role'}
                        </label>
                        <select
                          id="role"
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--clr-accent)] focus:border-[var(--clr-accent)]"
                        >
                          <option value="ADMIN">{getRoleName('ADMIN')}</option>
                          <option value="EDITOR">{getRoleName('EDITOR')}</option>
                          <option value="VIEWER">{getRoleName('VIEWER')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSendInvite}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--clr-accent)] text-base font-medium text-[#1B1B1B] hover:bg-[var(--clr-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {locale === 'uk' ? 'Запросити' : 'Invite'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {locale === 'uk' ? 'Скасувати' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно удаления */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {locale === 'uk' ? 'Видалити користувача' : 'Delete User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {locale === 'uk'
                          ? `Ви впевнені, що хочете видалити користувача ${selectedUser.name} (${selectedUser.email})? Ця дія не може бути скасована.`
                          : `Are you sure you want to delete user ${selectedUser.name} (${selectedUser.email})? This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {locale === 'uk' ? 'Видалити' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {locale === 'uk' ? 'Скасувати' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}