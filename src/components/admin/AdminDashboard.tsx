'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AdminDashboardProps {
  locale?: string;
}

/**
 * Компонент главной страницы административной панели
 * Отображает KPI и графики доходов
 */
export default function AdminDashboard({ locale = 'uk' }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  // Моковые данные для KPI
  const kpiData = {
    totalBookings: 128,
    totalRevenue: 256000,
    averageBookingValue: 2000,
    completionRate: 92,
    newCustomers: 45,
    returningCustomers: 83,
  };
  
  // Моковые данные для графика доходов
  const revenueChartData = {
    day: [
      { date: '09:00', value: 2000 },
      { date: '10:00', value: 3500 },
      { date: '11:00', value: 5000 },
      { date: '12:00', value: 4500 },
      { date: '13:00', value: 3000 },
      { date: '14:00', value: 4000 },
      { date: '15:00', value: 6000 },
      { date: '16:00', value: 7500 },
      { date: '17:00', value: 8000 },
      { date: '18:00', value: 6500 },
      { date: '19:00', value: 4000 },
      { date: '20:00', value: 2500 },
    ],
    week: [
      { date: locale === 'uk' ? 'Пн' : 'Mon', value: 25000 },
      { date: locale === 'uk' ? 'Вт' : 'Tue', value: 32000 },
      { date: locale === 'uk' ? 'Ср' : 'Wed', value: 28000 },
      { date: locale === 'uk' ? 'Чт' : 'Thu', value: 35000 },
      { date: locale === 'uk' ? 'Пт' : 'Fri', value: 42000 },
      { date: locale === 'uk' ? 'Сб' : 'Sat', value: 52000 },
      { date: locale === 'uk' ? 'Нд' : 'Sun', value: 48000 },
    ],
    month: [
      { date: '1', value: 150000 },
      { date: '5', value: 180000 },
      { date: '10', value: 210000 },
      { date: '15', value: 240000 },
      { date: '20', value: 220000 },
      { date: '25', value: 260000 },
      { date: '30', value: 280000 },
    ],
    year: [
      { date: locale === 'uk' ? 'Січ' : 'Jan', value: 1500000 },
      { date: locale === 'uk' ? 'Лют' : 'Feb', value: 1800000 },
      { date: locale === 'uk' ? 'Бер' : 'Mar', value: 2100000 },
      { date: locale === 'uk' ? 'Кві' : 'Apr', value: 2400000 },
      { date: locale === 'uk' ? 'Тра' : 'May', value: 2200000 },
      { date: locale === 'uk' ? 'Чер' : 'Jun', value: 2600000 },
      { date: locale === 'uk' ? 'Лип' : 'Jul', value: 2800000 },
      { date: locale === 'uk' ? 'Сер' : 'Aug', value: 3000000 },
      { date: locale === 'uk' ? 'Вер' : 'Sep', value: 2900000 },
      { date: locale === 'uk' ? 'Жов' : 'Oct', value: 3200000 },
      { date: locale === 'uk' ? 'Лис' : 'Nov', value: 3500000 },
      { date: locale === 'uk' ? 'Гру' : 'Dec', value: 3800000 },
    ],
  };
  
  // Получаем данные для выбранного временного диапазона
  const currentChartData = revenueChartData[timeRange];
  
  // Находим максимальное значение для масштабирования графика
  const maxValue = Math.max(...currentChartData.map(item => item.value));
  
  // Форматирование чисел
  const formatNumber = (num: number): string => {
    if (locale === 'uk') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    } else {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };
  
  // Форматирование валюты
  const formatCurrency = (num: number): string => {
    if (locale === 'uk') {
      return `${formatNumber(num)} ₴`;
    } else {
      return `€${formatNumber(Math.round(num / 40))}`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'uk' ? 'Панель управління' : 'Dashboard'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {locale === 'uk' ? 'Огляд ключових показників ефективності' : 'Overview of key performance indicators'}
        </p>
      </div>
      
      {/* KPI карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {locale === 'uk' ? 'Загальна кількість бронювань' : 'Total Bookings'}
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{formatNumber(kpiData.totalBookings)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {locale === 'uk' ? 'з минулого місяця' : 'from last month'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {locale === 'uk' ? 'Загальний дохід' : 'Total Revenue'}
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(kpiData.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                18%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {locale === 'uk' ? 'з минулого місяця' : 'from last month'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* График доходов */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {locale === 'uk' ? 'Динаміка доходів' : 'Revenue Trends'}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'day'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати дані за день' : 'Show daily data'}
            >
              {locale === 'uk' ? 'День' : 'Day'}
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'week'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати дані за тиждень' : 'Show weekly data'}
            >
              {locale === 'uk' ? 'Тиждень' : 'Week'}
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'month'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати дані за місяць' : 'Show monthly data'}
            >
              {locale === 'uk' ? 'Місяць' : 'Month'}
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'year'
                  ? 'bg-[var(--clr-base)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={locale === 'uk' ? 'Показати дані за рік' : 'Show yearly data'}
            >
              {locale === 'uk' ? 'Рік' : 'Year'}
            </button>
          </div>
        </div>
        
        {/* Простой график на основе div */}
        <div className="h-80">
          <div className="flex h-full items-end space-x-2">
            {currentChartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[var(--clr-accent)] rounded-t-sm hover:bg-[var(--clr-accent-hover)] transition-all duration-200"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                  title={`${item.date}: ${formatCurrency(item.value)}`}
                ></div>
                <div className="text-xs text-gray-600 mt-2">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}