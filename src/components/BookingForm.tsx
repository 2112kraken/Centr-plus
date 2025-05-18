'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Типы для шагов формы
type Step = 'range' | 'datetime' | 'contact';

// Интерфейс для дистанции
interface Range {
  id: string;
  title: string;
  length: number;
  available: boolean;
}

// Схема валидации для формы
const bookingFormSchema = z.object({
  // Шаг 1: Выбор дистанции
  rangeId: z.string().min(1, 'required'),
  
  // Шаг 2: Выбор даты и времени
  date: z.string().min(1, 'required'),
  time: z.string().min(1, 'required'),
  duration: z.number().min(1).max(8),
  
  // Шаг 3: Контактная информация
  name: z.string().min(2, 'required'),
  phone: z.string().min(10, 'invalidPhone').max(20),
  email: z.string().email('invalidEmail'),
  comment: z.string().optional(),
});

// Тип данных формы
type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  ranges: Range[];
  onSubmit: (data: BookingFormData) => void;
  className?: string;
}

/**
 * Форма для пошагового бронирования
 * Содержит 3 шага: выбор дистанции, выбор даты/времени, ввод контактной информации
 * Использует React-Hook-Form + Zod для валидации
 */
export default function BookingForm({
  ranges,
  onSubmit,
  className = '',
}: BookingFormProps) {
  const t = useTranslations('bookingForm');
  const [currentStep, setCurrentStep] = useState<Step>('range');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Инициализация формы с React-Hook-Form и Zod
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const methods = useForm<BookingFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      rangeId: '',
      date: '',
      time: '',
      duration: 1,
      name: '',
      phone: '',
      email: '',
      comment: '',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    register,
    handleSubmit,
    formState: { errors /* isValid */ },
    trigger,
    watch 
  } = methods;

  // Отслеживаем значение выбранной дистанции
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const selectedRangeId = watch('rangeId');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedRange = ranges.find(range => range.id === selectedRangeId);

  // Обработчик перехода к следующему шагу
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    // Определяем поля для валидации в зависимости от текущего шага
    if (currentStep === 'range') {
      fieldsToValidate = ['rangeId'];
    } else if (currentStep === 'datetime') {
      fieldsToValidate = ['date', 'time', 'duration'];
    }
    
    // Валидируем поля текущего шага
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      // Переходим к следующему шагу
      if (currentStep === 'range') {
        setCurrentStep('datetime');
      } else if (currentStep === 'datetime') {
        setCurrentStep('contact');
      }
    }
  };

  // Обработчик перехода к предыдущему шагу
  const handlePrevStep = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('range');
    } else if (currentStep === 'contact') {
      setCurrentStep('datetime');
    }
  };

  // Обработчик отправки формы
  const handleFormSubmit: SubmitHandler<BookingFormData> = (data) => {
    setIsSubmitting(true);
    
    // Вызываем обработчик, переданный из родительского компонента
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    onSubmit(data);
    
    // Показываем сообщение об успешной отправке
    setIsSuccess(true);
    
    // Очистка формы
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    methods.reset();
  };

  // Генерация опций для выбора времени (с 9:00 до 20:00)
  const timeOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00`;
  });

  // Генерация опций для выбора продолжительности (от 1 до 8 часов)
  const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Заголовок формы */}
      <div className="bg-[var(--clr-base)] text-white p-6">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="mt-1 text-white/80">{t('subtitle')}</p>
      </div>

      {/* Индикатор шагов */}
      <div className="flex border-b border-gray-200">
        <div 
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${
            currentStep === 'range' 
              ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
              : 'text-gray-500'
          }`}
        >
          1. {t('step1')}
        </div>
        <div 
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${
            currentStep === 'datetime' 
              ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
              : 'text-gray-500'
          }`}
        >
          2. {t('step2')}
        </div>
        <div 
          className={`flex-1 py-4 px-2 text-center font-medium text-sm ${
            currentStep === 'contact' 
              ? 'text-[var(--clr-accent)] border-b-2 border-[var(--clr-accent)]' 
              : 'text-gray-500'
          }`}
        >
          3. {t('step3')}
        </div>
      </div>

      {/* Форма */}
      {isSuccess ? (
        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <svg 
              className="h-5 w-5 text-green-500 mt-0.5" 
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
            <p className="ml-3 text-green-800">{t('success')}</p>
          </div>
        </div>
      ) : (
        <FormProvider {...methods}>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            {/* Шаг 1: Выбор дистанции */}
            {currentStep === 'range' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="rangeId" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('range')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rangeId"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('rangeId')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.rangeId ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">{t('selectRange')}</option>
                    {ranges.map(range => (
                      <option 
                        key={range.id} 
                        value={range.id}
                        disabled={!range.available}
                      >
                        {range.title} ({range.length} {t('meters')})
                      </option>
                    ))}
                  </select>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.rangeId && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.rangeId.message ?? 'required')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Шаг 2: Выбор даты и времени */}
            {currentStep === 'datetime' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('date')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('date')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.date ? 'border-red-300' : ''
                    }`}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.date.message ?? 'required')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('time')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="time"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('time')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.time ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">--:--</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.time.message ?? 'required')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('duration')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="duration"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('duration', { valueAsNumber: true })}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.duration ? 'border-red-300' : ''
                    }`}
                  >
                    {durationOptions.map(hours => (
                      <option key={hours} value={hours}>
                        {hours} {hours === 1 ? t('hour') : (hours < 5 ? t('hours') : t('hours2'))}
                      </option>
                    ))}
                  </select>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.duration.message ?? 'required')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Шаг 3: Контактная информация */}
            {currentStep === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('name')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.name.message ?? 'required')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('phone')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.phone ? 'border-red-300' : ''
                    }`}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.phone.message ?? 'invalidPhone')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('email')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] ${
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                      errors.email ? 'border-red-300' : ''
                    }`}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                      {t(errors.email.message ?? 'invalidEmail')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('comment')}
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
                    {...register('comment')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)]"
                  />
                </div>
              </div>
            )}

            {/* Кнопки навигации */}
            <div className="mt-8 flex justify-between">
              {currentStep !== 'range' ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)]"
                >
                  {t('back')}
                </button>
              ) : (
                <div></div>
              )}

              {currentStep !== 'contact' ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--clr-base)] hover:bg-[var(--clr-base-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)]"
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)] ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[var(--clr-accent)] hover:bg-[var(--clr-accent-hover)] text-[#1B1B1B]'
                  }`}
                >
                  {isSubmitting ? '...' : t('submit')}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}