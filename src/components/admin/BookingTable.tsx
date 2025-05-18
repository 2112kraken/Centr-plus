'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BookingTableProps {
  locale?: string;
}

// Интерфейс для данных бронирования
interface Booking {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  range: {
    id: string;
    title: string;
    length: number;
  };
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'canceled';
  paid: boolean;
  amount: number;
}

/**
 * Компонент таблицы бронирований для административной панели
 * Предоставляет CRUD-функциональность и календарь
 */
export default function BookingTable({ locale = 'uk' }: BookingTableProps) {
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Моковые данные для бронирований
  const mockBookings: Booking[] = [
    {
      id: 'booking-1',
      customer: {
        id: 'customer-1',
        name: 'Іван Петренко',
        email: 'ivan@example.com',
        phone: '+380501234567',
      },
      range: {
        id: 'range-1',
        title: locale === 'uk' ? 'Тир 50 метрів' : '50m Range',
        length: 50,
      },
      date: '2025-05-18',
      time: '14:00',
      duration: 2,
      status: 'confirmed',
      paid: true,
      amount: 4000,
    },
    {
      id: 'booking-2',
      customer: {
        id: 'customer-2',
        name: 'Олена Ковальчук',
        email: 'olena@example.com',
        phone: '+380671234567',
      },
      range: {
        id: 'range-2',
        title: locale === 'uk' ? 'Тир 25 метрів' : '25m Range',
        length: 25,
      },
      date: '2025-05-18',
      time: '16:00',
      duration: 1,
      status: 'pending',
      paid: false,
      amount: 2000,
    },
    {
      id: 'booking-3',
      customer: {
        id: 'customer-3',
        name: 'Михайло Сидоренко',
        email: 'mykhailo@example.com',
        phone: '+380931234567',
      },
      range: {
        id: 'range-3',
        title: locale === 'uk' ? 'Тир 100 метрів' : '100m Range',
        length: 100,
      },
      date: '2025-05-19',
      time: '10:00',
      duration: 2,
      status: 'confirmed',
      paid: true,
      amount: 6000,
    },
    {
      id: 'booking-4',
      customer: {
        id: 'customer-4',
        name: 'Наталія Шевченко',
        email: 'natalia@example.com',
        phone: '+380661234567',
      },
      range: {
        id: 'range-1',
        title: locale === 'uk' ? 'Тир 50 метрів' : '50m Range',
        length: 50,
      },
      date: '2025-05-19',
      time: '14:00',
      duration: 3,
      status: 'canceled',
      paid: false,
      amount: 6000,
    },
    {
      id: 'booking-5',
      customer: {
        id: 'customer-5',
        name: 'Андрій Мельник',
        email: 'andriy@example.com',
        phone: '+380981234567',
      },
      range: {
        id: 'range-2',
        title: locale === 'uk' ? 'Тир 25 метрів' : '25m Range',
        length: 25,
      },
      date: '2025-05-20',
      time: '12:00',
      duration: 2,
      status: 'confirmed',
      paid: true,
      amount: 4000,
    },
  ];
  
  // Фильтрация бронирований по статусу
  const filteredBookings = filterStatus === 'all' 
    ? mockBookings 
    : mockBookings.filter(booking => booking.status === filterStatus);
  
  // Пагинация
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Форматирование валюты
  const formatCurrency = (amount: number): string => {
    if (locale === 'uk') {
      return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₴`;
    } else {
      return `€${Math.round(amount / 40).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  };
  
  // Обработчик изменения статуса бронирования
  const handleStatusChange = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'canceled') => {
    // В реальном приложении здесь был бы API-запрос
    console.log(`Changing status of booking ${bookingId} to ${newStatus}`);
  };
  
  // Обработчик удаления бронирования
  const handleDeleteBooking = (bookingId: string) => {
    // В реальном приложении здесь был бы API-запрос
    console.log(`Deleting booking ${bookingId}`);
    setIsDeleteModalOpen(false);
  };
  
  // Получение статуса бронирования для отображения
  const getStatusLabel = (status: string): string => {
    if (locale === 'uk') {
      switch (status) {
        case 'pending': return 'Очікує';
        case 'confirmed': return 'Підтверджено';
        case 'canceled': return 'Скасовано';
        default: return status;
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending';
        case 'confirmed': return 'Confirmed';
        case 'canceled': return 'Canceled';
        default: return status;
      }
    }
  };
  
  // Получение класса для статуса бронирования
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Управління бронюваннями' : 'Booking Management'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Перегляд та управління бронюваннями тирів' : 'View and manage range bookings'}
        </p>
      </div>
      
      {/* Панель инструментов */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 text-sm rounded-md ${
                view === 'table'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати таблицю' : 'Show table view'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-2 text-sm rounded-md ${
                view === 'calendar'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати календар' : 'Show calendar view'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] text-sm"
              aria-label={locale === 'uk' ? 'Фільтрувати за статусом' : 'Filter by status'}
            >
              <option value="all">{locale === 'uk' ? 'Всі статуси' : 'All statuses'}</option>
              <option value="pending">{locale === 'uk' ? 'Очікує' : 'Pending'}</option>
              <option value="confirmed">{locale === 'uk' ? 'Підтверджено' : 'Confirmed'}</option>
              <option value="canceled">{locale === 'uk' ? 'Скасовано' : 'Canceled'}</option>
            </select>
            
            <button
              className="px-3 py-2 bg-[var(--clr-accent)] text-[#1B1B1B] rounded-md hover:bg-[var(--clr-accent-hover)] transition-colors"
              aria-label={locale === 'uk' ? 'Створити нове бронювання' : 'Create new booking'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Табличный вид */}
      {view === 'table' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Клієнт' : 'Customer'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Тир' : 'Range'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Дата/Час' : 'Date/Time'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Статус' : 'Status'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Оплата' : 'Payment'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'uk' ? 'Дії' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {booking.customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                          <div className="text-sm text-gray-500">{booking.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.range.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.date}</div>
                      <div className="text-sm text-gray-500">
                        {booking.time} - {
                          // Простой расчет времени окончания
                          (() => {
                            const timeParts = booking.time.split(':').map(Number);
                            const hours = timeParts[0] ?? 0; // Значение по умолчанию 0, если hours undefined
                            const minutes = timeParts[1] ?? 0; // Значение по умолчанию 0, если minutes undefined
                            const endHours = hours + booking.duration;
                            return `${endHours}:${minutes.toString().padStart(2, '0')}`;
                          })()
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(booking.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.paid 
                          ? (locale === 'uk' ? 'Оплачено' : 'Paid') 
                          : (locale === 'uk' ? 'Не оплачено' : 'Unpaid')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsEditModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          aria-label={locale === 'uk' ? 'Редагувати' : 'Edit'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          aria-label={locale === 'uk' ? 'Видалити' : 'Delete'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {locale === 'uk' 
                      ? `Показано ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredBookings.length)} із ${filteredBookings.length} результатів`
                      : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredBookings.length)} of ${filteredBookings.length} results`}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">{locale === 'uk' ? 'Попередня' : 'Previous'}</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-[var(--clr-accent)] border-[var(--clr-accent)] text-[#1B1B1B]'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">{locale === 'uk' ? 'Наступна' : 'Next'}</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Календарный вид (заглушка) */}
      {view === 'calendar' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {locale === 'uk' ? 'Календарний вигляд' : 'Calendar View'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {locale === 'uk' 
                ? 'Календарний вигляд буде реалізовано в наступних версіях.' 
                : 'Calendar view will be implemented in future versions.'}
            </p>
          </div>
        </div>
      )}
      
      {/* Модальное окно удаления */}
      {isDeleteModalOpen && selectedBooking && (
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
                      {locale === 'uk' ? 'Видалити бронювання' : 'Delete Booking'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {locale === 'uk'
                          ? `Ви впевнені, що хочете видалити бронювання для ${selectedBooking.customer.name}? Ця дія не може бути скасована.`
                          : `Are you sure you want to delete the booking for ${selectedBooking.customer.name}? This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
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