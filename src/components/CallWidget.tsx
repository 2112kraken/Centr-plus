'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Компонент кнопки обратного звонка Binotel
 * Фиксированная кнопка в правом нижнем углу экрана
 * Использует цвет акцента --clr-accent
 */
export default function CallWidget() {
  const t = useTranslations('callWidget');
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Функция для валидации номера телефона
  const isValidPhone = (phone: string) => {
    // Простая валидация: должно быть не менее 10 цифр
    return phone.replace(/\D/g, '').length >= 10;
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPhone(phone)) return;
    
    setIsSubmitting(true);
    
    // Имитация отправки запроса на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Сбрасываем состояние через 3 секунды
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setPhone('');
        setName('');
      }, 3000);
    }, 1000);
  };

  return (
    <>
      {/* Кнопка вызова виджета */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[var(--clr-accent)] text-[#1B1B1B] shadow-lg flex items-center justify-center hover:bg-[var(--clr-accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--clr-accent)]"
        aria-label={t('callbackButton')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" 
          />
        </svg>
      </button>

      {/* Модальное окно */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Затемнение фона */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            ></div>

            {/* Центрирование модального окна */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            {/* Содержимое модального окна */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--clr-accent)] sm:mx-0 sm:h-10 sm:w-10">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-[#1B1B1B]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" 
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {t('title')}
                    </h3>
                    <div className="mt-4">
                      {submitted ? (
                        <div className="rounded-md bg-green-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-green-400" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor" 
                                aria-hidden="true"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">
                                {t('success')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              {t('name')}
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)] sm:text-sm"
                              placeholder={t('namePlaceholder')}
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              {t('phone')}
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                phone && !isValidPhone(phone)
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-[var(--clr-accent)] focus:ring-[var(--clr-accent)]'
                              }`}
                              placeholder={t('phonePlaceholder')}
                              required
                            />
                            {phone && !isValidPhone(phone) && (
                              <p className="mt-1 text-sm text-red-600">
                                {t('phoneError')}
                              </p>
                            )}
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {!submitted && (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!phone || !isValidPhone(phone) || isSubmitting}
                      className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-[#1B1B1B] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        !phone || !isValidPhone(phone) || isSubmitting
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[var(--clr-accent)] hover:bg-[var(--clr-accent-hover)] focus:ring-[var(--clr-accent)]'
                      }`}
                    >
                      {isSubmitting ? t('sending') : t('submit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      {t('cancel')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}