'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import GradientSection from './GradientSection';
import BookingForm from './BookingForm';
import { z } from 'zod';
import { api } from '~/trpc/react';

// Схема данных формы бронирования (должна соответствовать схеме в BookingForm)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bookingFormSchema = z.object({
  rangeId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.number().min(1).max(8),
  name: z.string().min(2),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  comment: z.string().optional(),
});

// Тип данных формы
type BookingFormData = z.infer<typeof bookingFormSchema>;

// Моковые данные для стрелковых дистанций
const mockRanges = [
  {
    id: 'range-25m',
    title: 'Тир 25 метрів',
    titleEn: '25m Range',
    length: 25,
    available: true
  },
  {
    id: 'range-50m',
    title: 'Тир 50 метрів',
    titleEn: '50m Range',
    length: 50,
    available: true
  },
  {
    id: 'range-100m',
    title: 'Тир 100 метрів',
    titleEn: '100m Range',
    length: 100,
    available: true
  }
];

interface BookingStepperProps {
  locale?: string;
}

/**
 * Компонент страницы бронирования с 3-шаговой формой
 * Использует компонент BookingForm для отображения формы
 * Отправляет данные через tRPC в NestJS
 */
export default function BookingStepper({ locale = 'uk' }: BookingStepperProps) {
  const t = useTranslations('bookingForm');
  // Состояние успешной отправки формы
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Используем хук tRPC для мутации
  const createBooking = api.booking.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      alert(t('success'));
    },
    onError: (error) => {
      console.error('Error submitting booking:', error);
      alert(t('error'));
    }
  });

  // Подготовка данных дистанций для формы
  const ranges = mockRanges.map(range => ({
    id: range.id,
    title: locale === 'uk' ? range.title : range.titleEn,
    length: range.length,
    available: range.available
  }));

  // Обработчик отправки формы
  const handleSubmit = (data: BookingFormData) => {
    console.log('Booking data:', data);
    
    // Вызываем мутацию через хук, созданный выше
    createBooking.mutate({
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      duration: data.duration,
      rangeId: data.rangeId,
      comment: data.comment
    });
  };

  return (
    <div className="flex flex-col">
      {/* Заголовок */}
      <GradientSection className="py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </GradientSection>

      {/* Форма бронирования */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {isSuccess ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  className="h-8 w-8 text-green-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('success')}</h2>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-6 py-2 bg-[var(--clr-base)] text-white rounded-lg hover:bg-[var(--clr-base-light)] transition-colors"
              >
                {t('back')}
              </button>
            </div>
          ) : (
            <BookingForm 
              ranges={ranges} 
              onSubmit={handleSubmit} 
              className="shadow-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}