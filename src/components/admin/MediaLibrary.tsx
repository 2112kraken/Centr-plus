'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface MediaLibraryProps {
  locale?: string;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: number;
  url: string;
  thumbnailUrl: string;
  uploadedAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

interface MediaFolder {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
}

type MediaItem = MediaFile | MediaFolder;

/**
 * Компонент для управления медиафайлами
 * Предоставляет интерфейс для загрузки, просмотра и удаления файлов в DigitalOcean Spaces
 */
export default function MediaLibrary({ locale = 'uk' }: MediaLibraryProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Моковые данные для медиафайлов
  const mockMediaItems: MediaItem[] = [
    {
      id: 'folder-1',
      name: 'images',
      itemCount: 24,
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 'folder-2',
      name: 'documents',
      itemCount: 8,
      createdAt: '2025-02-20T14:45:00Z'
    },
    {
      id: 'file-1',
      name: 'hero-banner.jpg',
      type: 'image',
      size: 1240000,
      url: 'https://example.com/hero-banner.jpg',
      thumbnailUrl: 'https://example.com/hero-banner-thumb.jpg',
      uploadedAt: '2025-04-10T09:15:00Z',
      dimensions: {
        width: 1920,
        height: 1080
      }
    },
    {
      id: 'file-2',
      name: 'price-list.pdf',
      type: 'document',
      size: 520000,
      url: 'https://example.com/price-list.pdf',
      thumbnailUrl: 'https://example.com/price-list-thumb.jpg',
      uploadedAt: '2025-04-15T11:30:00Z'
    },
    {
      id: 'file-3',
      name: 'range-tour.mp4',
      type: 'video',
      size: 15400000,
      url: 'https://example.com/range-tour.mp4',
      thumbnailUrl: 'https://example.com/range-tour-thumb.jpg',
      uploadedAt: '2025-05-01T16:45:00Z'
    },
    {
      id: 'file-4',
      name: 'logo.png',
      type: 'image',
      size: 45000,
      url: 'https://example.com/logo.png',
      thumbnailUrl: 'https://example.com/logo-thumb.png',
      uploadedAt: '2025-03-20T10:15:00Z',
      dimensions: {
        width: 500,
        height: 500
      }
    }
  ];
  
  // Фильтрация и сортировка медиафайлов
  const filteredAndSortedItems = (() => {
    // Фильтрация по поисковому запросу
    let items = mockMediaItems.filter(item => {
      if (!searchQuery) return true;
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    // Сортировка
    items = items.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'date') {
        const dateA = 'uploadedAt' in a ? a.uploadedAt : a.createdAt;
        const dateB = 'uploadedAt' in b ? b.uploadedAt : b.createdAt;
        return sortOrder === 'asc'
          ? new Date(dateA).getTime() - new Date(dateB).getTime()
          : new Date(dateB).getTime() - new Date(dateA).getTime();
      } else if (sortBy === 'size') {
        // Папки всегда в начале при сортировке по размеру
        if ('itemCount' in a && !('itemCount' in b)) return -1;
        if (!('itemCount' in a) && 'itemCount' in b) return 1;
        
        if ('size' in a && 'size' in b) {
          return sortOrder === 'asc' ? a.size - b.size : b.size - a.size;
        }
        
        return 0;
      }
      return 0;
    });
    
    // Папки всегда в начале списка
    items = [
      ...items.filter(item => 'itemCount' in item),
      ...items.filter(item => !('itemCount' in item))
    ];
    
    return items;
  })();
  
  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  
  // Обработчик выбора элемента
  const handleItemSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Обработчик удаления выбранных элементов
  const handleDeleteSelected = () => {
    // В реальном приложении здесь был бы API-запрос
    console.log(`Deleting items: ${selectedItems.join(', ')}`);
    setSelectedItems([]);
    setIsDeleteModalOpen(false);
  };
  
  // Обработчик перехода в папку
  const handleFolderOpen = (folderId: string) => {
    const folder = mockMediaItems.find(item => item.id === folderId);
    if (folder && 'itemCount' in folder) {
      setCurrentPath([...currentPath, folder.name]);
    }
  };
  
  // Обработчик возврата на уровень выше
  const handleGoBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };
  
  // Получение текущего пути в виде строки
  const getCurrentPathString = (): string => {
    return currentPath.length > 0 ? `/${currentPath.join('/')}` : '/';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Медіа бібліотека' : 'Media Library'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Управління медіафайлами' : 'Manage media files'}
        </p>
      </div>
      
      {/* Панель инструментов */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoBack}
              disabled={currentPath.length === 0}
              className={`p-2 rounded-md ${
                currentPath.length === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={locale === 'uk' ? 'Назад' : 'Back'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-sm text-gray-600">
              {getCurrentPathString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder={locale === 'uk' ? 'Пошук файлів...' : 'Search files...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--clr-accent)] focus:border-transparent"
                aria-label={locale === 'uk' ? 'Пошук файлів' : 'Search files'}
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
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={locale === 'uk' ? 'Сітка' : 'Grid view'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={locale === 'uk' ? 'Список' : 'List view'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as ['name' | 'date' | 'size', 'asc' | 'desc'];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] text-sm"
              aria-label={locale === 'uk' ? 'Сортувати за' : 'Sort by'}
            >
              <option value="name-asc">{locale === 'uk' ? 'Ім\'я (А-Я)' : 'Name (A-Z)'}</option>
              <option value="name-desc">{locale === 'uk' ? 'Ім\'я (Я-А)' : 'Name (Z-A)'}</option>
              <option value="date-desc">{locale === 'uk' ? 'Дата (нові спочатку)' : 'Date (newest first)'}</option>
              <option value="date-asc">{locale === 'uk' ? 'Дата (старі спочатку)' : 'Date (oldest first)'}</option>
              <option value="size-desc">{locale === 'uk' ? 'Розмір (великі спочатку)' : 'Size (largest first)'}</option>
              <option value="size-asc">{locale === 'uk' ? 'Розмір (малі спочатку)' : 'Size (smallest first)'}</option>
            </select>
            
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-2 bg-[var(--clr-accent)] text-[#1B1B1B] rounded-md hover:bg-[var(--clr-accent-hover)] transition-colors flex items-center"
              aria-label={locale === 'uk' ? 'Завантажити файли' : 'Upload files'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {locale === 'uk' ? 'Завантажити' : 'Upload'}
            </button>
            
            {selectedItems.length > 0 && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                aria-label={locale === 'uk' ? 'Видалити вибрані' : 'Delete selected'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {locale === 'uk' ? 'Видалити' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Сетка файлов */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAndSortedItems.map((item) => (
              <div 
                key={item.id}
                className={`relative rounded-lg border ${
                  selectedItems.includes(item.id)
                    ? 'border-[var(--clr-accent)] bg-[var(--clr-accent)]/10'
                    : 'border-gray-200 hover:border-gray-300'
                } overflow-hidden transition-colors cursor-pointer`}
                onClick={() => {
                  if ('itemCount' in item) {
                    handleFolderOpen(item.id);
                  } else {
                    handleItemSelect(item.id);
                  }
                }}
              >
                <div className="p-4">
                  {'itemCount' in item ? (
                    // Папка
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 flex items-center justify-center text-[var(--clr-base)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.itemCount} {locale === 'uk' ? 'елементів' : 'items'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Файл
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : item.type === 'document' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : item.type === 'video' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(item.size)}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Чекбокс для выбора */}
                {'uploadedAt' in item && (
                  <div className="absolute top-2 right-2">
                    <div 
                      className={`w-5 h-5 rounded-full border ${
                        selectedItems.includes(item.id)
                          ? 'bg-[var(--clr-accent)] border-[var(--clr-accent)]'
                          : 'bg-white border-gray-300'
                      } flex items-center justify-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemSelect(item.id);
                      }}
                    >
                      {selectedItems.includes(item.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {locale === 'uk' ? 'Немає файлів' : 'No files found'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {locale === 'uk' 
                  ? 'Завантажте файли або створіть нову папку' 
                  : 'Upload files or create a new folder'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Модальное окно удаления */}
      {isDeleteModalOpen && (
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
                      {locale === 'uk' ? 'Видалити вибрані файли' : 'Delete selected files'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {locale === 'uk'
                          ? `Ви впевнені, що хочете видалити ${selectedItems.length} вибраних файлів? Ця дія не може бути скасована.`
                          : `Are you sure you want to delete ${selectedItems.length} selected files? This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
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